// frontend/src/api/auth.api.js
import apiClient from "./axios.config";

export const authApi = {
  login: (credentials) => apiClient.post("/api/login", credentials),

  register: (userData) => apiClient.post("/api/register", userData),

  forgotPassword: (email) => apiClient.post("/api/forgot-password", { email }),

  resetPassword: (token, newPassword) =>
    apiClient.post("/api/reset-password", { token, newPassword }),
};
