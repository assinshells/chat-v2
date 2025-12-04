// frontend/src/containers/ChatContainer/ChatContainer.jsx
import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSocket } from '../../hooks/api/useSocket';
import { useChat } from '../../hooks/ui/useChat';
import ChatHeader from '../../components/features/Chat/ChatHeader';
import MessagesArea from '../../components/features/Chat/MessagesArea';
import ChatInput from '../../components/features/Chat/ChatInput';

export const ChatContainer = ({
    user,
    currentRoom,
    onRoomChange,
    onOpenPrivateMessage,
    onLogout,
    onUnreadUpdate,
}) => {
    const [selectedUser, setSelectedUser] = useState(null);

    // Socket connection
    const {
        connected,
        messages,
        typing,
        systemMessages,
        sendMessage,
        sendTyping,
    } = useSocket(user, currentRoom, onLogout, onUnreadUpdate);

    // Chat interactions
    const {
        inputMessage,
        setInputMessage,
        handleInputChange,
    } = useChat(user, sendMessage, sendTyping);

    // User click handler
    const handleUserClick = useCallback((clickedUser) => {
        if (clickedUser.userId === user?.id) return;

        setSelectedUser({
            userId: clickedUser.userId,
            nickname: clickedUser.nickname,
        });
    }, [user]);

    // Time click handler
    const handleTimeClick = useCallback((timestamp) => {
        const date = new Date(timestamp);
        const timeStr = date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        });
        setInputMessage((prev) => (prev ? `${prev} ${timeStr}` : timeStr));
    }, [setInputMessage]);

    // Clear selection
    const handleClearSelection = useCallback(() => {
        setSelectedUser(null);
    }, []);

    // Open private message
    const handleOpenPrivate = useCallback(() => {
        if (selectedUser) {
            onOpenPrivateMessage(selectedUser);
            setSelectedUser(null);
        }
    }, [selectedUser, onOpenPrivateMessage]);

    // Send message
    const handleSendMessage = useCallback((e) => {
        e.preventDefault();

        if (!inputMessage.trim()) return;

        const messageData = {
            text: selectedUser
                ? `@${selectedUser.nickname} ${inputMessage.trim()}`
                : inputMessage.trim(),
        };

        sendMessage(messageData);
        setInputMessage('');
        setSelectedUser(null);
    }, [inputMessage, selectedUser, sendMessage, setInputMessage]);

    // Combine messages
    const allMessages = useMemo(() => {
        const combined = [...messages];

        if (systemMessages?.length > 0) {
            systemMessages.forEach((sysMsg) => {
                combined.push({
                    ...sysMsg,
                    isSystem: true,
                    timestamp: sysMsg.timestamp || Date.now(),
                });
            });
        }

        return combined.sort((a, b) =>
            new Date(a.timestamp) - new Date(b.timestamp)
        );
    }, [messages, systemMessages]);

    return (
        <div className="chat-container d-flex flex-column h-100">
            <ChatHeader
                currentRoom={currentRoom}
                connected={connected}
                user={user}
            />

            <MessagesArea
                messages={allMessages}
                typing={typing}
                user={user}
                onUserClick={handleUserClick}
                onTimeClick={handleTimeClick}
            />

            <ChatInput
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                selectedUser={selectedUser}
                connected={connected}
                currentRoom={currentRoom}
                onSendMessage={handleSendMessage}
                onInputChange={handleInputChange}
                onClearSelection={handleClearSelection}
                onOpenPrivate={handleOpenPrivate}
            />
        </div>
    );
};

ChatContainer.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        nickname: PropTypes.string.isRequired,
        messageColor: PropTypes.string,
        gender: PropTypes.string,
    }).isRequired,
    currentRoom: PropTypes.string.isRequired,
    onRoomChange: PropTypes.func.isRequired,
    onOpenPrivateMessage: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onUnreadUpdate: PropTypes.func.isRequired,
};