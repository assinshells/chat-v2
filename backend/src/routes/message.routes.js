// ==========================================
// src/routes/message.routes.js
// ==========================================
import express from "express";
import messageController from "../controllers/message.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/room/:room", messageController.getMessagesByRoom);
router.get("/conversations", messageController.getConversations);
router.get("/private/:userId", messageController.getPrivateMessages);
router.post("/mark-read/:userId", messageController.markMessagesAsRead);
router.get("/unread-count", messageController.getUnreadCount);

export default router;
