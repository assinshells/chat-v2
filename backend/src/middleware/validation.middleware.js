// ==========================================
// src/middleware/validation.middleware.js
// ==========================================
import ApiError from "../utils/ApiError.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      const message = error.details.map((d) => d.message).join(", ");
      return next(ApiError.badRequest(message));
    }

    req.body = value;
    next();
  };
};
