// frontend/src/api/endpoints/auth.js
import apiClient from "../client";

export const authEndpoints = {
  login: (credentials) => apiClient.post("/api/auth/login", credentials),

  register: (userData) => apiClient.post("/api/auth/register", userData),

  forgotPassword: (email) =>
    apiClient.post("/api/auth/forgot-password", { email }),

  resetPassword: (token, newPassword) =>
    apiClient.post("/api/auth/reset-password", { token, newPassword }),
};
