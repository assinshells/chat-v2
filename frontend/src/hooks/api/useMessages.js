// frontend/src/hooks/api/useMessages.js
import { useState, useCallback } from "react";
import { messagesEndpoints } from "../../api";

export const useMessages = () => {
  const [state, setState] = useState({
    conversations: [],
    messages: [],
    unreadCount: 0,
    loading: false,
    error: null,
  });

  const setLoading = (loading) => setState((prev) => ({ ...prev, loading }));
  const setError = (error) => setState((prev) => ({ ...prev, error }));

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await messagesEndpoints.getConversations();
      const totalUnread = data.reduce((sum, conv) => sum + conv.unreadCount, 0);

      setState((prev) => ({
        ...prev,
        conversations: data,
        unreadCount: totalUnread,
        loading: false,
      }));
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(
    async (userId) => {
      setLoading(true);
      try {
        const data = await messagesEndpoints.getPrivateMessages(userId);

        setState((prev) => ({
          ...prev,
          messages: data,
          loading: false,
        }));

        await messagesEndpoints.markAsRead(userId);
        await loadConversations();
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    },
    [loadConversations]
  );

  const loadUnreadCount = useCallback(async () => {
    try {
      const data = await messagesEndpoints.getUnreadCount();
      setState((prev) => ({ ...prev, unreadCount: data.unreadCount }));
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  }, []);

  return {
    ...state,
    loadConversations,
    loadMessages,
    loadUnreadCount,
  };
};
