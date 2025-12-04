// frontend/src/hooks/api/useAuth.js
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authEndpoints } from "../../api";
import storageService from "../../services/storage.service";

export const useAuth = () => {
  const [state, setState] = useState({
    loading: false,
    error: null,
  });
  const navigate = useNavigate();

  const setLoading = (loading) => setState((prev) => ({ ...prev, loading }));
  const setError = (error) => setState((prev) => ({ ...prev, error }));

  const login = useCallback(
    async (credentials, selectedRoom) => {
      setLoading(true);
      setError(null);

      try {
        const data = await authEndpoints.login(credentials);

        storageService.setToken(data.token);
        storageService.setUser(data.user);
        storageService.setRoom(selectedRoom);

        navigate("/chat");
        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const register = useCallback(
    async (userData, selectedRoom) => {
      setLoading(true);
      setError(null);

      try {
        const data = await authEndpoints.register(userData);

        storageService.setToken(data.token);
        storageService.setUser(data.user);
        storageService.setRoom(selectedRoom);

        navigate("/chat");
        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    storageService.clearAll();
    navigate("/login");
  }, [navigate]);

  return {
    ...state,
    login,
    register,
    logout,
    setError,
  };
};
