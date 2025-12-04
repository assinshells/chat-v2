// frontend/src/utils/typeGuards.js - Type guards для runtime проверок
export const isValidUser = (user) => {
  return (
    user &&
    typeof user === "object" &&
    typeof user.id === "string" &&
    typeof user.nickname === "string"
  );
};

export const isValidMessage = (message) => {
  return (
    message &&
    typeof message === "object" &&
    typeof message.text === "string" &&
    typeof message.nickname === "string" &&
    (message.timestamp instanceof Date || typeof message.timestamp === "string")
  );
};

export const isValidRoom = (room) => {
  return (
    room &&
    typeof room === "object" &&
    typeof room.name === "string" &&
    typeof room.displayName === "string"
  );
};
