// src/utils/useNotification.js
const prisma = require("../../../src/database");

async function useNotification(userId, title, message, type = "system") {
  const data = await prisma.notification.create({
    data: { user_id: userId, title, message, type },
  });
  return data;
}

/** Membuat beberapa notifikasi sekaligus untuk satu user, mis. setelah checkout */
async function useNotifications(userId, notifications) {
  await prisma.notification.createMany({
    data: notifications.map((n) => ({ user_id: userId, ...n })),
  });
}

module.exports = { useNotification, useNotifications };
