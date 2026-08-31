// src/routes/profileRoutes.js
const { Router } = require("express");
const { z } = require("zod");
const { getMyProfile, updateMyProfile, changeMyPassword } = require("../controllers/profileController");
const { verifyToken } = require("../middleware/authMiddleware");
const { validateBody } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/errorHandler");

const router = Router();

router.use(verifyToken);

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  profile_picture: z.string().optional(),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

router.get("/", asyncHandler(getMyProfile));
router.put("/", validateBody(updateProfileSchema), asyncHandler(updateMyProfile));
router.put("/password", validateBody(changePasswordSchema), asyncHandler(changeMyPassword));

module.exports = router;
