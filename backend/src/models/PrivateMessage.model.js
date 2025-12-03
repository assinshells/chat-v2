// ==========================================
// src/models/PrivateMessage.model.js
// ==========================================
import mongoose from "mongoose";

const privateMessageSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  fromNickname: {
    type: String,
    required: true,
  },
  fromMessageColor: {
    type: String,
    default: "black",
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  toNickname: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  read: {
    type: Boolean,
    default: false,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Композитные индексы
privateMessageSchema.index({ toUserId: 1, fromUserId: 1, timestamp: -1 });
privateMessageSchema.index({ toUserId: 1, read: 1 });

const PrivateMessage = mongoose.model("PrivateMessage", privateMessageSchema);

export default PrivateMessage;
