// ==========================================
// src/controllers/user.controller.js
// ==========================================
import userService from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class UserController {
  getProfile = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.user.id);
    res.json({
      id: user._id,
      nickname: user.nickname,
      email: user.email,
      messageColor: user.messageColor,
      gender: user.gender,
    });
  });

  updateMessageColor = asyncHandler(async (req, res) => {
    const { messageColor } = req.body;
    const user = await userService.updateMessageColor(
      req.user.id,
      messageColor
    );

    res.json({
      id: user._id,
      nickname: user.nickname,
      email: user.email,
      messageColor: user.messageColor,
      gender: user.gender,
    });
  });

  updateGender = asyncHandler(async (req, res) => {
    const { gender } = req.body;
    const user = await userService.updateGender(req.user.id, gender);

    res.json({
      id: user._id,
      nickname: user.nickname,
      email: user.email,
      messageColor: user.messageColor,
      gender: user.gender,
    });
  });
}

export default new UserController();
