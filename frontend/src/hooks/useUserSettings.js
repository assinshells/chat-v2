// frontend/src/hooks/useUserSettings.js
import { useState, useCallback } from "react";
import { usersApi } from "../api/users.api";
import storageService from "../services/storage.service";

export const useUserSettings = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateColor = useCallback(async (color, onUpdate) => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updatedUser = await usersApi.updateMessageColor(color);
      storageService.setUser(updatedUser);

      if (onUpdate) {
        onUpdate(updatedUser);
      }

      setSuccess("Цвет успешно изменён!");
      setTimeout(() => setSuccess(""), 3000);

      return updatedUser;
    } catch (err) {
      console.error("Error updating color:", err);
      setError("Не удалось изменить цвет");
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateGender = useCallback(async (gender, onUpdate) => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updatedUser = await usersApi.updateGender(gender);
      storageService.setUser(updatedUser);

      if (onUpdate) {
        onUpdate(updatedUser);
      }

      setSuccess("Пол успешно изменён!");
      setTimeout(() => setSuccess(""), 3000);

      return updatedUser;
    } catch (err) {
      console.error("Error updating gender:", err);
      setError("Не удалось изменить пол");
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    saving,
    error,
    success,
    updateColor,
    updateGender,
    setError,
    setSuccess,
  };
};
