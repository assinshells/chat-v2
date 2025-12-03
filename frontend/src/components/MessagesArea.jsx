import { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import SystemMessage from './SystemMessage';

function MessagesArea({ messages, typing, user, onUserClick, onTimeClick, systemMessages }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages, systemMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Объединяем обычные сообщения и системные уведомления
    const allMessages = [...messages];
    if (systemMessages && systemMessages.length > 0) {
        systemMessages.forEach(sysMsg => {
            allMessages.push({
                ...sysMsg,
                isSystem: true,
                timestamp: sysMsg.timestamp || Date.now()
            });
        });
    }

    // Сортируем по времени
    allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return (
        <div className="chat-conversation p-3 p-lg-4">
            {allMessages.length === 0 ? (
                <div className="text-center text-muted mt-5">
                    <i className="bi bi-chat-left-text" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                    <p className="mt-3">Сообщений пока нет. Начните общение!</p>
                </div>
            ) : (
                allMessages.map((msg, index) => {
                    if (msg.isSystem) {
                        return (
                            <SystemMessage
                                key={`system-${index}-${msg.timestamp}`}
                                data={msg}
                                onUserClick={msg.userId !== user.id ? onUserClick : null}
                            />
                        );
                    }

                    return (
                        <MessageItem
                            key={msg.id || msg._id}
                            message={msg}
                            isOwnMessage={msg.userId === user.id}
                            onUserClick={onUserClick}
                            onTimeClick={onTimeClick}
                        />
                    );
                })
            )}

            {typing && (
                <div className="text-muted small mb-2">
                    <div className="d-flex align-items-center">
                        <div className="spinner-grow spinner-grow-sm me-2" role="status" style={{ width: '0.5rem', height: '0.5rem' }}>
                            <span className="visually-hidden">Печатает...</span>
                        </div>
                        <em>{typing} печатает...</em>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
}

export default MessagesArea;