// src/routes/usersRoutes.js
const { Router } = require("express");
const { z } = require("zod");
const {
  getUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} = require("../../backend/src/controllers/usersController");
const { verifyToken, requireAdmin } = require("../../backend/src/middleware/authMiddleware");
const { validateBody } = require("../../backend/src/middleware/validate");
const { asyncHandler } = require("../../backend/src/middleware/errorHandler");

const router = Router();

// Seluruh endpoint manajemen pengguna hanya dapat diakses oleh Admin
router.use(verifyToken, requireAdmin);

const updateRoleSchema = z.object({
  role: z.enum(["User", "Admin", "Penyelenggara"]),
});

const updateStatusSchema = z.object({
  status: z.enum(["active", "suspended", "inactive"]),
});

router.get("/", asyncHandler(getUsers));
router.get("/:id", asyncHandler(getUserById));
router.put("/:id/role", validateBody(updateRoleSchema), asyncHandler(updateUserRole));
router.patch("/:id/status", validateBody(updateStatusSchema), asyncHandler(updateUserStatus));
router.delete("/:id", asyncHandler(deleteUser));

module.exports = router;
