// frontend/src/api/messages.api.js
import apiClient from "./axios.config";

export const messagesApi = {
  getConversations: () => apiClient.get("/api/conversations"),

  getPrivateMessages: (userId) =>
    apiClient.get(`/api/private-messages/${userId}`),

  markAsRead: (userId) =>
    apiClient.post(`/api/private-messages/mark-read/${userId}`),

  getUnreadCount: () => apiClient.get("/api/unread-count"),
};
