// src/controllers/ticketController.js
const prisma = require("../database");

const ticketInclude = {
  event: {
    include: {
      category: true,
      organizer: {
        select: { id: true, name: true, organization_name: true },
      },
    },
  },
  ticket_type: true,
  order: true,
  user: {
    select: { id: true, name: true, email: true },
  },
};

/** User: Mengambil e-tiket milik user login (filter ?status=upcoming|used|expired|cancelled) */
async function getMyTickets(req, res) {
  const { status } = req.query;

  const data = await prisma.ticket.findMany({
    where: { user_id: req.user.id, status: status || undefined },
    orderBy: { created_at: "desc" },
    include: ticketInclude,
  });

  return res.json({ message: "success", data, ok: true });
}

/** Detail E-Tiket (termasuk QR code url & validasi pemilik) */
async function getTicketById(req, res) {
  const id = Number(req.params.id);

  const data = await prisma.ticket.findUnique({ where: { id }, include: ticketInclude });
  if (!data) {
    return res.status(404).json({ message: "Tiket tidak ditemukan", ok: false });
  }

  const isOwner = data.user_id === req.user.id;
  const isOrganizer = req.user.role === "Penyelenggara" && data.event.organizer_id === req.user.id;
  const isAdmin = req.user.role === "Admin";

  if (!isOwner && !isOrganizer && !isAdmin) {
    return res.status(403).json({ message: "Akses ditolak", ok: false });
  }

  return res.json({ message: "success", data, ok: true });
}

/**
 * Validasi / Check-In Tiket (Penyelenggara di Gate Masuk / Admin):
 * Mencegah tiket duplikasi atau pemalsuan dengan memverifikasi QR code / ticket code unik.
 */
async function checkInTicket(req, res) {
  const id = Number(req.params.id);
  const isAdmin = req.user.role === "Admin";

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { event: true },
  });

  if (!ticket) {
    return res.status(404).json({ message: "Tiket tidak ditemukan", ok: false });
  }

  // Penyelenggara hanya boleh check-in tiket event miliknya sendiri
  if (!isAdmin && ticket.event.organizer_id !== req.user.id) {
    return res.status(403).json({ message: "Akses ditolak: Anda bukan penyelenggara event ini", ok: false });
  }

  if (ticket.status === "used") {
    return res.status(400).json({
      message: "Tiket ini SUDAH DIGUNAKAN sebelumnya (Indikasi duplikasi)",
      ok: false,
    });
  }

  if (ticket.status !== "upcoming") {
    return res.status(400).json({
      message: `Tiket berstatus "${ticket.status}", tidak dapat digunakan untuk check-in`,
      ok: false,
    });
  }

  const data = await prisma.ticket.update({
    where: { id },
    data: { status: "used" },
    include: ticketInclude,
  });

  return res.json({ message: "Check-in tiket berhasil! Akses penonton sah.", data, ok: true });
}

/** Check-in tiket lewat kode unik (misalnya saat scanner QR membaca barcode string) */
async function checkInByCode(req, res) {
  const { ticket_code } = req.body;
  const isAdmin = req.user.role === "Admin";

  const ticket = await prisma.ticket.findUnique({
    where: { ticket_code },
    include: { event: true, ticket_type: true, user: true },
  });

  if (!ticket) {
    return res.status(404).json({ message: "Kode tiket tidak valid atau tidak terdaftar", ok: false });
  }

  if (!isAdmin && ticket.event.organizer_id !== req.user.id) {
    return res.status(403).json({ message: "Akses ditolak: Anda bukan penyelenggara event ini", ok: false });
  }

  if (ticket.status === "used") {
    return res.status(400).json({
      message: "PERINGATAN: Tiket ini SUDAH DIGUNAKAN sebelumnya!",
      data: ticket,
      ok: false,
    });
  }

  if (ticket.status !== "upcoming") {
    return res.status(400).json({
      message: `Tiket berstatus "${ticket.status}", tidak dapat digunakan`,
      data: ticket,
      ok: false,
    });
  }

  const data = await prisma.ticket.update({
    where: { id: ticket.id },
    data: { status: "used" },
    include: ticketInclude,
  });

  return res.json({
    message: "Verifikasi & Check-in QR Berhasil! Selamat menonton.",
    data,
    ok: true,
  });
}

/** Admin / Penyelenggara: lihat daftar tiket */
async function getAllTickets(req, res) {
  const { event_id, status } = req.query;
  const isAdmin = req.user.role === "Admin";

  const where = {};
  if (status) where.status = status;

  if (isAdmin) {
    if (event_id) where.event_id = Number(event_id);
  } else {
    // Penyelenggara: hanya tiket dari event miliknya
    where.event = {
      organizer_id: req.user.id,
      id: event_id ? Number(event_id) : undefined,
    };
  }

  const data = await prisma.ticket.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: ticketInclude,
  });

  return res.json({ message: "success", data, ok: true });
}

module.exports = {
  getMyTickets,
  getTicketById,
  checkInTicket,
  checkInByCode,
  getAllTickets,
};
