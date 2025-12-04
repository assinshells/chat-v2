import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { useChat } from '../../hooks/useChat';
import { usePrivateMessages } from '../../hooks/usePrivateMessages';
import { useRooms } from '../../hooks/useRooms';
import storageService from '../../services/storage.service';
import { DEFAULT_ROOM } from '../../constants/config';

import ChatLayout from '../../layouts/ChatLayout';
import Sidebar from '../../components/ui/Sidebar';
import ChatHeader from '../../components/ui/ChatHeader';
import MessagesArea from '../../components/ui/MessagesArea';
import ChatInput from '../../components/ui/ChatInput';
import CombinedSidebar from '../../components/ui/CombinedSidebar';
import PrivateMessagesModal from '../../components/ui/PrivateMessagesModal';

function Chat() {
    const [user, setUser] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(DEFAULT_ROOM);
    const [showPrivateMessages, setShowPrivateMessages] = useState(false);
    const [privateMessageUser, setPrivateMessageUser] = useState(null);

    const { logout } = useAuth();
    const { rooms, loadRooms } = useRooms();
    const { unreadCount, loadUnreadCount } = usePrivateMessages();

    // Socket connection
    const {
        connected,
        messages,
        typing,
        systemMessages,
        rooms: socketRooms,
        sendMessage,
        joinRoom,
        sendTyping,
    } = useSocket(user, currentRoom, logout, loadUnreadCount);

    // Chat interactions
    const {
        inputMessage,
        setInputMessage,
        selectedUser,
        setSelectedUser,
        handleSendMessage,
        handleInputChange,
        handleUserClick,
        handleTimeClick,
    } = useChat(user, sendMessage, sendTyping);

    // Initialize user and room
    useEffect(() => {
        const storedUser = storageService.getUser();
        const token = storageService.getToken();
        const selectedRoom = storageService.getRoom() || DEFAULT_ROOM;

        if (!storedUser || !token) {
            logout();
            return;
        }

        setUser(storedUser);
        setCurrentRoom(selectedRoom);
        loadUnreadCount();
        loadRooms();
    }, [logout, loadUnreadCount, loadRooms]);

    // Update rooms from socket
    useEffect(() => {
        if (socketRooms.length > 0) {
            loadRooms();
        }
    }, [socketRooms, loadRooms]);

    const handleRoomChange = useCallback((roomName) => {
        if (roomName !== currentRoom) {
            joinRoom(roomName);
            setCurrentRoom(roomName);
            storageService.setRoom(roomName);
        }
    }, [currentRoom, joinRoom]);

    const handleOpenPrivateMessage = useCallback((targetUser) => {
        setPrivateMessageUser(targetUser);
        setShowPrivateMessages(true);
        setSelectedUser(null);
    }, [setSelectedUser]);

    const handleOpenPrivateMessages = useCallback(() => {
        setPrivateMessageUser(null);
        setShowPrivateMessages(true);
    }, []);

    const handleClosePrivateMessages = useCallback(() => {
        setShowPrivateMessages(false);
        setPrivateMessageUser(null);
        loadUnreadCount();
    }, [loadUnreadCount]);

    const handleColorChange = useCallback((updatedUser) => {
        setUser(updatedUser);
        storageService.setUser(updatedUser);
    }, []);

    const handleGenderChange = useCallback((updatedUser) => {
        setUser(updatedUser);
        storageService.setUser(updatedUser);
    }, []);

    const getCurrentRoomUsers = useCallback(() => {
        const room = rooms.find(r => r.name === currentRoom);
        return room?.users || [];
    }, [rooms, currentRoom]);

    if (!user) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </div>
            </div>
        );
    }

    return (
        <ChatLayout
            sidebar={
                <Sidebar
                    user={user}
                    onLogout={logout}
                    unreadCount={unreadCount}
                    onOpenPrivateMessages={handleOpenPrivateMessages}
                    onColorChange={handleColorChange}
                    onGenderChange={handleGenderChange}
                />
            }
            rightSidebar={
                <CombinedSidebar
                    rooms={rooms}
                    currentRoom={currentRoom}
                    onRoomChange={handleRoomChange}
                    users={getCurrentRoomUsers()}
                    currentUser={user}
                    onUserClick={handleUserClick}
                />
            }
        >
            <ChatHeader
                currentRoom={currentRoom}
                connected={connected}
                onlineCount={getCurrentRoomUsers().length}
                user={user}
            />

            <MessagesArea
                messages={messages}
                typing={typing}
                user={user}
                onUserClick={handleUserClick}
                onTimeClick={handleTimeClick}
                systemMessages={systemMessages}
            />

            <ChatInput
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                connected={connected}
                currentRoom={currentRoom}
                onSendMessage={handleSendMessage}
                onInputChange={handleInputChange}
                onOpenPrivateMessage={handleOpenPrivateMessage}
            />

            {showPrivateMessages && (
                <PrivateMessagesModal
                    show={showPrivateMessages}
                    onHide={handleClosePrivateMessages}
                    user={user}
                    initialUser={privateMessageUser}
                />
            )}
        </ChatLayout>
    );
}

export default Chat;