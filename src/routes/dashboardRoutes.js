// src/routes/dashboardRoutes.js
const { Router } = require("express");
const {
  getAdminDashboardStats,
  getOrganizerDashboardStats,
  getOrganizerRevenueReport,
} = require("../controllers/dashboardController");
const {
  verifyToken,
  requireAdmin,
  requireOrganizer,
} = require("../middleware/authMiddleware");
const { asyncHandler } = require("../middleware/errorHandler");

const router = Router();

router.use(verifyToken);

// 1. Admin: Pemantauan Performa Platform
router.get("/admin", requireAdmin, asyncHandler(getAdminDashboardStats));
router.get("/", requireAdmin, asyncHandler(getAdminDashboardStats)); // Default /api/dashboard fallback

// 2. Penyelenggara: Dashboard Penjualan Real-time
router.get("/organizer", requireOrganizer, asyncHandler(getOrganizerDashboardStats));

// 3. Penyelenggara: Laporan Pendapatan (Revenue Report)
router.get("/organizer/revenue", requireOrganizer, asyncHandler(getOrganizerRevenueReport));

module.exports = router;
