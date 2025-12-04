// frontend/src/api/endpoints/messages.js
export const messagesEndpoints = {
  getConversations: () => apiClient.get("/api/messages/conversations"),

  getPrivateMessages: (userId) =>
    apiClient.get(`/api/messages/private/${userId}`),

  markAsRead: (userId) => apiClient.post(`/api/messages/mark-read/${userId}`),

  getUnreadCount: () => apiClient.get("/api/messages/unread-count"),

  getMessagesByRoom: (room, limit = 50) =>
    apiClient.get(`/api/messages/room/${room}`, { params: { limit } }),
};
