// src/routes/categoryRoutes.js
const { Router } = require("express");
const { z } = require("zod");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");
const { validateBody } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/errorHandler");

const router = Router();

const categorySchema = z.object({ name: z.string().min(2) });

// Publik: siapa saja boleh lihat daftar kategori (buat filter di Explore page)
router.get("/", asyncHandler(getCategories));

// Admin only: kelola kategori
router.post("/", verifyToken, requireAdmin, validateBody(categorySchema), asyncHandler(createCategory));
router.put(
  "/:id",
  verifyToken,
  requireAdmin,
  validateBody(categorySchema),
  asyncHandler(updateCategory)
);
router.delete("/:id", verifyToken, requireAdmin, asyncHandler(deleteCategory));

module.exports = router;
