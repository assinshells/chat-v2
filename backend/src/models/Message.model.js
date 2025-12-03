// ==========================================
// src/models/Message.model.js
// ==========================================
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  messageColor: {
    type: String,
    default: "black",
  },
  text: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  room: {
    type: String,
    required: true,
    default: "главная",
    index: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  toNickname: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Композитный индекс для быстрого поиска сообщений в комнате
messageSchema.index({ room: 1, timestamp: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
