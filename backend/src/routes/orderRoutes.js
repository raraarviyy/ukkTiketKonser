// src/routes/orderRoutes.js
const { Router } = require("express");
const { z } = require("zod");
const {
  checkout,
  handleMidtransNotification,
  checkPaymentStatus,
  cancelMyOrder,
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
const { validateBody } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/errorHandler");

const router = Router();

// ==========================================
// 1. PUBLIC WEBHOOK (Notifikasi dari Midtrans)
// Tidak memerlukan Bearer token, diautentikasi lewat Midtrans Signature Key
// ==========================================
router.post("/notification", asyncHandler(handleMidtransNotification));
router.post("/midtrans-webhook", asyncHandler(handleMidtransNotification));

// ==========================================
// 2. PROTECTED ROUTES (Harus Login)
// ==========================================
router.use(verifyToken);

const checkoutSchema = z.object({
  event_id: z.number().int(),
  ticket_type_id: z.number().int(),
  quantity: z.number().int().min(1).max(10),
  payment_method: z.string().optional().default("midtrans"),
  callbacks: z
    .object({
      finish: z.string().url().optional(),
      error: z.string().url().optional(),
      pending: z.string().url().optional(),
    })
    .optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(["pending", "paid", "failed", "cancelled", "expired"]),
  reason: z.string().optional(),
});

// 1. User: Checkout Pemesanan Tiket & Request Snap Token
router.post("/checkout", validateBody(checkoutSchema), asyncHandler(checkout));

// 2. User: Riwayat Transaksi milik sendiri
router.get("/me", asyncHandler(getMyOrders));

// 3. Penyelenggara: Rekap pemesanan tiket untuk event miliknya
router.get("/organizer", requireOrganizer, asyncHandler(getOrganizerOrders));

// 4. Detail Order (User pemilik, Penyelenggara event, atau Admin)
router.get("/:id", asyncHandler(getOrderById));

// 5. Cek Status Pembayaran ke Midtrans API secara manual & sinkronkan
router.get("/:id/check-payment", asyncHandler(checkPaymentStatus));

// 6. User: Batalkan pesanan pending
router.post("/:id/cancel", asyncHandler(cancelMyOrder));

// 7. Admin: Monitoring Keamanan Transaksi Platform
router.get("/", requireAdmin, asyncHandler(getAllOrders));

// 8. Admin: Update status / Intervensi keamanan transaksi
router.patch(
  "/:id/status",
  requireAdmin,
  validateBody(updateStatusSchema),
  asyncHandler(updateOrderStatus)
);

module.exports = router;
