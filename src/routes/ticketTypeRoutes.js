// src/routes/ticketTypeRoutes.js
const { Router } = require("express");
const { z } = require("zod");
const {
  getTicketTypesByEvent,
  createTicketType,
  updateTicketType,
  deleteTicketType,
} = require("../controllers/ticketTypeController");
const { verifyToken, requireOrganizer } = require("../middleware/authMiddleware");
const { validateBody } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/errorHandler");

const router = Router();

const ticketTypeSchema = z.object({
  type: z.string().min(2), // "regular", "vip", "festival", "early_bird", etc.
  name: z.string().min(2),
  price: z.number().nonnegative(),
  badge: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  quota: z.number().int().nonnegative().optional(),
});

const updateTicketTypeSchema = ticketTypeSchema.partial();

// Publik: lihat jenis tiket untuk sebuah event
router.get("/events/:eventId/ticket-types", asyncHandler(getTicketTypesByEvent));

// Penyelenggara & Admin: kelola jenis & kuota tiket
router.post(
  "/events/:eventId/ticket-types",
  verifyToken,
  requireOrganizer,
  validateBody(ticketTypeSchema),
  asyncHandler(createTicketType)
);

router.put(
  "/ticket-types/:id",
  verifyToken,
  requireOrganizer,
  validateBody(updateTicketTypeSchema),
  asyncHandler(updateTicketType)
);

router.delete(
  "/ticket-types/:id",
  verifyToken,
  requireOrganizer,
  asyncHandler(deleteTicketType)
);

module.exports = router;
