// src/controllers/reviewController.js
const prisma = require("../database");

const reviewInclude = {
  user: {
    select: { id: true, name: true, profile_picture: true },
  },
  event: {
    select: { id: true, title: true, artist: true, event_date: true, image: true },
  },
};

/**
 * User: Memberikan Rating & Ulasan terhadap event yang pernah dihadiri / dibeli tiketnya.
 */
async function createReview(req, res) {
  const { event_id, rating, comment } = req.body;
  const userId = req.user.id;

  const event = await prisma.event.findUnique({ where: { id: event_id } });
  if (!event) {
    return res.status(404).json({ message: "Event tidak ditemukan", ok: false });
  }

  // Cek apakah user sudah pernah memesan tiket event ini
  const hasPurchased = await prisma.order.findFirst({
    where: {
      user_id: userId,
      event_id,
      status: "paid",
    },
  });

  if (!hasPurchased && req.user.role === "User") {
    return res.status(403).json({
      message: "Anda hanya dapat memberikan ulasan untuk event yang tiketnya sudah pernah Anda beli",
      ok: false,
    });
  }

  // Cek apakah sudah pernah memberikan review
  const existingReview = await prisma.review.findUnique({
    where: {
      user_id_event_id: {
        user_id: userId,
        event_id,
      },
    },
  });

  if (existingReview) {
    return res.status(400).json({
      message: "Anda sudah memberikan ulasan untuk event ini. Silakan gunakan fitur ubah ulasan.",
      ok: false,
    });
  }

  const review = await prisma.review.create({
    data: {
      user_id: userId,
      event_id,
      rating,
      comment,
    },
    include: reviewInclude,
  });

  // Notifikasi ke Penyelenggara jika ada ulasan masuk
  if (event.organizer_id) {
    await prisma.notification.create({
      data: {
        user_id: event.organizer_id,
        title: `Ulasan Baru (Bintang ${rating})`,
        message: `${req.user.name} memberikan ulasan untuk "${event.title}": "${comment ? comment.substring(0, 60) : 'Tidak ada komentar'}"`,
        type: "system",
      },
    });
  }

  return res.status(201).json({ message: "Ulasan berhasil dikirim", data: review, ok: true });
}

/** Publik: Mendapatkan daftar ulasan untuk suatu event */
async function getReviewsByEvent(req, res) {
  const eventId = Number(req.params.eventId);

  const reviews = await prisma.review.findMany({
    where: { event_id: eventId },
    orderBy: { created_at: "desc" },
    include: reviewInclude,
  });

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
      : 0;

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    if (distribution[r.rating] !== undefined) distribution[r.rating]++;
  });

  return res.json({
    message: "success",
    summary: {
      average_rating: avgRating,
      total_reviews: totalReviews,
      distribution,
    },
    data: reviews,
    ok: true,
  });
}

/** User: Mengambil ulasan milik akun sendiri */
async function getMyReviews(req, res) {
  const data = await prisma.review.findMany({
    where: { user_id: req.user.id },
    orderBy: { created_at: "desc" },
    include: reviewInclude,
  });

  return res.json({ message: "success", data, ok: true });
}

/** User: Memperbarui ulasan milik sendiri */
async function updateReview(req, res) {
  const id = Number(req.params.id);
  const { rating, comment } = req.body;

  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Ulasan tidak ditemukan", ok: false });
  }

  if (existing.user_id !== req.user.id && req.user.role !== "Admin") {
    return res.status(403).json({ message: "Akses ditolak: bukan ulasan Anda", ok: false });
  }

  const updated = await prisma.review.update({
    where: { id },
    data: {
      rating: rating ?? existing.rating,
      comment: comment !== undefined ? comment : existing.comment,
    },
    include: reviewInclude,
  });

  return res.json({ message: "Ulasan berhasil diperbarui", data: updated, ok: true });
}

/** User / Admin: Menghapus ulasan */
async function deleteReview(req, res) {
  const id = Number(req.params.id);

  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Ulasan tidak ditemukan", ok: false });
  }

  if (existing.user_id !== req.user.id && req.user.role !== "Admin") {
    return res.status(403).json({ message: "Akses ditolak", ok: false });
  }

  await prisma.review.delete({ where: { id } });
  return res.json({ message: "Ulasan berhasil dihapus", ok: true });
}

/**
 * Penyelenggara: Manajemen Ulasan
 * Melihat seluruh feedback, rating, dan ulasan dari penonton untuk evaluasi acara.
 */
async function getOrganizerReviews(req, res) {
  const { event_id } = req.query;

  const where = {
    event: {
      organizer_id: req.user.id,
      id: event_id ? Number(event_id) : undefined,
    },
  };

  const reviews = await prisma.review.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: reviewInclude,
  });

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
      : 0;

  return res.json({
    message: "success",
    summary: {
      average_rating: avgRating,
      total_reviews: totalReviews,
    },
    data: reviews,
    ok: true,
  });
}

module.exports = {
  createReview,
  getReviewsByEvent,
  getMyReviews,
  updateReview,
  deleteReview,
  getOrganizerReviews,
};
