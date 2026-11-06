const { Router } = require("express");
const { z } = require("zod");
const {
  getAuditLogs,
  createAuditLog,
} = require("../controllers/auditController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");
const { validateBody } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/errorHandler");

const router = Router();

router.use(verifyToken, requireAdmin);

const createSchema = z.object({
  action: z.enum([
    "Approve Concert",
    "Reject Concert",
    "Cancel Concert",
    "Soft Delete Concert",
    "Approve Organizer",
    "Suspend Organizer",
    "Activate Organizer",
    "Suspend User",
    "Activate User",
    "Change User Role",
    "Delete User",
    "Refund Transaction",
    "Cancel Transaction",
    "Update Order Status",
    "Cancel Ticket",
    "Update Platform Fee",
    "Create Announcement",
    "Delete Announcement",
    "Update Review",
    "Delete Review",
  ]),
  target: z.string().min(1).max(255),
});

router.get("/", asyncHandler(getAuditLogs));
router.post("/", validateBody(createSchema), asyncHandler(createAuditLog));

module.exports = router;