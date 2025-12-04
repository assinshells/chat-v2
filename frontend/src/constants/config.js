// frontend/src/constants/config.js

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  WS_URL: import.meta.env.VITE_WS_URL || "http://localhost:5000",
  TIMEOUT: 10000,
};

export const SOCKET_CONFIG = {
  TRANSPORTS: ["websocket", "polling"],
  RECONNECTION_DELAY: 1000,
  RECONNECTION_DELAY_MAX: 5000,
  RECONNECTION_ATTEMPTS: 5,
};

export const STORAGE_KEYS = {
  TOKEN: "chatToken",
  USER: "chatUser",
  ROOM: "selectedRoom",
  THEME: "chatTheme",
};

export const SOCKET_EVENTS = {
  // Client -> Server
  AUTHENTICATE: "authenticate",
  JOIN_ROOM: "join_room",
  SEND_MESSAGE: "send_message",
  TYPING: "typing",

  // Server -> Client
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  AUTHENTICATED: "authenticated",
  AUTH_ERROR: "auth_error",
  MESSAGE_HISTORY: "message_history",
  NEW_MESSAGE: "new_message",
  PRIVATE_MESSAGE: "private_message",
  USER_JOINED: "user_joined",
  USER_LEFT: "user_left",
  ROOM_CHANGED: "room_changed",
  ROOMS_UPDATE: "rooms_update",
  USER_TYPING: "user_typing",
  UNREAD_COUNT_UPDATE: "unread_count_update",
  RECONNECT: "reconnect",
};

export const TYPING_TIMEOUT = 3000;
export const MESSAGE_LIMIT = 100;
export const SYSTEM_MESSAGES_LIMIT = 10;

export const COLOR_OPTIONS = [
  { value: "black", label: "Чёрный", hex: "#000000" },
  { value: "blue", label: "Синий", hex: "#0d6efd" },
  { value: "green", label: "Зелёный", hex: "#198754" },
  { value: "purple", label: "Фиолетовый", hex: "#6f42c1" },
  { value: "orange", label: "Оранжевый", hex: "#fd7e14" },
];

export const GENDER_OPTIONS = [
  { value: "male", label: "Мужской", icon: "bi-gender-male" },
  { value: "female", label: "Женский", icon: "bi-gender-female" },
  { value: "unknown", label: "Неизвестно", icon: "bi-gender-ambiguous" },
];

export const DEFAULT_ROOM = "главная";
export const DEFAULT_COLOR = "black";
export const DEFAULT_GENDER = "male";
