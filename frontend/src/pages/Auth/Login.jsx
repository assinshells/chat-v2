// frontend/src/pages/Auth/Login.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRooms } from '../../hooks/useRooms';
import { DEFAULT_ROOM } from '../../constants/config';
import AuthLayout from '../../layouts/AuthLayout';

function Login() {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        room: DEFAULT_ROOM
    });

    const { login, loading, error, setError } = useAuth();
    const { rooms } = useRooms();

    const handleChange = useCallback((e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    }, [setError]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        try {
            await login(
                { login: formData.login, password: formData.password },
                formData.room
            );
        } catch (err) {
            console.error('Login failed:', err);
        }
    }, [formData, login]);

    return (
        <AuthLayout>
            <div className="card shadow-lg border-0">
                <div className="card-body p-5">
                    <h2 className="text-center mb-4">🔐 Вход в чат</h2>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Никнейм или Email</label>
                            <input
                                type="text"
                                className="form-control"
                                name="login"
                                value={formData.login}
                                onChange={handleChange}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Пароль</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">🚪 Выберите комнату</label>
                            <select
                                className="form-select"
                                name="room"
                                value={formData.room}
                                onChange={handleChange}
                            >
                                {rooms.length > 0 ? (
                                    rooms.map((room) => (
                                        <option key={room.name} value={room.name}>
                                            # {room.displayName}
                                            {room.description && ` - ${room.description}`}
                                        </option>
                                    ))
                                ) : (
                                    <option value={DEFAULT_ROOM}># Главная</option>
                                )}
                            </select>
                            <small className="text-muted">
                                Вы можете переключаться между комнатами в любое время
                            </small>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 mb-3"
                            disabled={loading}
                        >
                            {loading ? 'Вход...' : 'Войти в чат'}
                        </button>
                    </form>

                    <div className="text-center mb-2">
                        <Link to="/forgot-password" className="text-decoration-none">
                            Забыли пароль?
                        </Link>
                    </div>

                    <hr />

                    <div className="text-center">
                        <p className="mb-2">Нет аккаунта?</p>
                        <Link to="/register" className="btn btn-outline-primary">
                            Зарегистрироваться
                        </Link>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}

export default Login;