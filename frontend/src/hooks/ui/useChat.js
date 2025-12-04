// frontend/src/hooks/ui/useChat.js - Упрощенная версия
import { useState, useCallback, useRef } from "react";
import { TYPING_TIMEOUT } from "../../constants/config";

export const useChat = (user, sendMessage, sendTyping) => {
  const [inputMessage, setInputMessage] = useState("");
  const typingTimeoutRef = useRef(null);

  const handleInputChange = useCallback(
    (e) => {
      setInputMessage(e.target.value);

      if (e.target.value.trim()) {
        // Debounced typing indicator
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        sendTyping();

        typingTimeoutRef.current = setTimeout(() => {
          typingTimeoutRef.current = null;
        }, TYPING_TIMEOUT);
      }
    },
    [sendTyping]
  );

  return {
    inputMessage,
    setInputMessage,
    handleInputChange,
  };
};
