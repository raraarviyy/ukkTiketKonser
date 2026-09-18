// src/controllers/usersController.js
const prisma = require("../../../src/database");

/** Admin: melihat semua user dengan filter role, status, atau pencarian nama/email */
async function getUsers(req, res) {
  const { role, status, search } = req.query;

  const where = {};

  if (role) {
    where.role_relation = { name: { equals: role, mode: "insensitive" } };
  }

  if (status) {
    where.status = { equals: status, mode: "insensitive" };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { organization_name: { contains: search, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { id: "asc" },
    include: {
      role_relation: true,
      _count: {
        select: {
          orders: true,
          tickets: true,
          organized_events: true,
          reviews: true,
        },
      },
    },
  });

  const data = users.map(({ password, ...safe }) => safe);
  return res.json({ message: "success", data, ok: true });
}

async function getUserById(req, res) {
  const id = Number(req.params.id);

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      role_relation: true,
      organized_events: true,
      _count: {
        select: {
          orders: true,
          tickets: true,
          reviews: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan", ok: false });
  }

  const { password, ...safeUser } = user;
  return res.json({ message: "success", data: safeUser, ok: true });
}

/** Admin: ubah role user (User / Admin / Penyelenggara) */
async function updateUserRole(req, res) {
  const id = Number(req.params.id);
  const { role } = req.body;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan", ok: false });
  }

  const roleRecord = await prisma.role.findUnique({ where: { name: role } });
  if (!roleRecord) {
    return res.status(404).json({ message: `Role "${role}" tidak ditemukan`, ok: false });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role: roleRecord.id },
    include: { role_relation: true },
  });

  const { password, ...safeUser } = updated;
  return res.json({ message: "Role user berhasil diubah", data: safeUser, ok: true });
}

/** Admin: ubah status akun user (active / suspended / inactive) untuk moderasi & penanganan penyalahgunaan */
async function updateUserStatus(req, res) {
  const id = Number(req.params.id);
  const { status } = req.body;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan", ok: false });
  }

  // Lindungi akun sendiri agar tidak tersuspend oleh dirinya sendiri
  if (user.id === req.user.id && status !== "active") {
    return res.status(400).json({ message: "Tidak dapat menonaktifkan akun sendiri", ok: false });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { status },
    include: { role_relation: true },
  });

  const { password, ...safeUser } = updated;
  return res.json({ message: `Status akun user berhasil diubah menjadi ${status}`, data: safeUser, ok: true });
}

async function deleteUser(req, res) {
  const id = Number(req.params.id);

  if (id === req.user.id) {
    return res.status(400).json({ message: "Tidak dapat menghapus akun sendiri", ok: false });
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan", ok: false });
  }

  await prisma.user.delete({ where: { id } });
  return res.json({ message: "User berhasil dihapus", ok: true });
}

module.exports = { getUsers, getUserById, updateUserRole, updateUserStatus, deleteUser };
