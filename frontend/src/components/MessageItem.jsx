import { memo } from 'react';
import { getColorHex } from '../utils/colors';

const MessageItem = memo(function MessageItem({ message, isOwnMessage, onUserClick, onTimeClick }) {
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Цвет никнейма: мой - красный, остальные - чёрный
    const nicknameColor = isOwnMessage ? '#dc3545' : '#000000';

    // Цвет текста сообщения: выбранный цвет пользователя
    const messageTextColor = getColorHex(message.messageColor || 'black');

    return (
        <ul className="list-unstyled mb-0">
            <li>
                <div className="message-row mb-2">
                    <div className="conversation-list">
                        {/* Время (кликабельное) */}
                        <span
                            className="message-time text-muted me-2"
                            onClick={() => onTimeClick(message.timestamp)}
                            title="Кликните, чтобы вставить время"
                            style={{
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                minWidth: '45px'
                            }}
                        >
                            {formatTime(message.timestamp)}
                        </span>

                        {/* Никнейм (кликабельный если не мой) */}
                        <span
                            className={`message-nickname fw-bold me-2 ${!isOwnMessage ? 'clickable-nickname' : 'my-nickname'}`}
                            onClick={() => {
                                if (!isOwnMessage) {
                                    onUserClick({ userId: message.userId, nickname: message.nickname });
                                }
                            }}
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

                        {/* Адресат (если есть) */}
                        {message.toNickname && (
                            <span
                                className="me-2"
                                style={{
                                    fontSize: '0.9rem',
                                    color: '#000000' // Адресат всегда чёрным
                                }}
                                title={`Ответ для ${message.toNickname}`}
                            >
                                <i className="bi bi-arrow-right-short"></i>
                                @{message.toNickname}
                            </span>
                        )}

                        {/* Текст сообщения */}
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
    // Сравнение пропсов для оптимизации
    return (
        prevProps.message.id === nextProps.message.id &&
        prevProps.isOwnMessage === nextProps.isOwnMessage
    );
});

export default MessageItem;