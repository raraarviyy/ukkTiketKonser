// src/controllers/eventController.js
const prisma = require("../database");

const eventInclude = {
  category: true,
  ticket_types: true,
  organizer: {
    select: {
      id: true,
      name: true,
      email: true,
      organization_name: true,
      phone_number: true,
    },
  },
  reviews: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profile_picture: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  },
  _count: {
    select: {
      tickets: true,
      orders: true,
      favorites: true,
      reviews: true,
    },
  },
};

/**
 * Helper untuk menghitung rata-rata rating dan ringkasan ulasan pada event
 */
function attachEventMetrics(event) {
  if (!event) return event;
  const reviews = event.reviews || [];
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
      : 0;

  return {
    ...event,
    rating_summary: {
      average_rating: averageRating,
      total_reviews: totalReviews,
    },
  };
}

/**
 * List event untuk publik / user, dengan filter:
 * - search: cari di title / artist / venue / description
 * - artist: filter nama artis tertentu
 * - city: nama kota
 * - category: nama kategori (bisa multiple comma separated)
 * - category_id: filter ID kategori
 * - startDate / endDate / event_date: filter rentang tanggal
 * - maxPrice / minPrice: filter range harga tiket
 * - status: status event (default publik: 'approved', admin/organizer bisa filter 'pending'/'rejected'/'all')
 */
async function getEvents(req, res) {
  const {
    search,
    artist,
    city,
    category,
    category_id,
    startDate,
    endDate,
    event_date,
    minPrice,
    maxPrice,
    status,
  } = req.query;

  const where = {};

  // Otorisasi status: jika bukan Admin dan bukan meminta status khusus saat terotentikasi, tampilkan 'approved' saja
  if (status && status !== "all") {
    where.status = status;
  } else if (!status) {
    where.status = "approved";
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { artist: { contains: search, mode: "insensitive" } },
      { venue: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (artist) {
    where.artist = { contains: artist, mode: "insensitive" };
  }

  if (city) {
    where.city = { equals: city, mode: "insensitive" };
  }

  if (category_id) {
    where.category_id = Number(category_id);
  } else if (category) {
    const categoryNames = category.split(",").map((c) => c.trim());
    where.category = { name: { in: categoryNames, mode: "insensitive" } };
  }

  if (event_date) {
    const targetDate = new Date(event_date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    where.event_date = { gte: startOfDay, lte: endOfDay };
  } else if (startDate || endDate) {
    where.event_date = {};
    if (startDate) where.event_date.gte = new Date(startDate);
    if (endDate) where.event_date.lte = new Date(endDate);
  }

  if (minPrice || maxPrice) {
    where.ticket_types = {
      some: {
        price: {
          gte: minPrice ? Number(minPrice) : undefined,
          lte: maxPrice ? Number(maxPrice) : undefined,
        },
      },
    };
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { event_date: "asc" },
    include: eventInclude,
  });

  const data = events.map(attachEventMetrics);
  return res.json({ message: "success", data, ok: true });
}

/** Detail event by ID */
async function getEventById(req, res) {
  const id = Number(req.params.id);

  const event = await prisma.event.findUnique({
    where: { id },
    include: eventInclude,
  });

  if (!event) {
    return res.status(404).json({ message: "Event tidak ditemukan", ok: false });
  }

  // Jika event belum diapprove, hanya Admin dan Penyelenggara pemilik yang dapat melihat
  if (event.status !== "approved") {
    const isOwner = req.user && req.user.id === event.organizer_id;
    const isAdmin = req.user && req.user.role === "Admin";
    if (!isOwner && !isAdmin) {
      return res.status(404).json({ message: "Event tidak ditemukan atau belum disetujui", ok: false });
    }
  }

  return res.json({ message: "success", data: attachEventMetrics(event), ok: true });
}

/** Penyelenggara: mengambil semua event miliknya */
async function getMyOrganizedEvents(req, res) {
  const { status } = req.query;

  const where = { organizer_id: req.user.id };
  if (status && status !== "all") {
    where.status = status;
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: eventInclude,
  });

  const data = events.map(attachEventMetrics);
  return res.json({ message: "success", data, ok: true });
}

/** Buat event: Penyelenggara (status 'pending') atau Admin (status 'approved') */
async function createEvent(req, res) {
  const body = req.body;
  const isAdmin = req.user.role === "Admin";

  const category = await prisma.category.findUnique({ where: { id: body.category_id } });
  if (!category) {
    return res.status(404).json({ message: "Kategori tidak ditemukan", ok: false });
  }

  // Event yang dibuat Penyelenggara defaultnya 'pending' menunggu verifikasi Admin
  const status = isAdmin ? body.status || "approved" : "pending";
  const organizer_id = isAdmin && body.organizer_id ? body.organizer_id : req.user.id;

  const event = await prisma.event.create({
    data: {
      ...body,
      event_date: new Date(body.event_date),
      organizer_id,
      status,
      reject_reason: null,
    },
    include: eventInclude,
  });

  return res.status(201).json({
    message: isAdmin
      ? "Event berhasil dibuat"
      : "Event berhasil diajukan dan sedang menunggu verifikasi/moderasi Admin",
    data: attachEventMetrics(event),
    ok: true,
  });
}

/** Update event: Admin bisa update semua event, Penyelenggara hanya event miliknya */
async function updateEvent(req, res) {
  const id = Number(req.params.id);
  const body = req.body;
  const isAdmin = req.user.role === "Admin";

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Event tidak ditemukan", ok: false });
  }

  if (!isAdmin && existing.organizer_id !== req.user.id) {
    return res.status(403).json({ message: "Akses ditolak: bukan pemilik event ini", ok: false });
  }

  if (body.category_id) {
    const category = await prisma.category.findUnique({ where: { id: body.category_id } });
    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan", ok: false });
    }
  }

  // Penyelenggara tidak bisa mengubah status approve secara mandiri
  const updateData = { ...body };
  if (!isAdmin) {
    delete updateData.status;
    delete updateData.reject_reason;
    delete updateData.organizer_id;
  }

  if (updateData.event_date) {
    updateData.event_date = new Date(updateData.event_date);
  }

  const updated = await prisma.event.update({
    where: { id },
    data: updateData,
    include: eventInclude,
  });

  return res.json({ message: "Event berhasil diperbarui", data: attachEventMetrics(updated), ok: true });
}

