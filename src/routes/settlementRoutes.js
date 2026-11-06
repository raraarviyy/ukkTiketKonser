const { Router } = require("express");
const { z } = require("zod");
const {
  getFee,
  updateFee,
  getAllSettlements,
  getSettlementById,
  generateSettlements,
  updateSettlementStatus,
  getMySettlements,
} = require("../controllers/settlementController");
const {
  verifyToken,
  requireAdmin,
  requireOrganizer,
} = require("../middleware/authMiddleware");
const { validateBody } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/errorHandler");

const router = Router();

router.use(verifyToken);

const updateFeeSchema = z.object({
  fee_percent: z.number().min(0).max(100),
});

const generateSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
});

const updateStatusSchema = z.object({
  status: z.enum(["processing", "settled"]),
});

router.get("/me", requireOrganizer, asyncHandler(getMySettlements));

router.get("/fee", requireAdmin, asyncHandler(getFee));
router.put(
  "/fee",
  requireAdmin,
  validateBody(updateFeeSchema),
  asyncHandler(updateFee)
);

router.post(
  "/generate",
  requireAdmin,
  validateBody(generateSchema),
  asyncHandler(generateSettlements)
);

router.get("/", requireAdmin, asyncHandler(getAllSettlements));
router.get("/:id", requireAdmin, asyncHandler(getSettlementById));

router.patch(
  "/:id/status",
  requireAdmin,
  validateBody(updateStatusSchema),
  asyncHandler(updateSettlementStatus)
);

module.exports = router;