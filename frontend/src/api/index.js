// frontend/src/api/index.js - Единая точка экспорта
export { authEndpoints } from "./endpoints/auth";
export { messagesEndpoints } from "./endpoints/messages";
export { usersEndpoints } from "./endpoints/users";
export { roomsEndpoints } from "./endpoints/rooms";
export { default as apiClient } from "./client";
