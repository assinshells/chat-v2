// ==========================================
// src/middleware/auth.middleware.js
// ==========================================
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.model.js";

export const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    throw ApiError.unauthorized("Токен не предоставлен");
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    // Опционально: проверка существования пользователя
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw ApiError.unauthorized("Пользователь не найден");
    }

    req.user = decoded;
    req.userDoc = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw ApiError.unauthorized("Токен истёк");
    }
    if (error.name === "JsonWebTokenError") {
      throw ApiError.unauthorized("Недействительный токен");
    }
    throw error;
  }
});
