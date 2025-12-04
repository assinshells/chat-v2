// frontend/src/hooks/useChat.js
import { useState, useCallback } from "react";

export const useChat = (user, sendMessage, sendTyping) => {
  const [inputMessage, setInputMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSendMessage = useCallback(
    (e) => {
      e.preventDefault();

      if (!inputMessage.trim()) return;

      const messageData = {
        text: selectedUser
          ? `@${selectedUser.nickname} ${inputMessage.trim()}`
          : inputMessage.trim(),
      };

      sendMessage(messageData);
      setInputMessage("");
      setSelectedUser(null);
    },
    [inputMessage, selectedUser, sendMessage]
  );

  const handleInputChange = useCallback(
    (e) => {
      setInputMessage(e.target.value);

      if (e.target.value.trim()) {
        sendTyping();
      }
    },
    [sendTyping]
  );

  const handleUserClick = useCallback(
    (u) => {
      if (u.userId === user?.id) return;
      setSelectedUser({
        userId: u.userId,
        nickname: u.nickname,
      });
    },
    [user]
  );

  const handleTimeClick = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const timeStr = date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setInputMessage((prev) => (prev ? `${prev} ${timeStr}` : timeStr));
  }, []);

  return {
    inputMessage,
    setInputMessage,
    selectedUser,
    setSelectedUser,
    handleSendMessage,
    handleInputChange,
    handleUserClick,
    handleTimeClick,
  };
};
