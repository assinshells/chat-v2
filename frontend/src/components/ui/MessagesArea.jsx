// frontend/src/components/ui/MessagesArea.jsx
import { useRef, useEffect, useMemo, memo } from 'react';
import MessageItem from './MessageItem';
import SystemMessage from './SystemMessage';

const MessagesArea = memo(function MessagesArea({
    messages,
    typing,
    user,
    onUserClick,
    onTimeClick,
    systemMessages
}) {
    const messagesEndRef = useRef(null);

    // Combine and sort messages
    const allMessages = useMemo(() => {
        const combined = [...messages];

        if (systemMessages?.length > 0) {
            systemMessages.forEach(sysMsg => {
                combined.push({
                    ...sysMsg,
                    isSystem: true,
                    timestamp: sysMsg.timestamp || Date.now()
                });
            });
        }

        return combined.sort((a, b) =>
            new Date(a.timestamp) - new Date(b.timestamp)
        );
    }, [messages, systemMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [allMessages]);

    return (
        <div className="chat-conversation p-3 p-lg-4" style={{ overflowY: 'auto', flex: 1 }}>
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
                        <div
                            className="spinner-grow spinner-grow-sm me-2"
                            role="status"
                            style={{ width: '0.5rem', height: '0.5rem' }}
                        >
                            <span className="visually-hidden">Печатает...</span>
                        </div>
                        <em>{typing} печатает...</em>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
});

export default MessagesArea;