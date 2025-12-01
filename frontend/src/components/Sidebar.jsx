import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import * as bootstrap from 'bootstrap';
import reactLogo from '../assets/react.svg';

function Sidebar({ user, onLogout }) {
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        // Инициализация tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltips = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));

        return () => {
            tooltips.forEach(tooltip => tooltip.dispose());
        };
    }, []);

    return (
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
                <ul className="nav nav-pills side-menu-nav justify-content-center" role="">
                    <li className="nav-item" data-bs-toggle="tooltip" data-bs-placement="right" title="Настройки">
                        <a className="nav-link" id="" data-bs-toggle="" href="#" role="">
                            <i className="bi bi-gear"></i>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="flex-lg-column d-none d-lg-block">
                <ul className="nav side-menu-nav justify-content-center">
                    <li className="nav-item">
                        <a
                            className="nav-link light-dark-mode"
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                toggleTheme();
                            }}
                            data-bs-toggle="tooltip"
                            data-bs-trigger="hover"
                            data-bs-placement="right"
                            title="Dark / Light Mode"
                        >
                            <i className={`bi bi-${theme === 'light' ? 'moon-stars' : 'brightness-high'} theme-mode-icon`}></i>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className="nav-link"
                            href="#"
                            onClick={onLogout}
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Выход из чата"
                        >
                            <i className="bi bi-box-arrow-right"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;