import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function PrivateMessagesModal({ show, onHide, socket, user, initialUser }) {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalUnread, setTotalUnread] = useState(0);

    const messagesEndRef = useRef(null);
    const messageIdsRef = useRef(new Set()); // Кэш ID сообщений
    const isLoadingRef = useRef(false); // Флаг загрузки

    // Загрузка списка диалогов
    const loadConversations = useCallback(async () => {
        try {
            const token = localStorage.getItem('chatToken');
            if (!token) return;

            const response = await axios.get(`${API_URL}/api/conversations`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setConversations(response.data);
            const total = response.data.reduce((sum, conv) => sum + conv.unreadCount, 0);
            setTotalUnread(total);
        } catch (error) {
            console.error('Ошибка загрузки диалогов:', error);
        }
    }, []);

    // Загрузка сообщений с выбранным пользователем
    const loadMessages = useCallback(async (userId) => {
        if (isLoadingRef.current) {
            console.warn('⚠️ Загрузка уже выполняется');
            return;
        }

        try {
            isLoadingRef.current = true;
            setLoading(true);

            const token = localStorage.getItem('chatToken');
            const response = await axios.get(`${API_URL}/api/private-messages/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('📨 Загружено сообщений:', response.data.length);

            // Сброс кэша и установка новых сообщений
            messageIdsRef.current.clear();
            setMessages(response.data);

            // Заполнение кэша ID
            response.data.forEach(msg => {
                const msgId = msg.id || msg._id;
                if (msgId) messageIdsRef.current.add(msgId);
            });

            // Отмечаем как прочитанные
            await axios.post(`${API_URL}/api/private-messages/mark-read/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Обновляем список диалогов
            await loadConversations();
        } catch (error) {
            console.error('Ошибка загрузки сообщений:', error);
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
        }
    }, [loadConversations]);

    // Выбор диалога
    const handleSelectConversation = useCallback((conversation) => {
        setSelectedConversation(conversation);
        loadMessages(conversation.userId);
    }, [loadMessages]);

    // Отправка сообщения
    const handleSendMessage = useCallback((e) => {
        e.preventDefault();

        if (!inputMessage.trim() || !socket || !selectedConversation) {
            return;
        }

        socket.emit('send_message', {
            text: inputMessage.trim(),
            toUserId: selectedConversation.userId,
            toNickname: selectedConversation.nickname
        });

        setInputMessage('');
    }, [inputMessage, socket, selectedConversation]);

    // Прокрутка к последнему сообщению
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    // Автоматический выбор диалога при передаче initialUser
    useEffect(() => {
        if (!show) return;

        loadConversations();

        if (initialUser) {
            console.log('🎯 Открытие диалога с пользователем:', initialUser);

            const timer = setTimeout(() => {
                setSelectedConversation({
                    userId: initialUser.userId,
                    nickname: initialUser.nickname,
                    unreadCount: 0
                });
                loadMessages(initialUser.userId);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [show, initialUser, loadConversations, loadMessages]);

    // Обработка входящих сообщений через Socket.IO
    useEffect(() => {
        if (!socket) return;

        const handlePrivateMessage = (message) => {
            console.log('📩 Получено приватное сообщение:', message);

            const messageId = message.id || message._id;

            // Предотвращение дублирования
            if (messageId && messageIdsRef.current.has(messageId)) {
                console.warn('⚠️ Дублирующееся сообщение:', messageId);
                return;
            }

            // Если это сообщение для текущего диалога
            if (selectedConversation) {
                const isRelevant =
                    message.fromUserId === selectedConversation.userId ||
                    message.toUserId === selectedConversation.userId ||
                    (message.fromUserId === user.id && message.toUserId === selectedConversation.userId);

                if (isRelevant) {
                    console.log('✅ Сообщение относится к текущему диалогу');
                    setMessages(prev => [...prev, message]);

                    if (messageId) {
                        messageIdsRef.current.add(messageId);
                    }

                    scrollToBottom();

                    // Отмечаем как прочитанное, если сообщение не от нас
                    if (message.fromUserId === selectedConversation.userId) {
                        const token = localStorage.getItem('chatToken');
                        axios.post(`${API_URL}/api/private-messages/mark-read/${selectedConversation.userId}`, {}, {
                            headers: { Authorization: `Bearer ${token}` }
                        }).catch(err => console.error('Ошибка отметки прочитанного:', err));
                    }
                }
            }

            // Обновляем список диалогов
            loadConversations();
        };

        const handleUnreadUpdate = () => {
            console.log('🔔 Обновление счетчика непрочитанных');
            loadConversations();
        };

        socket.on('private_message', handlePrivateMessage);
        socket.on('unread_count_update', handleUnreadUpdate);

        return () => {
            socket.off('private_message', handlePrivateMessage);
            socket.off('unread_count_update', handleUnreadUpdate);
        };
    }, [socket, selectedConversation, user, loadConversations, scrollToBottom]);

    // Автопрокрутка при изменении сообщений
    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Сегодня';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Вчера';
        } else {
            return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: '900px' }}>
                <div className="modal-content" style={{ height: '600px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-chat-dots me-2"></i>
                            Личные сообщения
                            {totalUnread > 0 && (
                                <span className="badge bg-danger ms-2">{totalUnread}</span>
                            )}
                        </h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>

                    <div className="modal-body p-0" style={{ height: 'calc(100% - 60px)' }}>
                        <div className="row g-0 h-100">
                            {/* Список диалогов */}
                            <div className="col-4 border-end" style={{ height: '100%', overflowY: 'auto' }}>
                                {conversations.length === 0 ? (
                                    <div className="text-center text-muted p-4">
                                        <i className="bi bi-chat-left-text" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                                        <p className="mt-3">Нет диалогов</p>
                                        <small>Начните общение с пользователем из чата</small>
                                    </div>
                                ) : (
                                    conversations.map(conv => (
                                        <div
                                            key={conv.userId}
                                            className={`p-3 border-bottom ${selectedConversation?.userId === conv.userId ? 'bg-primary bg-opacity-10' : ''}`}
                                            onClick={() => handleSelectConversation(conv)}
                                            style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                                            onMouseEnter={(e) => {
                                                if (selectedConversation?.userId !== conv.userId) {
                                                    e.currentTarget.style.backgroundColor = 'var(--bs-light)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedConversation?.userId !== conv.userId) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                }
                                            }}
                                        >
                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                <strong className="text-truncate" style={{ maxWidth: '150px' }}>
                                                    {conv.nickname}
                                                </strong>
                                                {conv.unreadCount > 0 && (
                                                    <span className="badge bg-danger rounded-pill">{conv.unreadCount}</span>
                                                )}
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <small className="text-muted text-truncate" style={{ maxWidth: '180px' }}>
                                                    {conv.lastMessageFromMe && <i className="bi bi-check2-all me-1"></i>}
                                                    {conv.lastMessage}
                                                </small>
                                                <small className="text-muted ms-2">
                                                    {formatTime(conv.lastMessageTime)}
                                                </small>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Окно сообщений */}
                            <div className="col-8 d-flex flex-column" style={{ height: '100%' }}>
                                {selectedConversation ? (
                                    <>
                                        <div className="p-3 border-bottom">
                                            <h6 className="mb-0">
                                                <i className="bi bi-person-circle me-2"></i>
                                                {selectedConversation.nickname}
                                            </h6>
                                        </div>

                                        <div className="flex-grow-1 p-3" style={{ overflowY: 'auto', maxHeight: 'calc(100% - 140px)' }}>
                                            {loading ? (
                                                <div className="text-center mt-5">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Загрузка...</span>
                                                    </div>
                                                </div>
                                            ) : messages.length === 0 ? (
                                                <div className="text-center text-muted mt-5">
                                                    <i className="bi bi-chat-left-text" style={{ fontSize: '2rem', opacity: 0.3 }}></i>
                                                    <p className="mt-3">Начните общение!</p>
                                                </div>
                                            ) : (
                                                messages.map((msg, index) => {
                                                    const isMyMessage = msg.fromUserId === user.id;
                                                    const showDate = index === 0 ||
                                                        new Date(messages[index - 1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString();

                                                    return (
                                                        <div key={msg.id || msg._id || `msg-${index}`}>
                                                            {showDate && (
                                                                <div className="text-center text-muted my-3">
                                                                    <small>{formatDate(msg.timestamp)}</small>
                                                                </div>
                                                            )}
                                                            <div className={`mb-3 d-flex ${isMyMessage ? 'justify-content-end' : 'justify-content-start'}`}>
                                                                <div style={{ maxWidth: '70%' }}>
                                                                    <div className={`p-2 rounded ${isMyMessage ? 'bg-primary text-white' : 'bg-light'}`}>
                                                                        <div className="mb-1">{msg.text}</div>
                                                                        <div className={`d-flex align-items-center justify-content-between ${isMyMessage ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>
                                                                            <span>{formatTime(msg.timestamp)}</span>
                                                                            {isMyMessage && (
                                                                                <i className={`bi bi-check2-all ms-2 ${msg.read ? 'text-white' : ''}`}></i>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>

                                        <div className="p-3 border-top">
                                            <form onSubmit={handleSendMessage}>
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder={`Сообщение для ${selectedConversation.nickname}...`}
                                                        value={inputMessage}
                                                        onChange={(e) => setInputMessage(e.target.value)}
                                                        autoComplete="off"
                                                    />
                                                    <button
                                                        className="btn btn-primary"
                                                        type="submit"
                                                        disabled={!inputMessage.trim()}
                                                    >
                                                        <i className="bi bi-send-fill"></i>
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </>
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                        <div className="text-center">
                                            <i className="bi bi-chat-left-text" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                                            <p className="mt-3">Выберите диалог или начните новый</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrivateMessagesModal;