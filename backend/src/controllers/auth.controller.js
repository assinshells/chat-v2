// ==========================================
// src/controllers/auth.controller.js
// ==========================================
import authService from "../services/auth.service.js";
import emailService from "../services/email.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class AuthController {
  register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  });

  login = asyncHandler(async (req, res) => {
    const { login, password } = req.body;
    const result = await authService.login(login, password);
    res.json(result);
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);

    if (result.resetToken) {
      await emailService.sendPasswordResetEmail(email, result.resetToken);
    }

    res.json({ message: "Если email существует, письмо отправлено" });
  });

  resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    res.json(result);
  });
}

export default new AuthController();
