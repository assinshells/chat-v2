// frontend/src/api/endpoints/users.js
export const usersEndpoints = {
  getProfile: () => apiClient.get("/api/user/profile"),

  updateMessageColor: (messageColor) =>
    apiClient.patch("/api/user/message-color", { messageColor }),

  updateGender: (gender) => apiClient.patch("/api/user/gender", { gender }),
};
