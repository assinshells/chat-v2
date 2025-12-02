import { useTheme } from '../context/ThemeContext';
import reactLogo from '../assets/react.svg';

function Sidebar({ user, onLogout }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            <div className="side-menu flex-lg-column me-lg-1 ms-lg-0">
                <div className="navbar-brand-box">
                    <a href="#" className="logo logo-dark">
                        <span className="logo-sm">
                            <img src={reactLogo} alt="Logo" height="30" />
                        </span>
                    </a>
                    <a href="#" className="logo logo-light">
                        <span className="logo-sm">
                            <img src={reactLogo} alt="Logo" height="30" />
                        </span>
                    </a>
                </div>
                <div className="flex-lg-column my-auto">
                    <ul className="nav nav-pills side-menu-nav justify-content-center">
                        <li className="nav-item">{/*вызывает модальное окно со списком диалогов приватных сообщений*/}
                            <a
                                className="nav-link"
                                data-bs-toggle="modal"
                                data-bs-target="#privateMessagesModal"
                                href="#"
                                title="Приватные сообщения"
                            >
                                <i className="bi bi-chat-dots"></i>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                data-bs-toggle="modal"
                                data-bs-target="#settingsModal"
                                href="#"
                                title="Настройки"
                            >
                                <i className="bi bi-gear"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="flex-lg-column d-none d-lg-block">
                    <ul className="nav side-menu-nav justify-content-center">
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="#"
                                onClick={onLogout}
                                title="Выход из чата"
                            >
                                <i className="bi bi-box-arrow-right"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Settings Modal */}
            <div className="modal fade" id="settingsModal" tabIndex="-1" aria-labelledby="settingsModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="settingsModalLabel">
                                <i className="bi bi-gear me-2"></i>
                                Настройки
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h6 className="mb-1">Тема оформления</h6>
                                    <small className="text-muted">
                                        {theme === 'light' ? 'Светлая тема' : 'Темная тема'}
                                    </small>
                                </div>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id="themeSwitch"
                                        checked={theme === 'dark'}
                                        onChange={toggleTheme}
                                        style={{ cursor: 'pointer', width: '50px', height: '25px' }}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="themeSwitch">
                                        <i className={`bi bi-${theme === 'light' ? 'moon-stars' : 'brightness-high'}`}></i>
                                    </label>
                                </div>
                            </div>

                            <hr />

                            <div className="mb-3">
                                <h6 className="mb-2">Информация о пользователе</h6>
                                <p className="mb-1">
                                    <strong>Никнейм:</strong> {user.nickname}
                                </p>
                                {user.email && (
                                    <p className="mb-1">
                                        <strong>Email:</strong> {user.email}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Private Modal */}
            <div class="modal fade messages-modal" id="privateMessagesModal" tabindex="-1" aria-labelledby="messagesModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">

                        {/* ---------------- HEADER ---------------- */}
                        <div class="modal-header">
                            <button id="backBtn" class="btn btn-link p-0 me-2 d-none">
                                <i class="bi bi-arrow-left fs-4"></i>
                            </button>

                            <h5 class="modal-title" id="modalTitle">Диалоги</h5>

                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        {/* ---------------- DIALOG LIST ---------------- */}
                        <div id="dialogList" class="modal-body p-0">
                            <div class="list-group list-group-flush">

                                {/* DYNAMIC DIALOGS */}
                            </div>
                        </div>

                        {/* ---------------- CHAT WINDOW ---------------- */}
                        <div id="chatWindow" class="d-none flex-column" style="height:60vh;">

                            <div class="messages-container flex-grow-1" id="messagesContainer"></div>

                            {/* FOOTER ВВОДА */}
                            <form id="composeForm" class="px-3 pb-3 pt-2 d-flex gap-2">
                                <textarea id="messageInput" class="form-control" rows="1"
                                    placeholder="Написать сообщение..."></textarea>
                                <button class="btn btn-primary"><i class="bi bi-send-fill"></i></button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;