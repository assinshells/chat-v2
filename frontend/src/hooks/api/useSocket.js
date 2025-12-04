// frontend/src/hooks/api/useSocket.js - Оптимизированная версия
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import socketService from "../../services/socket.service";
import storageService from "../../services/storage.service";
import {
  SOCKET_EVENTS,
  TYPING_TIMEOUT,
  SYSTEM_MESSAGES_LIMIT,
} from "../../constants/config";
import { isValidMessage } from "../../utils/typeGuards";

export const useSocket = (user, currentRoom, onLogout, onUnreadUpdate) => {
  const [state, setState] = useState({
    connected: false,
    messages: [],
    typing: null,
    systemMessages: [],
    rooms: [],
  });

  const typingTimeoutRef = useRef(null);
  const messageIdsRef = useRef(new Set());

  // Memoized setters для избежания лишних ре-рендеров
  const setConnected = useCallback((connected) => {
    setState((prev) => ({ ...prev, connected }));
  }, []);

  const setMessages = useCallback((messages) => {
    setState((prev) => ({ ...prev, messages }));
  }, []);

  const addMessage = useCallback((message) => {
    if (!isValidMessage(message)) {
      console.warn("Invalid message received:", message);
      return;
    }

    const messageId = message.id || message._id;

    if (messageId && messageIdsRef.current.has(messageId)) {
      console.warn("Duplicate message:", messageId);
      return;
    }

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));

    if (messageId) {
      messageIdsRef.current.add(messageId);
    }
  }, []);

  const setTyping = useCallback((nickname) => {
    setState((prev) => ({ ...prev, typing: nickname }));

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (nickname) {
      typingTimeoutRef.current = setTimeout(() => {
        setState((prev) => ({ ...prev, typing: null }));
      }, TYPING_TIMEOUT);
    }
  }, []);

  const addSystemMessage = useCallback((message) => {
    setState((prev) => ({
      ...prev,
      systemMessages: [
        ...prev.systemMessages.slice(-SYSTEM_MESSAGES_LIMIT + 1),
        { ...message, timestamp: Date.now() },
      ],
    }));
  }, []);

  const setRooms = useCallback((rooms) => {
    setState((prev) => ({ ...prev, rooms }));
  }, []);

  const clearMessages = useCallback(() => {
    messageIdsRef.current.clear();
    setState((prev) => ({
      ...prev,
      messages: [],
      systemMessages: [],
    }));
  }, []);

  // Socket connection
  useEffect(() => {
    if (!user) return;

    const token = storageService.getToken();
    if (!token) return;

    const socket = socketService.connect();

    // Event handlers
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
      messageIdsRef.current.clear();
      setMessages(history);

      history.forEach((msg) => {
        const id = msg.id || msg._id;
        if (id) messageIdsRef.current.add(id);
      });
    };

    const handleNewMessage = (message) => {
      addMessage(message);
    };

    const handleUserJoined = (data) => {
      console.log("👋 User joined:", data.nickname);
      addSystemMessage(data);
    };

    const handleUserLeft = (data) => {
      console.log("👋 User left:", data.nickname);
      addSystemMessage(data);
    };

    const handleRoomChanged = (data) => {
      console.log("🚪 Room changed:", data.room);
      clearMessages();
      setMessages(data.messages);
      storageService.setRoom(data.room);

      data.messages.forEach((msg) => {
        const id = msg.id || msg._id;
        if (id) messageIdsRef.current.add(id);
      });
    };

    const handleRoomsUpdate = (roomsData) => {
      if (roomsData?.length > 0) {
        setRooms(roomsData);
      }
    };

    const handleUserTyping = (data) => {
      if (data.room === currentRoom && data.nickname !== user.nickname) {
        setTyping(data.nickname);
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

      // Cleanup listeners
      Object.values(SOCKET_EVENTS).forEach((event) => {
        socket.off(event);
      });

      socketService.disconnect();
    };
  }, [
    user,
    currentRoom,
    onLogout,
    onUnreadUpdate,
    setConnected,
    setMessages,
    addMessage,
    setTyping,
    addSystemMessage,
    setRooms,
    clearMessages,
  ]);

  // Memoized methods
  const sendMessage = useCallback((messageData) => {
    socketService.sendMessage(messageData);
  }, []);

  const joinRoom = useCallback((roomName) => {
    socketService.joinRoom(roomName);
  }, []);

  const sendTyping = useCallback(() => {
    socketService.sendTyping();
  }, []);

  // Memoized return value
  return useMemo(
    () => ({
      ...state,
      sendMessage,
      joinRoom,
      sendTyping,
    }),
    [state, sendMessage, joinRoom, sendTyping]
  );
};
