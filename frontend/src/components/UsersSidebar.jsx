import { useEffect } from 'react';
import * as bootstrap from 'bootstrap';

function UsersSidebar({ users, currentUser, onUserClick }) {
    useEffect(() => {
        // Инициализация tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltips = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));

        return () => {
            tooltips.forEach(tooltip => tooltip.dispose());
        };
    }, [users]);

    return (
        <div className="users-sidebar border-start d-none d-lg-block">
            <div className="p-3 border-bottom">
                <h6 className="mb-0">
                    <i className="bi bi-people-fill me-2"></i>
                    Онлайн ({users.length})
                </h6>
            </div>

            <div className="users-list p-3">
                {users.length > 0 ? (
                    users.map((u) => {
                        const isCurrentUser = u.userId === currentUser.id;

                        return (
                            <div
                                key={u.socketId}
                                className={`user-item d-flex align-items-center mb-2 p-2 rounded ${!isCurrentUser ? 'clickable-user' : ''
                                    }`}
                                onClick={() => !isCurrentUser && onUserClick(u)}
                                data-bs-toggle="tooltip"
                                data-bs-placement="left"
                                title={!isCurrentUser ? 'Кликните, чтобы отправить сообщение' : 'Вы'}
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
                                        backgroundColor: isCurrentUser ? '#0d6efd' : '#198754',
                                        boxShadow: '0 0 4px rgba(25, 135, 84, 0.5)'
                                    }}
                                ></div>
                                <span className={isCurrentUser ? 'fw-bold text-primary' : ''}>
                                    {u.nickname}
                                    {isCurrentUser && (
                                        <span className="badge bg-primary ms-2" style={{ fontSize: '0.65rem' }}>
                                            Я
                                        </span>
                                    )}
                                </span>
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
    );
}

export default UsersSidebar;