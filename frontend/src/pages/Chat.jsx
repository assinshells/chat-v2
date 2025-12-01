import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import * as bootstrap from 'bootstrap';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import MessagesArea from '../components/MessagesArea';
import ChatInput from '../components/ChatInput';
import RoomsList from '../components/RoomsList';
import UsersSidebar from '../components/UsersSidebar';
import '../assets/css/chat.css';

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

    const socketRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const navigate = useNavigate();

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

        // Загрузка списка комнат
        const fetchRooms = async () => {
            try {
                const response = await fetch(`${API_URL}/api/rooms`);
                const roomsData = await response.json();
                const roomsWithCounts = roomsData.map(room => ({
                    name: room.name,
                    displayName: room.displayName,
                    description: room.description,
                    userCount: 0,
                    users: []
                }));
                setRooms(roomsWithCounts);
            } catch (error) {
                console.error('Ошибка загрузки комнат:', error);
                setRooms([
                    { name: 'главная', displayName: 'Главная', userCount: 0, users: [] },
                    { name: 'знакомства', displayName: 'Знакомства', userCount: 0, users: [] },
                    { name: 'беспредел', displayName: 'Беспредел', userCount: 0, users: [] }
                ]);
            }
        };

        fetchRooms();

        // Подключение к Socket.io
        socketRef.current = io(WS_URL, {
            transports: ['websocket', 'polling']
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('✅ Подключено к серверу');
            setConnected(true);
            socket.emit('authenticate', { token, room: selectedRoom });
        });

        socket.on('authenticated', (data) => {
            console.log('✅ Авторизован в комнате:', data.room);
            setCurrentRoom(data.room);
        });

        socket.on('auth_error', (error) => {
            console.error('Ошибка авторизации:', error);
            handleLogout();
        });

        socket.on('message_history', (history) => {
            setMessages(history);
        });

        socket.on('new_message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        socket.on('room_changed', (data) => {
            setCurrentRoom(data.room);
            setMessages(data.messages);
            setSelectedUser(null);
        });

        socket.on('rooms_update', (roomsData) => {
            if (roomsData && roomsData.length > 0) {
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

        socket.on('disconnect', () => {
            console.log('❌ Отключено от сервера');
            setConnected(false);
        });

        // Инициализация всех tooltips
        const initTooltips = () => {
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
        };

        initTooltips();

        return () => {
            if (socket) {
                socket.disconnect();
            }
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!inputMessage.trim() || !socketRef.current || !connected) {
            return;
        }

        const messageData = {
            text: inputMessage.trim()
        };

        if (selectedUser) {
            messageData.toUserId = selectedUser.userId;
            messageData.toNickname = selectedUser.nickname;
        }

        socketRef.current.emit('send_message', messageData);
        setInputMessage('');
        setSelectedUser(null);
    };

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);

        if (socketRef.current && connected && e.target.value.trim()) {
            socketRef.current.emit('typing');
        }
    };

    const handleRoomChange = (roomName) => {
        if (socketRef.current && connected && roomName !== currentRoom) {
            socketRef.current.emit('join_room', roomName);
        }
    };

    const handleUserClick = (u) => {
        if (u.userId === user.id) return;
        setSelectedUser({
            userId: u.userId,
            nickname: u.nickname
        });
    };

    const handleTimeClick = (timestamp) => {
        const date = new Date(timestamp);
        const timeStr = date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
        setInputMessage(prev => prev ? `${prev} ${timeStr}` : timeStr);
    };

    const handleLogout = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        localStorage.removeItem('chatToken');
        localStorage.removeItem('chatUser');
        localStorage.removeItem('selectedRoom');
        setAuth(false);
        navigate('/login');
    };

    const getCurrentRoomUsers = () => {
        const room = rooms.find(r => r.name === currentRoom);
        return room ? room.users : [];
    };

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
        <div className="layout-wrapper d-lg-flex">
            <Sidebar user={user} onLogout={handleLogout} />
            <div className="user-chat w-100 overflow-hidden">
                <ChatHeader
                    currentRoom={currentRoom}
                    connected={connected}
                    onlineCount={getCurrentRoomUsers().length}
                    user={user}
                    onLogout={handleLogout}
                />

                <div className="d-flex flex-grow-1" style={{ overflow: 'hidden' }}>
                    <MessagesArea
                        messages={messages}
                        typing={typing}
                        user={user}
                        onUserClick={handleUserClick}
                        onTimeClick={handleTimeClick}
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
                />
            </div>
            {/* Список комнат */}
            <RoomsList
                rooms={rooms}
                currentRoom={currentRoom}
                onRoomChange={handleRoomChange}
            />
            {/* Список пользователей */}
            <UsersSidebar
                users={getCurrentRoomUsers()}
                currentUser={user}
                onUserClick={handleUserClick}
            />
        </div>
    );
}

export default Chat;