// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET ?? "supersecret";

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  });
}

/**
 * Memverifikasi Bearer token di header Authorization.
 * Jika valid, `req.user` akan berisi payload token (id, name, email, role).
 */
function verifyToken(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ message: "Token tidak ditemukan", ok: false });
  }

  const token = authorization.startsWith("Bearer ")
    ? authorization.split(" ")[1]
    : authorization;

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid atau sudah expired", ok: false });
  }
}

/** Middleware opsional: kalau ada token, di-decode; kalau tidak ada, lanjut tanpa error */
function optionalToken(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) return next();

  const token = authorization.startsWith("Bearer ")
    ? authorization.split(" ")[1]
    : authorization;

  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch {
    // abaikan token invalid pada rute publik
  }
  next();
}

/** Membatasi akses berdasarkan satu atau beberapa role */
function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Akses ditolak: membutuhkan salah satu role [${allowedRoles.join(", ")}]`,
        ok: false,
      });
    }
    next();
  };
}

/** Hanya Admin */
const requireAdmin = requireRoles("Admin");

/** Penyelenggara atau Admin */
const requireOrganizer = requireRoles("Penyelenggara", "Admin");

/** Pengguna Biasa, Penyelenggara, atau Admin */
const requireAnyUser = requireRoles("User", "Penyelenggara", "Admin");

module.exports = {
  signToken,
  verifyToken,
  optionalToken,
  requireRoles,
  requireAdmin,
  requireOrganizer,
  requireAnyUser,
};
