// ==========================================
// src/controllers/message.controller.js
// ==========================================
import messageService from "../services/message.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class MessageController {
  getMessagesByRoom = asyncHandler(async (req, res) => {
    const { room } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const messages = await messageService.getMessagesByRoom(room, limit);
    res.json(messages);
  });

  getConversations = asyncHandler(async (req, res) => {
    const conversations = await messageService.getConversations(req.user.id);
    res.json(conversations);
  });

  getPrivateMessages = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 100;

    const messages = await messageService.getPrivateMessages(
      req.user.id,
      userId,
      limit
    );

    res.json(messages);
  });

  markMessagesAsRead = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const result = await messageService.markMessagesAsRead(req.user.id, userId);
    res.json(result);
  });

  getUnreadCount = asyncHandler(async (req, res) => {
    const result = await messageService.getUnreadCount(req.user.id);
    res.json(result);
  });
}

export default new MessageController();
