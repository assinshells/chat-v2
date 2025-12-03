// ==========================================
// src/services/message.service.js
// ==========================================
import Message from "../models/Message.model.js";
import PrivateMessage from "../models/PrivateMessage.model.js";
import ApiError from "../utils/ApiError.js";

class MessageService {
  async getMessagesByRoom(room, limit = 50) {
    const messages = await Message.find({ room })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return messages.reverse();
  }

  async createMessage(messageData) {
    const message = new Message(messageData);
    await message.save();
    return message;
  }

  async getConversations(userId) {
    const messages = await PrivateMessage.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    }).sort({ timestamp: -1 });

    const conversationsMap = new Map();

    for (const msg of messages) {
      const isFromMe = msg.fromUserId.toString() === userId;
      const partnerId = isFromMe
        ? msg.toUserId.toString()
        : msg.fromUserId.toString();
      const partnerNickname = isFromMe ? msg.toNickname : msg.fromNickname;

      if (!conversationsMap.has(partnerId)) {
        const unreadCount = await PrivateMessage.countDocuments({
          toUserId: userId,
          fromUserId: partnerId,
          read: false,
        });

        conversationsMap.set(partnerId, {
          userId: partnerId,
          nickname: partnerNickname,
          lastMessage: msg.text,
          lastMessageTime: msg.timestamp,
          unreadCount,
          lastMessageFromMe: isFromMe,
        });
      }
    }

    const conversations = Array.from(conversationsMap.values()).sort(
      (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );

    return conversations;
  }

  async getPrivateMessages(currentUserId, partnerId, limit = 100) {
    const messages = await PrivateMessage.find({
      $or: [
        { fromUserId: currentUserId, toUserId: partnerId },
        { fromUserId: partnerId, toUserId: currentUserId },
      ],
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    // Отметить как прочитанные
    await PrivateMessage.updateMany(
      {
        fromUserId: partnerId,
        toUserId: currentUserId,
        read: false,
      },
      { read: true }
    );

    return messages.reverse();
  }

  async markMessagesAsRead(currentUserId, partnerId) {
    const result = await PrivateMessage.updateMany(
      {
        fromUserId: partnerId,
        toUserId: currentUserId,
        read: false,
      },
      { read: true }
    );

    return { success: true, modifiedCount: result.modifiedCount };
  }

  async getUnreadCount(userId) {
    const unreadCount = await PrivateMessage.countDocuments({
      toUserId: userId,
      read: false,
    });

    return { unreadCount };
  }

  async createPrivateMessage(messageData) {
    const privateMsg = new PrivateMessage(messageData);
    await privateMsg.save();
    return privateMsg;
  }
}

export default new MessageService();
