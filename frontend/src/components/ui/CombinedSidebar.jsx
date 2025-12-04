// frontend/src/components/ui/CombinedSidebar.jsx
import { memo, useCallback, useMemo } from 'react';
import { getColorHex } from '../../utils/colors';
import { getGenderIcon } from '../../utils/formatters';

const CombinedSidebar = memo(function CombinedSidebar({
    rooms,
    currentRoom,
    onRoomChange,
    users,
    currentUser,
    onUserClick
}) {
    const handleRoomClick = useCallback((roomName) => {
        if (roomName !== currentRoom) {
            onRoomChange(roomName);
        }
    }, [currentRoom, onRoomChange]);

    const handleUserClick = useCallback((user) => {
        if (user.userId !== currentUser.id) {
            onUserClick(user);
        }
    }, [currentUser.id, onUserClick]);

    // Memoize sorted users
    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => {
            // Current user always first
            if (a.userId === currentUser.id) return -1;
            if (b.userId === currentUser.id) return 1;
            return a.nickname.localeCompare(b.nickname);
        });
    }, [users, currentUser.id]);

    return (
        <div
            className="combined-sidebar border-start d-none d-lg-flex flex-column"
            style={{ width: '280px', height: '100vh' }}
        >
            {/* Rooms Section - 30% */}
            <div
                className="rooms-section border-bottom"
                style={{ height: '30%', overflow: 'auto' }}
            >
                <div className="rooms-list">
                    {rooms.length > 0 ? (
                        rooms.map((room) => {
                            const isActive = currentRoom === room.name;

                            return (
                                <div
                                    key={room.name}
                                    className={`room-item p-3 ${isActive ? 'active' : ''}`}
                                    onClick={() => handleRoomClick(room.name)}
                                    title={room.description || room.displayName}
                                    style={{
                                        cursor: "pointer",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="flex-grow-1">
                                            <div className={`fw-bold ${isActive ? "text-white" : ""}`}>
                                                <i className="bi bi-hash me-1"></i>
                                                {room.displayName || room.name}
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center">
                                            <small
                                                className={isActive ? "text-white-50 me-2" : "text-muted me-2"}
                                            >
                                                {room.userCount || 0}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
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

            {/* Users Section - 70% */}
            <div
                className="users-section"
                style={{ height: '70%', overflow: 'auto' }}
            >
                <div className="p-3 border-bottom">
                    <h6 className="mb-0">
                        <i className="bi bi-people-fill me-2"></i>
                        Онлайн ({users.length})
                    </h6>
                </div>

                <div className="users-list p-3">
                    {sortedUsers.length > 0 ? (
                        sortedUsers.map((u) => {
                            const isCurrentUser = u.userId === currentUser.id;
                            const userColor = getColorHex(u.messageColor || 'black');

                            return (
                                <div
                                    key={u.socketId}
                                    className={`user-item d-flex align-items-center mb-2 p-2 rounded ${!isCurrentUser ? 'clickable-user' : ''}`}
                                    onClick={() => handleUserClick(u)}
                                    title={!isCurrentUser ? 'Кликните, чтобы отправить сообщение' : ''}
                                    style={{
                                        cursor: !isCurrentUser ? 'pointer' : 'default',
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <div
                                        className="rounded-circle me-2"
                                        style={{
                                            width: '10px',
                                            height: '10px',
                                            backgroundColor: isCurrentUser ? '#dc3545' : '#198754',
                                            boxShadow: '0 0 4px rgba(25, 135, 84, 0.5)'
                                        }}
                                    ></div>
                                    <span
                                        className={isCurrentUser ? 'fw-bold' : ''}
                                        style={{ color: userColor }}
                                    >
                                        {u.nickname}
                                        {isCurrentUser && ' (я)'}
                                    </span>
                                    <i
                                        className={`bi ${getGenderIcon(u.gender)} ms-2`}
                                        style={{ fontSize: '0.9rem', opacity: 0.6 }}
                                        title={
                                            u.gender === 'male' ? 'Мужской' :
                                                u.gender === 'female' ? 'Женский' :
                                                    'Неизвестно'
                                        }
                                    ></i>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-muted">
                            <i className="bi bi-person-x" style={{ fontSize: '2rem', opacity: 0.3 }}></i>
                            <p className="mt-2 small">Нет пользователей онлайн</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default CombinedSidebar;