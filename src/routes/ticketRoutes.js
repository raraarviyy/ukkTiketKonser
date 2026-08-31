// src/routes/ticketRoutes.js
const { Router } = require("express");
const { z } = require("zod");
const {
  getMyTickets,
  getTicketById,
  checkInTicket,
  checkInByCode,
  getAllTickets,
} = require("../controllers/ticketController");
const {
  verifyToken,
  requireOrganizer,
} = require("../middleware/authMiddleware");
const { validateBody } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/errorHandler");

const router = Router();

router.use(verifyToken);

const checkInByCodeSchema = z.object({
  ticket_code: z.string().min(1),
});

// 1. User: Riwayat E-Tiket Digital QR Code milik sendiri
router.get("/me", asyncHandler(getMyTickets));

// 2. Penyelenggara & Admin: Scan QR Code / Check-In Tiket
router.post(
  "/check-in",
  requireOrganizer,
  validateBody(checkInByCodeSchema),
  asyncHandler(checkInByCode)
);

// 3. Detail Tiket (User, Penyelenggara event, Admin)
router.get("/:id", asyncHandler(getTicketById));

// 4. Penyelenggara & Admin: Check-in tiket by ID
router.put("/:id/check-in", requireOrganizer, asyncHandler(checkInTicket));

// 5. Penyelenggara & Admin: Lihat semua tiket
router.get("/", requireOrganizer, asyncHandler(getAllTickets));

module.exports = router;
