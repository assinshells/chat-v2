import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import reactLogo from '../assets/react.svg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const GENDER_OPTIONS = [
    { value: 'male', label: 'Мужской', icon: 'bi-gender-male' },
    { value: 'female', label: 'Женский', icon: 'bi-gender-female' },
    { value: 'unknown', label: 'Неизвестно', icon: 'bi-gender-ambiguous' }
];

function Sidebar({ user, onLogout, unreadCount, onOpenPrivateMessages, onColorChange, onGenderChange }) {
    const { theme, toggleTheme } = useTheme();
    const [selectedColor, setSelectedColor] = useState(user.messageColor || 'black');
    const [selectedGender, setSelectedGender] = useState(user.gender || 'male');
    const [saving, setSaving] = useState(false);
    const [colorError, setColorError] = useState('');
    const [colorSuccess, setColorSuccess] = useState('');
    const [genderError, setGenderError] = useState('');
    const [genderSuccess, setGenderSuccess] = useState('');

    const handleColorChange = async (color) => {
        setSelectedColor(color);
        setColorError('');
        setColorSuccess('');
        setSaving(true);

        try {
            const token = localStorage.getItem('chatToken');
            const response = await axios.patch(
                `${API_URL}/api/user/message-color`,
                { messageColor: color },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Обновляем пользователя в localStorage
            const updatedUser = response.data;
            localStorage.setItem('chatUser', JSON.stringify(updatedUser));

            // Уведомляем родительский компонент
            if (onColorChange) {
                onColorChange(updatedUser);
            }

            setColorSuccess('Цвет успешно изменён!');
            setTimeout(() => setColorSuccess(''), 3000);
        } catch (error) {
            console.error('Ошибка изменения цвета:', error);
            setColorError('Не удалось изменить цвет');
        } finally {
            setSaving(false);
        }
    };

    const handleGenderChange = async (gender) => {
        setSelectedGender(gender);
        setGenderError('');
        setGenderSuccess('');
        setSaving(true);

        try {
            const token = localStorage.getItem('chatToken');
            const response = await axios.patch(
                `${API_URL}/api/user/gender`,
                { gender },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedUser = response.data;
            localStorage.setItem('chatUser', JSON.stringify(updatedUser));

            if (onGenderChange) {
                onGenderChange(updatedUser);
            }

            setGenderSuccess('Пол успешно изменён!');
            setTimeout(() => setGenderSuccess(''), 3000);
        } catch (error) {
            console.error('Ошибка изменения пола:', error);
            setGenderError('Не удалось изменить пол');
        } finally {
            setSaving(false);
        }
    };

    const getColorHex = (colorValue) => {
        const color = COLOR_OPTIONS.find(c => c.value === colorValue);
        return color ? color.hex : '#000000';
    };

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
                        <li className="nav-item position-relative">
                            <a
                                className="nav-link"
                                onClick={onOpenPrivateMessages}
                                href="#"
                                title="Личные сообщения"
                                style={{ cursor: 'pointer' }}
                            >
                                <i className="bi bi-chat-dots"></i>
                                {unreadCount > 0 && (
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                        style={{ fontSize: '0.65rem' }}
                                    >
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
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
                            {/* Информация о пользователе */}
                            <div className="mb-4">
                                <h6 className="mb-2">
                                    <i className="bi bi-person-circle me-2"></i>
                                    Информация о пользователе
                                </h6>
                                <p className="mb-1">
                                    <strong>Никнейм:</strong>{' '}
                                    <span style={{ color: getColorHex(user.messageColor) }}>
                                        {user.nickname}
                                    </span>
                                </p>
                                {user.email && (
                                    <p className="mb-1">
                                        <strong>Email:</strong> {user.email}
                                    </p>
                                )}
                            </div>

                            <hr />

                            {/* Выбор пола */}
                            <div className="mb-4">
                                <h6 className="mb-3">
                                    <i className="bi bi-person-badge me-2"></i>
                                    Пол
                                </h6>

                                {genderError && (
                                    <div className="alert alert-danger py-2">{genderError}</div>
                                )}
                                {genderSuccess && (
                                    <div className="alert alert-success py-2">{genderSuccess}</div>
                                )}

                                <div className="d-flex flex-column gap-2">
                                    {GENDER_OPTIONS.map(gender => (
                                        <div
                                            key={gender.value}
                                            className={`form-check p-3 rounded border ${selectedGender === gender.value ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                            onClick={() => handleGenderChange(gender.value)}
                                        >
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="genderSetting"
                                                id={`setting-gender-${gender.value}`}
                                                value={gender.value}
                                                checked={selectedGender === gender.value}
                                                onChange={() => handleGenderChange(gender.value)}
                                                disabled={saving}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <label
                                                className="form-check-label d-flex align-items-center w-100"
                                                htmlFor={`setting-gender-${gender.value}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <i className={`bi ${gender.icon} me-3`} style={{ fontSize: '1.5rem' }}></i>
                                                <div className="flex-grow-1">
                                                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                                                        {gender.label}
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <small className="text-muted d-block mt-3">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Влияет на текст уведомлений о входе/выходе
                                </small>
                            </div>

                            <hr />

                            {/* Цвет сообщений */}
                            <div className="mb-4">
                                <h6 className="mb-3">
                                    <i className="bi bi-palette me-2"></i>
                                    Цвет ваших сообщений
                                </h6>

                                {colorError && (
                                    <div className="alert alert-danger py-2">{colorError}</div>
                                )}
                                {colorSuccess && (
                                    <div className="alert alert-success py-2">{colorSuccess}</div>
                                )}

                                <div className="d-flex flex-column gap-2">
                                    {COLOR_OPTIONS.map(color => (
                                        <div
                                            key={color.value}
                                            className={`form-check p-3 rounded border ${selectedColor === color.value ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                            onClick={() => handleColorChange(color.value)}
                                        >
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="messageColorSetting"
                                                id={`setting-color-${color.value}`}
                                                value={color.value}
                                                checked={selectedColor === color.value}
                                                onChange={() => handleColorChange(color.value)}
                                                disabled={saving}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <label
                                                className="form-check-label d-flex align-items-center w-100"
                                                htmlFor={`setting-color-${color.value}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <span
                                                    className="d-inline-block me-3 rounded"
                                                    style={{
                                                        width: '30px',
                                                        height: '30px',
                                                        backgroundColor: color.hex,
                                                        border: '2px solid #dee2e6'
                                                    }}
                                                ></span>
                                                <div className="flex-grow-1">
                                                    <div style={{ color: color.hex, fontWeight: '600', fontSize: '1.1rem' }}>
                                                        {color.label}
                                                    </div>
                                                    <small className="text-muted" style={{ color: color.hex }}>
                                                        Пример текста сообщения
                                                    </small>
                                                </div>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {saving && (
                                    <div className="text-center mt-3">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="visually-hidden">Сохранение...</span>
                                        </div>
                                        <small className="d-block mt-1 text-muted">Сохранение...</small>
                                    </div>
                                )}

                                <small className="text-muted d-block mt-3">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Все новые сообщения будут отображаться выбранным цветом
                                </small>
                            </div>

                            <hr />

                            {/* Тема оформления */}
                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center">
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
                            </div>

                            <hr />

                            {/* Личные сообщения */}
                            <div className="mb-3">
                                <h6 className="mb-2">
                                    <i className="bi bi-chat-dots me-2"></i>
                                    Личные сообщения
                                </h6>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>Непрочитанных сообщений:</span>
                                    <span className={`badge ${unreadCount > 0 ? 'bg-danger' : 'bg-secondary'}`}>
                                        {unreadCount}
                                    </span>
                                </div>
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
        </>
    );
}

export default Sidebar;