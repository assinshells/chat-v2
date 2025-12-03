import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Chat({ setAuth }) {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [user, setUser] = useState(null);
    const [connected, setConnected] = useState(false);
    const [typing, setTyping] = useState(null);
    const [currentRoom, setCurrentRoom] = useState('главная');
    const [rooms, setRooms] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showPrivateMessages, setShowPrivateMessages] = useState(false);
    const [privateMessageUser, setPrivateMessageUser] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [systemMessages, setSystemMessages] = useState([]);

    const socketRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const messageIdsRef = useRef(new Set()); // Отслеживание ID сообщений
    const navigate = useNavigate();

    // Мемоизированная загрузка непрочитанных
    const loadUnreadCount = useCallback(async () => {
        try {
            const token = localStorage.getItem('chatToken');
            if (!token) return;

            const response = await axios.get(`${API_URL}/api/unread-count`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Ошибка загрузки счетчика:', error);
        }
    }, []);

    // Выход из системы
    const handleLogout = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        localStorage.removeItem('chatToken');
        localStorage.removeItem('chatUser');
        localStorage.removeItem('selectedRoom');
        setAuth(false);
        navigate('/login');
    }, [setAuth, navigate]);

    // Инициализация пользователя и комнат
    useEffect(() => {
        const storedUser = localStorage.getItem('chatUser');
        const token = localStorage.getItem('chatToken');
        const selectedRoom = localStorage.getItem('selectedRoom') || 'главная';

        if (!storedUser || !token) {
            handleLogout();
            return;
        }

        setUser(JSON.parse(storedUser));
        setCurrentRoom(selectedRoom);
        loadUnreadCount();

        // Загрузка списка комнат
        const fetchRooms = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/rooms`);
                setRooms(response.data.map(room => ({
                    ...room,
                    userCount: 0,
                    users: []
                })));
            } catch (error) {
                console.error('Ошибка загрузки комнат:', error);
            }
        };

        fetchRooms();
    }, [handleLogout, loadUnreadCount]);

    // Socket.IO подключение
    useEffect(() => {
        const token = localStorage.getItem('chatToken');
        if (!token || !user) return;

        // Предотвращение повторного подключения
        if (socketRef.current?.connected) return;

        console.log('🔌 Подключение к Socket.IO...');
        const socket = io(WS_URL, {
            transports: ['websocket', 'polling'],
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('✅ Подключено к серверу');
            setConnected(true);
            socket.emit('authenticate', { token, room: currentRoom });
        });

        socket.on('authenticated', (data) => {
            console.log('✅ Авторизован в комнате:', data.room);
            setCurrentRoom(data.room);
        });

        socket.on('auth_error', (error) => {
            console.error('❌ Ошибка авторизации:', error);
            handleLogout();
        });

        socket.on('message_history', (history) => {
            console.log('📜 История сообщений:', history.length);
            messageIdsRef.current.clear(); // Сброс кэша ID
            setMessages(history);
            history.forEach(msg => {
                if (msg.id || msg._id) {
                    messageIdsRef.current.add(msg.id || msg._id);
                }
            });
        });

        socket.on('new_message', (message) => {
            const messageId = message.id || message._id;

            // Предотвращение дублирования
            if (messageId && messageIdsRef.current.has(messageId)) {
                console.warn('⚠️ Дублирующееся сообщение:', messageId);
                return;
            }

            console.log('📨 Новое сообщение:', message);
            setMessages(prev => [...prev, message]);

            if (messageId) {
                messageIdsRef.current.add(messageId);
            }
        });

        socket.on('user_joined', (data) => {
            console.log('👋 Пользователь присоединился:', data.nickname);
            setSystemMessages(prev => [...prev.slice(-9), {
                ...data,
                timestamp: Date.now(),
                userId: data.userId || null
            }]);
        });

        socket.on('user_left', (data) => {
            console.log('👋 Пользователь вышел:', data.nickname);
            setSystemMessages(prev => [...prev.slice(-9), {
                ...data,
                timestamp: Date.now(),
                userId: data.userId || null
            }]);
        });

        socket.on('room_changed', (data) => {
            console.log('🚪 Смена комнаты:', data.room);
            messageIdsRef.current.clear(); // Сброс кэша при смене комнаты
            setCurrentRoom(data.room);
            setMessages(data.messages);
            setSelectedUser(null);
            setSystemMessages([]);
            localStorage.setItem('selectedRoom', data.room);

            // Заполняем кэш ID из истории
            data.messages.forEach(msg => {
                if (msg.id || msg._id) {
                    messageIdsRef.current.add(msg.id || msg._id);
                }
            });
        });

        socket.on('rooms_update', (roomsData) => {
            if (roomsData?.length > 0) {
                setRooms(roomsData);
            }
        });

        socket.on('user_typing', (data) => {
            if (data.room === currentRoom) {
                setTyping(data.nickname);

                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }

                typingTimeoutRef.current = setTimeout(() => {
                    setTyping(null);
                }, 3000);
            }
        });

        socket.on('private_message', () => {
            loadUnreadCount();
        });

        socket.on('unread_count_update', () => {
            loadUnreadCount();
        });

        socket.on('disconnect', (reason) => {
            console.log('❌ Отключено от сервера:', reason);
            setConnected(false);
        });

        socket.on('reconnect', (attemptNumber) => {
            console.log('🔄 Переподключение успешно, попытка:', attemptNumber);
            socket.emit('authenticate', { token, room: currentRoom });
        });

        // Очистка при размонтировании
        return () => {
            console.log('🧹 Очистка Socket.IO');
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            socket.off('connect');
            socket.off('authenticated');
            socket.off('auth_error');
            socket.off('message_history');
            socket.off('new_message');
            socket.off('user_joined');
            socket.off('user_left');
            socket.off('room_changed');
            socket.off('rooms_update');
            socket.off('user_typing');
            socket.off('private_message');
            socket.off('unread_count_update');
            socket.off('disconnect');
            socket.off('reconnect');
            socket.disconnect();
            socketRef.current = null;
        };
    }, [user, currentRoom, handleLogout, loadUnreadCount]);

    const handleSendMessage = useCallback((e) => {
        e.preventDefault();

        if (!inputMessage.trim() || !socketRef.current?.connected) {
            return;
        }

        const messageData = {
            text: selectedUser
                ? `@${selectedUser.nickname} ${inputMessage.trim()}`
                : inputMessage.trim()
        };

        socketRef.current.emit('send_message', messageData);
        setInputMessage('');
        setSelectedUser(null);
    }, [inputMessage, selectedUser]);

    const handleInputChange = useCallback((e) => {
        setInputMessage(e.target.value);

        if (socketRef.current?.connected && e.target.value.trim()) {
            socketRef.current.emit('typing');
        }
    }, []);

    const handleRoomChange = useCallback((roomName) => {
        if (socketRef.current?.connected && roomName !== currentRoom) {
            socketRef.current.emit('join_room', roomName);
        }
    }, [currentRoom]);

    const handleUserClick = useCallback((u) => {
        if (u.userId === user?.id) return;
        setSelectedUser({
            userId: u.userId,
            nickname: u.nickname
        });
    }, [user]);

    const handleOpenPrivateMessage = useCallback((targetUser) => {
        setPrivateMessageUser(targetUser);
        setShowPrivateMessages(true);
        setSelectedUser(null);
    }, []);

    const handleTimeClick = useCallback((timestamp) => {
        const date = new Date(timestamp);
        const timeStr = date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
        setInputMessage(prev => prev ? `${prev} ${timeStr}` : timeStr);
    }, []);

    const handleColorChange = useCallback((updatedUser) => {
        setUser(updatedUser);
    }, []);

    const handleGenderChange = useCallback((updatedUser) => {
        setUser(updatedUser);
    }, []);

    const handleOpenPrivateMessages = useCallback(() => {
        setPrivateMessageUser(null);
        setShowPrivateMessages(true);
    }, []);

    const handleClosePrivateMessages = useCallback(() => {
        setShowPrivateMessages(false);
        setPrivateMessageUser(null);
        loadUnreadCount();
    }, [loadUnreadCount]);

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
        <>
            <div className="layout-wrapper d-lg-flex">
                <Sidebar
                    user={user}
                    onLogout={handleLogout}
                    unreadCount={unreadCount}
                    onOpenPrivateMessages={handleOpenPrivateMessages}
                    onColorChange={handleColorChange}
                    onGenderChange={handleGenderChange}
                />

                <div className="user-chat w-100 overflow-hidden">
                    <ChatHeader
                        currentRoom={currentRoom}
                        connected={connected}
                        onlineCount={getCurrentRoomUsers().length}
                        user={user}
                    />

                    <div className="d-flex flex-grow-1" style={{ overflow: 'hidden' }}>
                        <MessagesArea
                            messages={messages}
                            typing={typing}
                            user={user}
                            onUserClick={handleUserClick}
                            onTimeClick={handleTimeClick}
                            systemMessages={systemMessages}
                        />
                    </div>

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
                </div>

                <CombinedSidebar
                    rooms={rooms}
                    currentRoom={currentRoom}
                    onRoomChange={handleRoomChange}
                    users={getCurrentRoomUsers()}
                    currentUser={user}
                    onUserClick={handleUserClick}
                />
            </div>

            {showPrivateMessages && (
                <PrivateMessagesModal
                    show={showPrivateMessages}
                    onHide={handleClosePrivateMessages}
                    socket={socketRef.current}
                    user={user}
                    initialUser={privateMessageUser}
                />
            )}
        </>
    );
}

export default Chat;