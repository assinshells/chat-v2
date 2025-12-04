// frontend/src/hooks/useAuth.js
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import storageService from "../services/storage.service";
import socketService from "../services/socket.service";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = useCallback(
    async (credentials, selectedRoom) => {
      setLoading(true);
      setError("");

      try {
        const response = await authApi.login(credentials);

        storageService.setToken(response.token);
        storageService.setUser(response.user);
        storageService.setRoom(selectedRoom);

        navigate("/chat");
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const register = useCallback(
    async (userData, selectedRoom) => {
      setLoading(true);
      setError("");

      try {
        const response = await authApi.register(userData);

        storageService.setToken(response.token);
        storageService.setUser(response.user);
        storageService.setRoom(selectedRoom);

        navigate("/chat");
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    socketService.disconnect();
    storageService.clearAll();
    navigate("/login");
  }, [navigate]);

  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    setError("");

    try {
      const response = await authApi.forgotPassword(email);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    setLoading(true);
    setError("");

    try {
      const response = await authApi.resetPassword(token, newPassword);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    loading,
    error,
    setError,
  };
};
