// frontend/src/types/propTypes.js
import PropTypes from "prop-types";

// User PropTypes
export const UserPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  email: PropTypes.string,
  messageColor: PropTypes.oneOf(["black", "blue", "green", "purple", "orange"]),
  gender: PropTypes.oneOf(["male", "female", "unknown"]),
});

// Message PropTypes
export const MessagePropType = PropTypes.shape({
  id: PropTypes.string,
  _id: PropTypes.string,
  userId: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  messageColor: PropTypes.string,
  text: PropTypes.string.isRequired,
  room: PropTypes.string,
  toUserId: PropTypes.string,
  toNickname: PropTypes.string,
  timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
});

// Room PropTypes
export const RoomPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  description: PropTypes.string,
  userCount: PropTypes.number,
  users: PropTypes.arrayOf(UserPropType),
});

// Conversation PropTypes
export const ConversationPropType = PropTypes.shape({
  userId: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  lastMessage: PropTypes.string,
  lastMessageTime: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  unreadCount: PropTypes.number,
  lastMessageFromMe: PropTypes.bool,
});

// System Message PropTypes
export const SystemMessagePropType = PropTypes.shape({
  userId: PropTypes.string,
  nickname: PropTypes.string.isRequired,
  messageColor: PropTypes.string,
  gender: PropTypes.string,
  message: PropTypes.string.isRequired,
  timestamp: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  isSystem: PropTypes.bool,
});
