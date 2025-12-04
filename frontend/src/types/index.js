// frontend/src/types/index.js

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} nickname - User nickname
 * @property {string} email - User email
 * @property {string} messageColor - Message color
 * @property {string} gender - User gender
 */

/**
 * @typedef {Object} Message
 * @property {string} id - Message ID
 * @property {string} userId - User ID
 * @property {string} nickname - User nickname
 * @property {string} messageColor - Message color
 * @property {string} text - Message text
 * @property {string} room - Room name
 * @property {string} [toUserId] - Recipient user ID (for private messages)
 * @property {string} [toNickname] - Recipient nickname
 * @property {Date} timestamp - Message timestamp
 */

/**
 * @typedef {Object} Room
 * @property {string} name - Room name
 * @property {string} displayName - Room display name
 * @property {string} description - Room description
 * @property {number} userCount - Number of users in room
 * @property {Array<User>} users - Users in room
 */

/**
 * @typedef {Object} Conversation
 * @property {string} userId - User ID
 * @property {string} nickname - User nickname
 * @property {string} lastMessage - Last message text
 * @property {Date} lastMessageTime - Last message timestamp
 * @property {number} unreadCount - Number of unread messages
 * @property {boolean} lastMessageFromMe - Whether last message is from current user
 */

/**
 * @typedef {Object} SystemMessage
 * @property {string} userId - User ID
 * @property {string} nickname - User nickname
 * @property {string} messageColor - Message color
 * @property {string} gender - User gender
 * @property {string} message - System message text
 * @property {Date} timestamp - Message timestamp
 */

export {};
