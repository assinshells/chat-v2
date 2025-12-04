// frontend/src/hooks/useSocket.js
import { useState, useEffect, useCallback, useRef } from "react";
import {
  SOCKET_EVENTS,
  TYPING_TIMEOUT,
  SYSTEM_MESSAGES_LIMIT,
} from "../constants/config";
import socketService from "../services/socket.service";
import storageService from "../services/storage.service";

export const useSocket = (user, currentRoom, onLogout, onUnreadUpdate) => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(null);
  const [systemMessages, setSystemMessages] = useState([]);
  const [rooms, setRooms] = useState([]);

  const typingTimeoutRef = useRef(null);

  // Connect socket
  useEffect(() => {
    if (!user) return;

    const token = storageService.getToken();
    if (!token) return;

    const socket = socketService.connect();

    const handleConnect = () => {
      console.log("✅ Connected to server");
      setConnected(true);
      socketService.authenticate(token, currentRoom);
    };

    const handleAuthenticated = (data) => {
      console.log("✅ Authenticated in room:", data.room);
    };

    const handleAuthError = (error) => {
      console.error("❌ Auth error:", error);
      onLogout();
    };

    const handleMessageHistory = (history) => {
      console.log("📜 Message history:", history.length);
      socketService.clearMessageCache();
      setMessages(history);

      history.forEach((msg) => {
        socketService.addMessageToCache(msg.id || msg._id);
      });
    };

    const handleNewMessage = (message) => {
      const messageId = message.id || message._id;

      if (messageId && socketService.hasMessageInCache(messageId)) {
        console.warn("⚠️ Duplicate message:", messageId);
        return;
      }

      console.log("📨 New message:", message);
      setMessages((prev) => [...prev, message]);

      if (messageId) {
        socketService.addMessageToCache(messageId);
      }
    };

    const handleUserJoined = (data) => {
      console.log("👋 User joined:", data.nickname);
      setSystemMessages((prev) => [
        ...prev.slice(-SYSTEM_MESSAGES_LIMIT + 1),
        {
          ...data,
          timestamp: Date.now(),
        },
      ]);
    };

    const handleUserLeft = (data) => {
      console.log("👋 User left:", data.nickname);
      setSystemMessages((prev) => [
        ...prev.slice(-SYSTEM_MESSAGES_LIMIT + 1),
        {
          ...data,
          timestamp: Date.now(),
        },
      ]);
    };

    const handleRoomChanged = (data) => {
      console.log("🚪 Room changed:", data.room);
      socketService.clearMessageCache();
      setMessages(data.messages);
      setSystemMessages([]);
      storageService.setRoom(data.room);

      data.messages.forEach((msg) => {
        socketService.addMessageToCache(msg.id || msg._id);
      });
    };

    const handleRoomsUpdate = (roomsData) => {
      if (roomsData?.length > 0) {
        setRooms(roomsData);
      }
    };

    const handleUserTyping = (data) => {
      if (data.room === currentRoom) {
        setTyping(data.nickname);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          setTyping(null);
        }, TYPING_TIMEOUT);
      }
    };

    const handlePrivateMessage = () => {
      onUnreadUpdate?.();
    };

    const handleUnreadCountUpdate = () => {
      onUnreadUpdate?.();
    };

    const handleDisconnect = (reason) => {
      console.log("❌ Disconnected:", reason);
      setConnected(false);
    };

    const handleReconnect = (attemptNumber) => {
      console.log("🔄 Reconnected, attempt:", attemptNumber);
      socketService.authenticate(token, currentRoom);
    };

    // Register event listeners
    socket.on(SOCKET_EVENTS.CONNECT, handleConnect);
    socket.on(SOCKET_EVENTS.AUTHENTICATED, handleAuthenticated);
    socket.on(SOCKET_EVENTS.AUTH_ERROR, handleAuthError);
    socket.on(SOCKET_EVENTS.MESSAGE_HISTORY, handleMessageHistory);
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.USER_JOINED, handleUserJoined);
    socket.on(SOCKET_EVENTS.USER_LEFT, handleUserLeft);
    socket.on(SOCKET_EVENTS.ROOM_CHANGED, handleRoomChanged);
    socket.on(SOCKET_EVENTS.ROOMS_UPDATE, handleRoomsUpdate);
    socket.on(SOCKET_EVENTS.USER_TYPING, handleUserTyping);
    socket.on(SOCKET_EVENTS.PRIVATE_MESSAGE, handlePrivateMessage);
    socket.on(SOCKET_EVENTS.UNREAD_COUNT_UPDATE, handleUnreadCountUpdate);
    socket.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
    socket.on(SOCKET_EVENTS.RECONNECT, handleReconnect);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      socket.off(SOCKET_EVENTS.CONNECT, handleConnect);
      socket.off(SOCKET_EVENTS.AUTHENTICATED, handleAuthenticated);
      socket.off(SOCKET_EVENTS.AUTH_ERROR, handleAuthError);
      socket.off(SOCKET_EVENTS.MESSAGE_HISTORY, handleMessageHistory);
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.USER_JOINED, handleUserJoined);
      socket.off(SOCKET_EVENTS.USER_LEFT, handleUserLeft);
      socket.off(SOCKET_EVENTS.ROOM_CHANGED, handleRoomChanged);
      socket.off(SOCKET_EVENTS.ROOMS_UPDATE, handleRoomsUpdate);
      socket.off(SOCKET_EVENTS.USER_TYPING, handleUserTyping);
      socket.off(SOCKET_EVENTS.PRIVATE_MESSAGE, handlePrivateMessage);
      socket.off(SOCKET_EVENTS.UNREAD_COUNT_UPDATE, handleUnreadCountUpdate);
      socket.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
      socket.off(SOCKET_EVENTS.RECONNECT, handleReconnect);

      socketService.disconnect();
    };
  }, [user, currentRoom, onLogout, onUnreadUpdate]);

  const sendMessage = useCallback((messageData) => {
    socketService.sendMessage(messageData);
  }, []);

  const joinRoom = useCallback((roomName) => {
    socketService.joinRoom(roomName);
  }, []);

  const sendTyping = useCallback(() => {
    socketService.sendTyping();
  }, []);

  return {
    connected,
    messages,
    typing,
    systemMessages,
    rooms,
    sendMessage,
    joinRoom,
    sendTyping,
  };
};
