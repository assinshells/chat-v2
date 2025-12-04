// frontend/src/components/ui/MessageItem.jsx
import { memo, useMemo } from 'react';
import { getColorHex } from '../../utils/colors';
import { formatTime } from '../../utils/formatters';

const MessageItem = memo(function MessageItem({
    message,
    isOwnMessage,
    onUserClick,
    onTimeClick
}) {
    const nicknameColor = useMemo(() =>
        isOwnMessage ? '#dc3545' : '#000000',
        [isOwnMessage]
    );

    const messageTextColor = useMemo(() =>
        getColorHex(message.messageColor || 'black'),
        [message.messageColor]
    );

    const formattedTime = useMemo(() =>
        formatTime(message.timestamp),
        [message.timestamp]
    );

    const handleUserClick = useMemo(() => {
        if (isOwnMessage) return undefined;
        return () => onUserClick({
            userId: message.userId,
            nickname: message.nickname
        });
    }, [isOwnMessage, message.userId, message.nickname, onUserClick]);

    const handleTimeClick = useMemo(() =>
        () => onTimeClick(message.timestamp),
        [message.timestamp, onTimeClick]
    );

    return (
        <ul className="list-unstyled mb-0">
            <li>
                <div className="message-row mb-2">
                    <div className="conversation-list">
                        <span
                            className="message-time text-muted me-2"
                            onClick={handleTimeClick}
                            title="Кликните, чтобы вставить время"
                            style={{
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                minWidth: '45px'
                            }}
                        >
                            {formattedTime}
                        </span>

                        <span
                            className={`message-nickname fw-bold me-2 ${!isOwnMessage ? 'clickable-nickname' : 'my-nickname'}`}
                            onClick={handleUserClick}
                            title={!isOwnMessage ? 'Кликните, чтобы ответить' : 'Вы'}
                            style={{
                                cursor: !isOwnMessage ? 'pointer' : 'default',
                                color: nicknameColor,
                                fontSize: '0.95rem'
                            }}
                        >
                            {message.nickname}
                            {isOwnMessage && ' (я)'}:
                        </span>

                        {message.toNickname && (
                            <span
                                className="me-2"
                                style={{
                                    fontSize: '0.9rem',
                                    color: '#000000'
                                }}
                                title={`Ответ для ${message.toNickname}`}
                            >
                                <i className="bi bi-arrow-right-short"></i>
                                @{message.toNickname}
                            </span>
                        )}

                        <span
                            className="message-text"
                            style={{
                                fontSize: '0.95rem',
                                color: messageTextColor
                            }}
                        >
                            {message.text}
                        </span>
                    </div>
                </div>
            </li>
        </ul>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.message.id === nextProps.message.id &&
        prevProps.isOwnMessage === nextProps.isOwnMessage
    );
});

export default MessageItem;