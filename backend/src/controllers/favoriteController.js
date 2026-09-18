// src/controllers/favoriteController.js
const prisma = require("../database");

async function getMyFavorites(req, res) {
  const data = await prisma.favorite.findMany({
    where: { user_id: req.user.id },
    orderBy: { created_at: "desc" },
    include: { event: { include: { category: true, ticket_types: true } } },
  });

  return res.json({ message: "success", data, ok: true });
}

/** Toggle favorite: kalau sudah ada dihapus, kalau belum ada dibuat */
async function toggleFavorite(req, res) {
  const { event_id } = req.body;

  const event = await prisma.event.findUnique({ where: { id: event_id } });
  if (!event) {
    return res.status(404).json({ message: "Event tidak ditemukan", ok: false });
  }

  const existing = await prisma.favorite.findUnique({
    where: { user_id_event_id: { user_id: req.user.id, event_id } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return res.json({ message: "Event dihapus dari favorit", data: { favorited: false }, ok: true });
  }

  await prisma.favorite.create({ data: { user_id: req.user.id, event_id } });
  return res
    .status(201)
    .json({ message: "Event ditambahkan ke favorit", data: { favorited: true }, ok: true });
}

async function removeFavorite(req, res) {
  const eventId = Number(req.params.eventId);

  const existing = await prisma.favorite.findUnique({
    where: { user_id_event_id: { user_id: req.user.id, event_id: eventId } },
  });
  if (!existing) {
    return res.status(404).json({ message: "Favorit tidak ditemukan", ok: false });
  }

  await prisma.favorite.delete({ where: { id: existing.id } });
  return res.json({ message: "Event dihapus dari favorit", ok: true });
}

module.exports = { getMyFavorites, toggleFavorite, removeFavorite };
