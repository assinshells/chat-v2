// frontend/src/services/socket.service.js
import { io } from "socket.io-client";
import { API_CONFIG, SOCKET_CONFIG, SOCKET_EVENTS } from "../constants/config";

class SocketService {
  constructor() {
    this.socket = null;
    this.messageCache = new Set();
  }

  connect() {
    if (this.socket?.connected) {
      console.warn("⚠️ Socket already connected");
      return this.socket;
    }

    this.socket = io(API_CONFIG.WS_URL, {
      transports: SOCKET_CONFIG.TRANSPORTS,
      reconnectionDelay: SOCKET_CONFIG.RECONNECTION_DELAY,
      reconnectionDelayMax: SOCKET_CONFIG.RECONNECTION_DELAY_MAX,
      reconnectionAttempts: SOCKET_CONFIG.RECONNECTION_ATTEMPTS,
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.messageCache.clear();
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  authenticate(token, room) {
    this.emit(SOCKET_EVENTS.AUTHENTICATE, { token, room });
  }

  joinRoom(roomName) {
    this.emit(SOCKET_EVENTS.JOIN_ROOM, roomName);
  }

  sendMessage(messageData) {
    this.emit(SOCKET_EVENTS.SEND_MESSAGE, messageData);
  }

  sendTyping() {
    this.emit(SOCKET_EVENTS.TYPING);
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  hasMessageInCache(messageId) {
    return this.messageCache.has(messageId);
  }

  addMessageToCache(messageId) {
    if (messageId) {
      this.messageCache.add(messageId);
    }
  }

  clearMessageCache() {
    this.messageCache.clear();
  }
}

export default new SocketService();
