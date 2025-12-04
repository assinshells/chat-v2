// frontend/src/types/constants.js - Type-safe константы
export const MESSAGE_COLORS = Object.freeze({
  BLACK: "black",
  BLUE: "blue",
  GREEN: "green",
  PURPLE: "purple",
  ORANGE: "orange",
});

export const GENDERS = Object.freeze({
  MALE: "male",
  FEMALE: "female",
  UNKNOWN: "unknown",
});

export const SOCKET_EVENTS = Object.freeze({
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
});
