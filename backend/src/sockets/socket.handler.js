// ==========================================
// src/sockets/socket.handler.js
// ==========================================
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Message from "../models/Message.model.js";
import PrivateMessage from "../models/PrivateMessage.model.js";
import { config } from "../config/env.js";
import { GENDER_VERBS } from "../constants/index.js";
import logger from "../utils/logger.js";

class SocketHandler {
  constructor() {
    this.roomUsers = new Map();
    this.connectedUsers = new Map();
  }

  getGenderVerb(gender, action) {
    return GENDER_VERBS[action]?.[gender] || GENDER_VERBS[action]?.male;
  }

  getRoomUsers(roomName) {
    const users = this.roomUsers.get(roomName) || new Set();
    return Array.from(users);
  }

  async getRoomsInfo(Room) {
    try {
      const allRooms = await Room.find().lean();

      return allRooms.map((room) => {
        const users = this.roomUsers.get(room.name) || new Set();
        return {
          name: room.name,
          displayName: room.displayName,
          description: room.description,
          userCount: users.size,
          users: Array.from(users),
        };
      });
    } catch (error) {
      logger.error("Ошибка получения информации о комнатах:", error);
      return [];
    }
  }

  async handleConnection(socket, io, Room) {
    logger.info("🔌 Новое подключение:", socket.id);

    socket.on("authenticate", async ({ token, room }) => {
      try {
        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await User.findById(decoded.id);

        if (!user) {
          socket.emit("auth_error", "Пользователь не найден");
          return socket.disconnect();
        }

        // Сохранение данных пользователя в socket
        socket.userId = user._id.toString();
        socket.nickname = user.nickname;
        socket.messageColor = user.messageColor;
        socket.gender = user.gender;
        socket.currentRoom = room || "главная";

        // Сохранение в connectedUsers
        this.connectedUsers.set(socket.id, {
          userId: socket.userId,
          nickname: socket.nickname,
          messageColor: socket.messageColor,
          gender: socket.gender,
          currentRoom: socket.currentRoom,
        });

        // Обновление lastSeen
        user.lastSeen = new Date();
        await user.save();

        // Присоединение к комнате
        socket.join(socket.currentRoom);

        // Добавление в roomUsers
        if (!this.roomUsers.has(socket.currentRoom)) {
          this.roomUsers.set(socket.currentRoom, new Set());
        }
        this.roomUsers.get(socket.currentRoom).add({
          socketId: socket.id,
          userId: socket.userId,
          nickname: socket.nickname,
          messageColor: socket.messageColor,
          gender: socket.gender,
        });

        // Отправка истории сообщений
        const messages = await Message.find({ room: socket.currentRoom })
          .sort({ timestamp: -1 })
          .limit(50)
          .lean();

        socket.emit("message_history", messages.reverse());
        socket.emit("authenticated", {
          nickname: user.nickname,
          room: socket.currentRoom,
        });

        // Обновление информации о комнатах
        const roomsInfo = await this.getRoomsInfo(Room);
        io.emit("rooms_update", roomsInfo);

        // Уведомление о входе
        const joinVerb = this.getGenderVerb(user.gender, "join");
        io.to(socket.currentRoom).emit("user_joined", {
          nickname: user.nickname,
          messageColor: user.messageColor,
          gender: user.gender,
          room: socket.currentRoom,
          message: `${joinVerb} в комнату`,
          userId: user._id.toString(),
        });

        logger.success("✅ Пользователь авторизован:", user.nickname);
      } catch (error) {
        logger.error("Ошибка аутентификации:", error);
        socket.emit("auth_error", "Недействительный токен");
        socket.disconnect();
      }
    });

    socket.on("join_room", async (roomName) => {
      if (!socket.userId) {
        return socket.emit("error", "Не авторизован");
      }

      try {
        const oldRoom = socket.currentRoom;

        if (oldRoom) {
          // Покидание старой комнаты
          socket.leave(oldRoom);
          const oldRoomUsers = this.roomUsers.get(oldRoom);
          if (oldRoomUsers) {
            oldRoomUsers.forEach((u) => {
              if (u.socketId === socket.id) {
                oldRoomUsers.delete(u);
              }
            });
          }

          // Уведомление о переходе
          const switchVerb = this.getGenderVerb(socket.gender, "switch");
          io.to(oldRoom).emit("user_left", {
            nickname: socket.nickname,
            messageColor: socket.messageColor,
            gender: socket.gender,
            room: oldRoom,
            message: `${switchVerb} в комнату ${roomName}`,
            userId: socket.userId,
          });
        }

        // Присоединение к новой комнате
        socket.join(roomName);
        socket.currentRoom = roomName;

        const userInfo = this.connectedUsers.get(socket.id);
        if (userInfo) {
          userInfo.currentRoom = roomName;
        }

        if (!this.roomUsers.has(roomName)) {
          this.roomUsers.set(roomName, new Set());
        }
        this.roomUsers.get(roomName).add({
          socketId: socket.id,
          userId: socket.userId,
          nickname: socket.nickname,
          messageColor: socket.messageColor,
          gender: socket.gender,
        });

        // Отправка истории сообщений новой комнаты
        const messages = await Message.find({ room: roomName })
          .sort({ timestamp: -1 })
          .limit(50)
          .lean();

        socket.emit("room_changed", {
          room: roomName,
          messages: messages.reverse(),
        });

        // Обновление информации о комнатах
        const roomsInfo = await this.getRoomsInfo(Room);
        io.emit("rooms_update", roomsInfo);

        // Уведомление о входе в новую комнату
        const joinVerb = this.getGenderVerb(socket.gender, "join");
        io.to(roomName).emit("user_joined", {
          nickname: socket.nickname,
          messageColor: socket.messageColor,
          gender: socket.gender,
          room: roomName,
          message: `${joinVerb} в комнату`,
          userId: socket.userId,
        });

        logger.info(
          `👤 ${socket.nickname} переключился в комнату: ${roomName}`
        );
      } catch (error) {
        logger.error("Ошибка смены комнаты:", error);
        socket.emit("error", "Ошибка смены комнаты");
      }
    });

    socket.on("send_message", async (messageData) => {
      if (!socket.userId) {
        return socket.emit("error", "Не авторизован");
      }

      try {
        // Приватное сообщение
        if (messageData.toUserId && messageData.toNickname) {
          const privateMsg = new PrivateMessage({
            fromUserId: socket.userId,
            fromNickname: socket.nickname,
            fromMessageColor: socket.messageColor,
            toUserId: messageData.toUserId,
            toNickname: messageData.toNickname,
            text: messageData.text,
          });

          await privateMsg.save();

          const messagePayload = {
            id: privateMsg._id.toString(),
            fromUserId: privateMsg.fromUserId.toString(),
            fromNickname: privateMsg.fromNickname,
            fromMessageColor: privateMsg.fromMessageColor,
            toUserId: privateMsg.toUserId.toString(),
            toNickname: privateMsg.toNickname,
            text: privateMsg.text,
            read: privateMsg.read,
            timestamp: privateMsg.timestamp,
          };

          // Отправка отправителю
          socket.emit("private_message", messagePayload);

          // Отправка получателю
          const recipientSockets = [];
          for (const [socketId, userData] of this.connectedUsers.entries()) {
            if (userData.userId === messageData.toUserId) {
              recipientSockets.push(socketId);
            }
          }

          recipientSockets.forEach((recipientSocketId) => {
            io.to(recipientSocketId).emit("private_message", messagePayload);
            io.to(recipientSocketId).emit("unread_count_update");
          });
        } else {
          // Публичное сообщение
          const message = new Message({
            userId: socket.userId,
            nickname: socket.nickname,
            messageColor: socket.messageColor,
            text: messageData.text,
            room: socket.currentRoom,
          });

          await message.save();

          io.to(socket.currentRoom).emit("new_message", {
            id: message._id,
            userId: message.userId,
            nickname: message.nickname,
            messageColor: message.messageColor,
            text: message.text,
            room: message.room,
            timestamp: message.timestamp,
          });
        }
      } catch (error) {
        logger.error("❌ Ошибка отправки сообщения:", error);
        socket.emit("error", "Ошибка отправки сообщения");
      }
    });

    socket.on("typing", () => {
      if (socket.userId && socket.currentRoom) {
        socket.to(socket.currentRoom).emit("user_typing", {
          nickname: socket.nickname,
          room: socket.currentRoom,
        });
      }
    });

    socket.on("disconnect", async () => {
      if (socket.userId && socket.currentRoom) {
        const roomUsersSet = this.roomUsers.get(socket.currentRoom);
        if (roomUsersSet) {
          roomUsersSet.forEach((u) => {
            if (u.socketId === socket.id) {
              roomUsersSet.delete(u);
            }
          });
        }

        // Уведомление о выходе
        const leaveVerb = this.getGenderVerb(socket.gender, "leave");
        io.to(socket.currentRoom).emit("user_left", {
          nickname: socket.nickname,
          messageColor: socket.messageColor,
          gender: socket.gender,
          room: socket.currentRoom,
          message: `${leaveVerb} чат`,
          userId: socket.userId,
        });

        this.connectedUsers.delete(socket.id);

        const roomsInfo = await this.getRoomsInfo(Room);
        io.emit("rooms_update", roomsInfo);

        logger.info("👋 Пользователь отключился:", socket.nickname);
      }
    });
  }

  initialize(io, Room) {
    io.on("connection", (socket) => {
      this.handleConnection(socket, io, Room);
    });
  }
}

export default new SocketHandler();
