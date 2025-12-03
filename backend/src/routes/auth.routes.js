// ==========================================
// src/routes/auth.routes.js
// ==========================================
import express from "express";
import authController from "../controllers/auth.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import { validators } from "../utils/validators.js";
import { rateLimit } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

// Ограничение частоты запросов для auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // 5 попыток
  message: "Слишком много попыток, попробуйте позже",
});

router.post(
  "/register",
  authLimiter,
  validate(validators.register),
  authController.register
);

router.post(
  "/login",
  authLimiter,
  validate(validators.login),
  authController.login
);

router.post(
  "/forgot-password",
  authLimiter,
  validate(validators.forgotPassword),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  authLimiter,
  validate(validators.resetPassword),
  authController.resetPassword
);

export default router;
