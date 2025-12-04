// frontend/src/hooks/usePrivateMessages.js
import { useState, useCallback, useEffect, useRef } from "react";
import { messagesApi } from "../api/messages.api";

export const usePrivateMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messageIdsRef = useRef(new Set());
  const isLoadingRef = useRef(false);

  const loadConversations = useCallback(async () => {
    try {
      const data = await messagesApi.getConversations();
      setConversations(data);

      const total = data.reduce((sum, conv) => sum + conv.unreadCount, 0);
      setUnreadCount(total);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  }, []);

  const loadMessages = useCallback(
    async (userId) => {
      if (isLoadingRef.current) {
        console.warn("⚠️ Loading already in progress");
        return;
      }

      try {
        isLoadingRef.current = true;
        setLoading(true);

        const data = await messagesApi.getPrivateMessages(userId);

        console.log("📨 Loaded messages:", data.length);

        messageIdsRef.current.clear();
        setMessages(data);

        data.forEach((msg) => {
          const msgId = msg.id || msg._id;
          if (msgId) messageIdsRef.current.add(msgId);
        });

        await messagesApi.markAsRead(userId);
        await loadConversations();
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    },
    [loadConversations]
  );

  const loadUnreadCount = useCallback(async () => {
    try {
      const data = await messagesApi.getUnreadCount();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  }, []);

  const addMessage = useCallback((message) => {
    const messageId = message.id || message._id;

    if (messageId && messageIdsRef.current.has(messageId)) {
      console.warn("⚠️ Duplicate message:", messageId);
      return;
    }

    setMessages((prev) => [...prev, message]);

    if (messageId) {
      messageIdsRef.current.add(messageId);
    }
  }, []);

  const selectConversation = useCallback(
    (conversation) => {
      setSelectedConversation(conversation);
      loadMessages(conversation.userId);
    },
    [loadMessages]
  );

  return {
    conversations,
    selectedConversation,
    messages,
    loading,
    unreadCount,
    loadConversations,
    loadMessages,
    loadUnreadCount,
    addMessage,
    selectConversation,
    setMessages,
  };
};
