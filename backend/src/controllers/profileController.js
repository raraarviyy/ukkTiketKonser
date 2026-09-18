// src/controllers/profileController.js
const bcrypt = require("bcryptjs");
const prisma = require("../database");

async function getMyProfile(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { role_relation: true },
  });

  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan", ok: false });
  }

  const { password, ...safeUser } = user;
  return res.json({ message: "success", data: safeUser, ok: true });
}

async function updateMyProfile(req, res) {
  const { name, email, profile_picture } = req.body;

  if (email) {
    const existing = await prisma.user.findFirst({
      where: { AND: [{ id: { not: req.user.id } }, { email }] },
    });
    if (existing) {
      return res.status(400).json({ message: "Email sudah digunakan", ok: false });
    }
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, email, profile_picture },
  });

  const { password, ...safeUser } = user;
  return res.json({ message: "Profil berhasil diperbarui", data: safeUser, ok: true });
}

async function changeMyPassword(req, res) {
  const { oldPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan", ok: false });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Password lama salah", ok: false });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } });

  return res.json({ message: "Password berhasil diubah", ok: true });
}

module.exports = { getMyProfile, updateMyProfile, changeMyPassword };
