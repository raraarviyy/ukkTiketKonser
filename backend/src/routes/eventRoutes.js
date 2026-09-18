// src/routes/eventRoutes.js
const { Router } = require("express");
const { z } = require("zod");
const {
  getEvents,
  getEventById,
  getMyOrganizedEvents,
  createEvent,
  updateEvent,
  moderateEventStatus,
  deleteEvent,
} = require("../controllers/eventController");
const {
  verifyToken,
  optionalToken,
  requireAdmin,
  requireOrganizer,
} = require("../middleware/authMiddleware");
const { validateBody, validateQuery } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/errorHandler");

const router = Router();

const eventFilterQuerySchema = z.object({
  search: z.string().optional(),
  artist: z.string().optional(),
  city: z.string().optional(),
  category: z.string().optional(),
  category_id: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  event_date: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  status: z.enum(["approved", "pending", "rejected", "all"]).optional(),
});

const eventSchema = z.object({
  title: z.string().min(2),
  artist: z.string().min(1),
  venue: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  event_date: z.string(), // ISO date string
  doors_open: z.string().optional(),
  show_starts: z.string().optional(),
  age_limit: z.string().optional(),
  category_id: z.number().int(),
  image: z.string().optional(),
  description: z.string().optional(),
  tag: z.string().optional(),
  secondary_tag: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

const updateEventSchema = eventSchema.partial();

const moderateStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
  reject_reason: z.string().optional(),
});

// 1. Publik: List & Filter Konser (genre musik, kota, tanggal, artis/band, dsb.)
router.get("/", validateQuery(eventFilterQuerySchema), asyncHandler(getEvents));

// 2. Penyelenggara: Mengambil event yang diselenggarakan oleh akun login
router.get("/my-events", verifyToken, requireOrganizer, asyncHandler(getMyOrganizedEvents));

// 3. Detail Event
router.get("/:id", optionalToken, asyncHandler(getEventById));

// 4. Penyelenggara / Admin: Buat & kelola event
router.post(
  "/",
  verifyToken,
  requireOrganizer,
  validateBody(eventSchema),
  asyncHandler(createEvent)
);

router.put(
  "/:id",
  verifyToken,
  requireOrganizer,
  validateBody(updateEventSchema),
  asyncHandler(updateEvent)
);

// 5. Admin: Verifikasi & Moderasi Event (Approve / Reject)
router.patch(
  "/:id/status",
  verifyToken,
  requireAdmin,
  validateBody(moderateStatusSchema),
  asyncHandler(moderateEventStatus)
);

router.put(
  "/:id/status",
  verifyToken,
  requireAdmin,
  validateBody(moderateStatusSchema),
  asyncHandler(moderateEventStatus)
);

// 6. Penyelenggara / Admin: Hapus event
router.delete("/:id", verifyToken, requireOrganizer, asyncHandler(deleteEvent));

module.exports = router;
