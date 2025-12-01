import { useEffect } from 'react';
import * as bootstrap from 'bootstrap';

function MessageItem({ message, isOwnMessage, onUserClick, onTimeClick }) {
    useEffect(() => {
        // Инициализация tooltips для сообщения
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltips = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));

        return () => {
            tooltips.forEach(tooltip => tooltip.dispose());
        };
    }, []);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <ul className="list-unstyled mb-0">
            <li>
                <div className="message-row mb-2">
                    <div className="conversation-list">
                        {/* Время (кликабельное) */}
                        <span
                            className="message-time text-muted me-2"
                            onClick={() => onTimeClick(message.timestamp)}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
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
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title={!isOwnMessage ? 'Кликните, чтобы ответить' : 'Вы'}
                            style={{
                                cursor: !isOwnMessage ? 'pointer' : 'default',
                                color: isOwnMessage ? '#0d6efd' : '#6c757d',
                                fontSize: '0.95rem'
                            }}
                        >
                            {message.nickname}
                            {isOwnMessage && ' (я)'}:
                        </span>

                        {/* Адресат (если есть) */}
                        {message.toNickname && (
                            <span
                                className="text-primary me-2"
                                style={{ fontSize: '0.9rem' }}
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title={`Ответ для ${message.toNickname}`}
                            >
                                <i className="bi bi-arrow-right-short"></i>
                                @{message.toNickname}
                            </span>
                        )}

                        {/* Текст сообщения */}
                        <span className="message-text" style={{ fontSize: '0.95rem' }}>
                            {message.text}
                        </span>
                    </div>
                </div>
            </li>
        </ul>

    );
}

export default MessageItem;