/** Admin Moderasi: Verifikasi & ubah status event (approved / rejected / pending) */
async function moderateEventStatus(req, res) {
  const id = Number(req.params.id);
  const { status, reject_reason } = req.body;

  const existing = await prisma.event.findUnique({
    where: { id },
    include: { organizer: true },
  });

  if (!existing) {
    return res.status(404).json({ message: "Event tidak ditemukan", ok: false });
  }

  const updated = await prisma.event.update({
    where: { id },
    data: {
      status,
      reject_reason: status === "rejected" ? reject_reason || "Tidak memenuhi kriteria kelayakan" : null,
    },
    include: eventInclude,
  });

  // Kirim notifikasi ke penyelenggara jika ada
  if (existing.organizer_id) {
    await prisma.notification.create({
      data: {
        user_id: existing.organizer_id,
        title: status === "approved" ? "Event Anda Telah Disetujui!" : "Event Memerlukan Perbaikan / Ditolak",
        message:
          status === "approved"
            ? `Selamat! Event "${existing.title}" telah disetujui Admin dan kini tayang di aplikasi.`
            : `Event "${existing.title}" ditolak. Alasan: ${reject_reason || "Tidak memenuhi ketentuan platform."}`,
        type: "system",
      },
    });
  }

  return res.json({
    message: `Status event berhasil diubah menjadi ${status}`,
    data: attachEventMetrics(updated),
    ok: true,
  });
}

/** Hapus event: Admin atau Penyelenggara pemilik event */
async function deleteEvent(req, res) {
  const id = Number(req.params.id);
  const isAdmin = req.user.role === "Admin";

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Event tidak ditemukan", ok: false });
  }

  if (!isAdmin && existing.organizer_id !== req.user.id) {
    return res.status(403).json({ message: "Akses ditolak: bukan pemilik event ini", ok: false });
  }

  await prisma.event.delete({ where: { id } });
  return res.json({ message: "Event berhasil dihapus", ok: true });
}

module.exports = {
  getEvents,
  getEventById,
  getMyOrganizedEvents,
  createEvent,
  updateEvent,
  moderateEventStatus,
  deleteEvent,
};
