// src/controllers/notificationController.js
const prisma = require("../database");

async function getMyNotifications(req, res) {
  const data = await prisma.notification.findMany({
    where: { user_id: req.user.id },
    orderBy: { created_at: "desc" },
  });

  return res.json({ message: "success", data, ok: true });
}

async function markNotificationRead(req, res) {
  const id = Number(req.params.id);

  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification || notification.user_id !== req.user.id) {
    return res.status(404).json({ message: "Notifikasi tidak ditemukan", ok: false });
  }

  const data = await prisma.notification.update({ where: { id }, data: { is_read: true } });
  return res.json({ message: "success", data, ok: true });
}

async function markAllNotificationsRead(req, res) {
  await prisma.notification.updateMany({
    where: { user_id: req.user.id, is_read: false },
    data: { is_read: true },
  });

  const data = await prisma.notification.findMany({
    where: { user_id: req.user.id },
    orderBy: { created_at: "desc" },
  });

  return res.json({ message: "Semua notifikasi ditandai terbaca", data, ok: true });
}

module.exports = { getMyNotifications, markNotificationRead, markAllNotificationsRead };
