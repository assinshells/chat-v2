import { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';

function MessagesArea({ messages, typing, user, onUserClick, onTimeClick }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="chat-conversation p-3 p-lg-4">


            {messages.length === 0 ? (
                <div className="text-center text-muted mt-5">
                    <i className="bi bi-chat-left-text" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                    <p className="mt-3">Сообщений пока нет. Начните общение!</p>
                </div>
            ) : (
                messages.map((msg) => (
                    <MessageItem
                        key={msg.id || msg._id}
                        message={msg}
                        isOwnMessage={msg.userId === user.id}
                        onUserClick={onUserClick}
                        onTimeClick={onTimeClick}
                    />
                ))
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