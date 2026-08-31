// src/middleware/validate.js

/**
 * Membuat middleware validasi body request menggunakan skema Zod.
 * Kalau valid, `req.body` diganti dengan hasil parse (sudah ter-transform/ter-default).
 * Kalau tidak valid, response 422 dengan detail error per field.
 */
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({
        message: "Validasi gagal",
        errors: result.error.flatten().fieldErrors,
        ok: false,
      });
    }
    req.body = result.data;
    next();
  };
}

/** Validasi query string dengan skema Zod */
function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(422).json({
        message: "Validasi gagal",
        errors: result.error.flatten().fieldErrors,
        ok: false,
      });
    }
    req.query = result.data;
    next();
  };
}

module.exports = { validateBody, validateQuery };
