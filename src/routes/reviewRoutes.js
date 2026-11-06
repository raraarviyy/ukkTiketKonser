// src/routes/reviewRoutes.js
const { Router } = require("express");
const { z } = require("zod");
const {
  createReview,
  getReviewsByEvent,
  getMyReviews,
  updateReview,
  deleteReview,
  getOrganizerReviews,
} = require("../controllers/reviewController");
const {
  verifyToken,
  requireOrganizer,
} = require("../middleware/authMiddleware");
const { validateBody } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/errorHandler");

const router = Router();

const createReviewSchema = z.object({
  event_id: z.number().int(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
});

// 1. Publik: Lihat rating & ulasan per event
router.get("/events/:eventId", asyncHandler(getReviewsByEvent));

// 2. User: Riwayat ulasan yang pernah diberikan
router.get("/me", verifyToken, asyncHandler(getMyReviews));

// 3. Penyelenggara: Manajemen Ulasan untuk event yang diselenggarakan
router.get("/organizer", verifyToken, requireOrganizer, asyncHandler(getOrganizerReviews));

// 4. User: Kirim Rating & Ulasan baru
router.post("/", verifyToken, validateBody(createReviewSchema), asyncHandler(createReview));

// 5. User: Update ulasan
router.put("/:id", verifyToken, validateBody(updateReviewSchema), asyncHandler(updateReview));

// 6. User / Admin: Hapus ulasan
router.delete("/:id", verifyToken, asyncHandler(deleteReview));

module.exports = router;
