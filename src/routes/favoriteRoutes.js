// src/routes/favoriteRoutes.js
const { Router } = require("express");
const { z } = require("zod");
const {
  getMyFavorites,
  toggleFavorite,
  removeFavorite,
} = require("../controllers/favoriteController");
const { verifyToken } = require("../middleware/authMiddleware");
const { validateBody } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/errorHandler");

const router = Router();

router.use(verifyToken);

const toggleSchema = z.object({ event_id: z.number().int() });

router.get("/", asyncHandler(getMyFavorites));
router.post("/toggle", validateBody(toggleSchema), asyncHandler(toggleFavorite));
router.delete("/:eventId", asyncHandler(removeFavorite));

module.exports = router;
