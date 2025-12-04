// frontend/src/pages/Chat/Chat.jsx - Упрощенная версия с контекстами
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { ChatContainer } from '../../containers/ChatContainer/ChatContainer';
import ChatLayout from '../../layouts/ChatLayout';
import Sidebar from '../../components/features/Sidebar/Sidebar';
import CombinedSidebar from '../../components/features/CombinedSidebar/CombinedSidebar';
import PrivateMessagesModal from '../../components/features/PrivateMessages/PrivateMessagesModal';
import { useRooms } from '../../hooks/api/useRooms';
import { useMessages } from '../../hooks/api/useMessages';
import storageService from '../../services/storage.service';
import { DEFAULT_ROOM } from '../../constants/config';

function Chat() {
    const { user, logout, updateUser } = useAuthContext();
    const { success, error } = useNotifications();
    const { rooms, loadRooms } = useRooms();
    const { unreadCount, loadUnreadCount } = useMessages();

    const [currentRoom, setCurrentRoom] = useState(() =>
        storageService.getRoom() || DEFAULT_ROOM
    );
    const [showPrivateMessages, setShowPrivateMessages] = useState(false);
    const [privateMessageUser, setPrivateMessageUser] = useState(null);

    useEffect(() => {
        loadRooms();
        loadUnreadCount();
    }, [loadRooms, loadUnreadCount]);

    const handleRoomChange = useCallback((roomName) => {
        if (roomName !== currentRoom) {
            setCurrentRoom(roomName);
            storageService.setRoom(roomName);
            success(`Переключились в комнату: ${roomName}`);
        }
    }, [currentRoom, success]);

    const handleOpenPrivateMessage = useCallback((targetUser) => {
        setPrivateMessageUser(targetUser);
        setShowPrivateMessages(true);
    }, []);

    const handleColorChange = useCallback((updatedUser) => {
        updateUser(updatedUser);
        success('Цвет сообщений обновлен');
    }, [updateUser, success]);

    const handleGenderChange = useCallback((updatedUser) => {
        updateUser(updatedUser);
        success('Пол обновлен');
    }, [updateUser, success]);

    const getCurrentRoomUsers = useCallback(() => {
        const room = rooms.find(r => r.name === currentRoom);
        return room?.users || [];
    }, [rooms, currentRoom]);

    return (
        <ChatLayout
            sidebar={
                <Sidebar
                    user={user}
                    onLogout={logout}
                    unreadCount={unreadCount}
                    onOpenPrivateMessages={() => setShowPrivateMessages(true)}
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
                />
            }
        >
            <ChatContainer
                user={user}
                currentRoom={currentRoom}
                onRoomChange={handleRoomChange}
                onOpenPrivateMessage={handleOpenPrivateMessage}
                onLogout={logout}
                onUnreadUpdate={loadUnreadCount}
            />

            {showPrivateMessages && (
                <PrivateMessagesModal
                    show={showPrivateMessages}
                    onHide={() => setShowPrivateMessages(false)}
                    user={user}
                    initialUser={privateMessageUser}
                />
            )}
        </ChatLayout>
    );
}

export default Chat;