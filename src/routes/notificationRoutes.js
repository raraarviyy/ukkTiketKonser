// src/routes/notificationRoutes.js
const { Router } = require("express");
const {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require("../controllers/notificationController");
const { verifyToken } = require("../middleware/authMiddleware");
const { asyncHandler } = require("../middleware/errorHandler");

const router = Router();

router.use(verifyToken);

router.get("/", asyncHandler(getMyNotifications));
router.put("/:id/read", asyncHandler(markNotificationRead));
router.put("/read-all", asyncHandler(markAllNotificationsRead));

module.exports = router;
