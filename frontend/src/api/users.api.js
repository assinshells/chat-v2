// frontend/src/api/users.api.js
import apiClient from "./axios.config";

export const usersApi = {
  updateMessageColor: (messageColor) =>
    apiClient.patch("/api/user/message-color", { messageColor }),

  updateGender: (gender) => apiClient.patch("/api/user/gender", { gender }),

  getRooms: () => apiClient.get("/api/rooms"),
};
