// ==========================================
// src/services/auth.service.js
// ==========================================
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import { config } from "../config/env.js";

class AuthService {
  generateToken(userId, nickname) {
    return jwt.sign({ id: userId, nickname }, config.jwtSecret, {
      expiresIn: config.jwtExpiry,
    });
  }

  async register(userData) {
    const { nickname, email, password, messageColor, gender } = userData;

    // Проверка существования пользователя
    const existingUser = await User.findOne({
      $or: [{ nickname }, ...(email ? [{ email }] : [])],
    });

    if (existingUser) {
      throw ApiError.badRequest("Пользователь уже существует");
    }

    // Хеширование пароля
    const hashedPassword = await User.hashPassword(password);

    // Создание пользователя
    const user = new User({
      nickname,
      email: email || null,
      password: hashedPassword,
      messageColor: messageColor || "black",
      gender: gender || "male",
    });

    await user.save();

    // Генерация токена
    const token = this.generateToken(user._id, user.nickname);

    return {
      token,
      user: {
        id: user._id,
        nickname: user.nickname,
        email: user.email,
        messageColor: user.messageColor,
        gender: user.gender,
      },
    };
  }

  async login(login, password) {
    // Поиск пользователя
    const user = await User.findByLogin(login);
    if (!user) {
      throw ApiError.unauthorized("Неверные учетные данные");
    }

    // Проверка пароля
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Неверные учетные данные");
    }

    // Обновление lastSeen
    user.lastSeen = new Date();
    await user.save();

    // Генерация токена
    const token = this.generateToken(user._id, user.nickname);

    return {
      token,
      user: {
        id: user._id,
        nickname: user.nickname,
        email: user.email,
        messageColor: user.messageColor,
        gender: user.gender,
      },
    };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });

    // Не раскрываем существование пользователя
    if (!user) {
      return { message: "Если email существует, письмо отправлено" };
    }

    const resetToken = jwt.sign({ email }, config.jwtSecret, {
      expiresIn: "1h",
    });

    return { resetToken, user };
  }

  async resetPassword(token, newPassword) {
    let decoded;

    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw ApiError.badRequest("Токен истёк");
      }
      throw ApiError.badRequest("Недействительный токен");
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      throw ApiError.notFound("Пользователь не найден");
    }

    user.password = await User.hashPassword(newPassword);
    await user.save();

    return { message: "Пароль успешно изменён" };
  }
}

export default new AuthService();
