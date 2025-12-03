// ==========================================
// src/services/user.service.js
// ==========================================
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import { MESSAGE_COLORS, GENDERS } from "../constants/index.js";

class UserService {
  async getUserById(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw ApiError.notFound("Пользователь не найден");
    }
    return user;
  }

  async updateMessageColor(userId, messageColor) {
    if (!MESSAGE_COLORS.includes(messageColor)) {
      throw ApiError.badRequest("Недопустимый цвет");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { messageColor },
      { new: true }
    ).select("-password");

    if (!user) {
      throw ApiError.notFound("Пользователь не найден");
    }

    return user;
  }

  async updateGender(userId, gender) {
    if (!GENDERS.includes(gender)) {
      throw ApiError.badRequest("Недопустимый пол");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { gender },
      { new: true }
    ).select("-password");

    if (!user) {
      throw ApiError.notFound("Пользователь не найден");
    }

    return user;
  }
}

export default new UserService();
