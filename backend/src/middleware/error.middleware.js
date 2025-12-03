// ==========================================
// src/middleware/error.middleware.js
// ==========================================
import { config } from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Преобразование не-ApiError ошибок
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, false, err.stack);
  }

  // Логирование
  if (error.statusCode >= 500) {
    logger.error("Server Error:", {
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
    });
  }

  // Специфичные ошибки MongoDB
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((e) => e.message);
    error = ApiError.badRequest(messages.join(", "));
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    error = ApiError.badRequest(`${field} уже существует`);
  }

  // Формирование ответа
  const response = {
    error: error.message,
    ...(config.nodeEnv === "development" && { stack: error.stack }),
  };

  res.status(error.statusCode).json(response);
};

// 404 Handler
export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};
