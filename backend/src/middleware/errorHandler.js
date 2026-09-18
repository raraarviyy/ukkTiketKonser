// src/middleware/errorHandler.js

/** Membungkus controller async supaya error otomatis dilempar ke errorHandler */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function notFoundHandler(req, res) {
  res.status(404).json({ message: "Route tidak ditemukan", ok: false });
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);

  if (err?.code === "P2002") {
    return res.status(400).json({
      message: `Data dengan field ${err?.meta?.target ?? ""} sudah digunakan`,
      ok: false,
    });
  }
  if (err?.code === "P2025") {
    return res.status(404).json({ message: "Data tidak ditemukan", ok: false });
  }

  const status = err?.status ?? 500;
  res.status(status).json({
    message: err?.message ?? "Internal server error",
    ok: false,
  });
}

module.exports = { asyncHandler, notFoundHandler, errorHandler };
