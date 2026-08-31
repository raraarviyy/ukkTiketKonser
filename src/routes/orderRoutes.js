// src/routes/orderRoutes.js
const { Router } = require("express");
const { z } = require("zod");
const {
  checkout,
  getMyOrders,
  getOrderById,
  getOrganizerOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const {
  verifyToken,
  requireAdmin,
  requireOrganizer,
} = require("../middleware/authMiddleware");
const { validateBody, validateQuery } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/errorHandler");

const router = Router();

router.use(verifyToken);

const checkoutSchema = z.object({
  event_id: z.number().int(),
  ticket_type_id: z.number().int(),
  quantity: z.number().int().min(1).max(10),
  // Berbagai metode pembayaran: VA, QRIS/e-wallet, Kartu Kredit/Debit
  payment_method: z.enum(["qris", "card", "va", "gopay", "ovo", "dana", "bca_va", "mandiri_va", "bni_va"]),
});

const updateStatusSchema = z.object({
  status: z.enum(["pending", "paid", "failed", "cancelled"]),
  reason: z.string().optional(),
});

// 1. User: Checkout Pemesanan Tiket
router.post("/checkout", validateBody(checkoutSchema), asyncHandler(checkout));

// 2. User: Riwayat Transaksi milik sendiri
router.get("/me", asyncHandler(getMyOrders));

// 3. Penyelenggara: Rekap pemesanan tiket untuk event miliknya
router.get("/organizer", requireOrganizer, asyncHandler(getOrganizerOrders));

// 4. Detail Order (User pemilik, Penyelenggara event, atau Admin)
router.get("/:id", asyncHandler(getOrderById));

// 5. Admin: Monitoring Keamanan Transaksi Platform
router.get("/", requireAdmin, asyncHandler(getAllOrders));

// 6. Admin: Update status / Intervensi keamanan transaksi
router.patch("/:id/status", requireAdmin, validateBody(updateStatusSchema), asyncHandler(updateOrderStatus));

module.exports = router;
