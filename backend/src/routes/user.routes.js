// ==========================================
// src/routes/user.routes.js
// ==========================================
import express from "express";
import userController from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { validators } from "../utils/validators.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/profile", userController.getProfile);

router.patch(
  "/message-color",
  validate(validators.updateColor),
  userController.updateMessageColor
);

router.patch(
  "/gender",
  validate(validators.updateGender),
  userController.updateGender
);

export default router;
