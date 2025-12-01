import { useEffect } from 'react';
import * as bootstrap from 'bootstrap';

function RoomsList({ rooms, currentRoom, onRoomChange }) {
    useEffect(() => {
        // Инициализация tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltips = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));

        return () => {
            tooltips.forEach(tooltip => tooltip.dispose());
        };
    }, [rooms]);

    return (
        <div className="chat-sidebar">
            <div className="p-3 border-bottom border-secondary">
                <h5 className="mb-0">
                    <i className="bi bi-door-open me-2"></i>
                    Комнаты
                </h5>
                <small className="text-muted">{rooms.length} доступно</small>
            </div>

            <div className="rooms-list">
                {rooms.length > 0 ? (
                    rooms.map((room) => (
                        <div
                            key={room.name}
                            className={`room-item p-3 ${currentRoom === room.name ? 'active bg-primary' : ''}`}
                            onClick={() => onRoomChange(room.name)}
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title={room.description || room.displayName}
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="flex-grow-1">
                                    <div className="fw-bold">
                                        <i className="bi bi-hash me-1"></i>
                                        {room.displayName || room.name}
                                    </div>
                                    <small className="text-muted">
                                        <i className="bi bi-people-fill me-1"></i>
                                        {room.userCount || 0} {room.userCount === 1 ? 'пользователь' : 'пользователей'}
                                    </small>
                                </div>
                                {currentRoom === room.name && (
                                    <i className="bi bi-check-circle-fill text-white"></i>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-3 text-center text-muted">
                        <div className="spinner-border spinner-border-sm mb-2" role="status">
                            <span className="visually-hidden">Загрузка...</span>
                        </div>
                        <div>Загрузка комнат...</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RoomsList;