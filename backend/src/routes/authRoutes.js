// src/routes/authRoutes.js
const { Router } = require("express");
const { z } = require("zod");
const { register, login } = require("../controllers/authController");
const { validateBody } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/errorHandler");

const router = Router();

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["User", "Penyelenggara"]).optional(),
  phone_number: z.string().optional(),
  organization_name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/register", validateBody(registerSchema), asyncHandler(register));
router.post("/login", validateBody(loginSchema), asyncHandler(login));

module.exports = router;
