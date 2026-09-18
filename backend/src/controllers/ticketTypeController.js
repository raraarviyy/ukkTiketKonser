// src/controllers/ticketTypeController.js
const prisma = require("../database");

async function getTicketTypesByEvent(req, res) {
  const eventId = Number(req.params.eventId);

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return res.status(404).json({ message: "Event tidak ditemukan", ok: false });
  }

  const data = await prisma.ticketType.findMany({
    where: { event_id: eventId },
    orderBy: { price: "asc" },
  });

  return res.json({ message: "success", data, ok: true });
}

async function createTicketType(req, res) {
  const eventId = Number(req.params.eventId);
  const body = req.body;
  const isAdmin = req.user.role === "Admin";

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return res.status(404).json({ message: "Event tidak ditemukan", ok: false });
  }

  // Cek kepemilikan event jika bukan Admin
  if (!isAdmin && event.organizer_id !== req.user.id) {
    return res.status(403).json({ message: "Akses ditolak: bukan pemilik event ini", ok: false });
  }

  const data = await prisma.ticketType.create({
    data: { ...body, event_id: eventId, quota: body.quota ?? 0 },
  });

  return res.status(201).json({ message: "Ticket type berhasil dibuat", data, ok: true });
}

async function updateTicketType(req, res) {
  const id = Number(req.params.id);
  const body = req.body;
  const isAdmin = req.user.role === "Admin";

  const existing = await prisma.ticketType.findUnique({
    where: { id },
    include: { event: true },
  });

  if (!existing) {
    return res.status(404).json({ message: "Ticket type tidak ditemukan", ok: false });
  }

  // Cek kepemilikan event jika bukan Admin
  if (!isAdmin && existing.event.organizer_id !== req.user.id) {
    return res.status(403).json({ message: "Akses ditolak: bukan pemilik event ini", ok: false });
  }

  const data = await prisma.ticketType.update({ where: { id }, data: body });
  return res.json({ message: "Ticket type berhasil diperbarui", data, ok: true });
}

async function deleteTicketType(req, res) {
  const id = Number(req.params.id);
  const isAdmin = req.user.role === "Admin";

  const existing = await prisma.ticketType.findUnique({
    where: { id },
    include: { event: true },
  });

  if (!existing) {
    return res.status(404).json({ message: "Ticket type tidak ditemukan", ok: false });
  }

  // Cek kepemilikan event jika bukan Admin
  if (!isAdmin && existing.event.organizer_id !== req.user.id) {
    return res.status(403).json({ message: "Akses ditolak: bukan pemilik event ini", ok: false });
  }

  await prisma.ticketType.delete({ where: { id } });
  return res.json({ message: "Ticket type berhasil dihapus", ok: true });
}

module.exports = { getTicketTypesByEvent, createTicketType, updateTicketType, deleteTicketType };
