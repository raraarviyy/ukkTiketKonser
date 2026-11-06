// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const prisma = require("../database");
const { signToken } = require("../middleware/authMiddleware");

/**
 * Registrasi akun baru:
 * - Bisa mendaftar sebagai "User" (default) atau "Penyelenggara".
 * - Role "Admin" hanya dibuat lewat database / seeding / admin panel.
 */
async function register(req, res) {
  const { name, email, password, role = "User", phone_number, organization_name } = req.body;

  // Validasi role yang boleh didaftarkan lewat API publik
  const targetRole = role === "Penyelenggara" ? "Penyelenggara" : "User";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: "Email sudah terdaftar", ok: false });
  }

  const roleRecord = await prisma.role.findUnique({ where: { name: targetRole } });
  if (!roleRecord) {
    return res.status(500).json({
      message: `Role '${targetRole}' belum tersedia di database. Jalankan db:seed terlebih dahulu.`,
      ok: false,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: roleRecord.id,
      phone_number: phone_number || null,
      organization_name: targetRole === "Penyelenggara" ? organization_name || name : null,
      status: "active",
    },
    include: { role_relation: true },
  });

  const token = signToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role_relation.name,
  });

  const { password: _pw, ...safeUser } = user;
  return res.status(201).json({
    message: `Registrasi sebagai ${targetRole} berhasil`,
    token,
    role: user.role_relation.name,
    data: safeUser,
    ok: true,
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { role_relation: true },
  });

  if (!user) {
    return res.status(400).json({ message: "Email atau password salah", ok: false });
  }

  if (user.status && user.status !== "active") {
    return res.status(403).json({
      message: `Akun Anda sedang dalam status '${user.status}'. Silakan hubungi admin.`,
      ok: false,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Email atau password salah", ok: false });
  }

  const roleName = user.role_relation.name;
  const token = signToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: roleName,
  });

  const { password: _pw, ...safeUser } = user;
  return res.json({
    message: "Login berhasil",
    token,
    role: roleName,
    data: safeUser,
    ok: true,
  });
}

module.exports = { register, login };
