// frontend/src/pages/Auth/Login.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/api/useAuth';
import { useForm } from '../../hooks/ui/useForm';
import { useRooms } from '../../hooks/api/useRooms';
import { Button, Input, Select, Alert } from '../../components/ui';
import AuthLayout from '../../layouts/AuthLayout';
import { DEFAULT_ROOM } from '../../constants/config';
import { validateLogin } from '../../utils/validators';

function Login() {
    const { login, loading, error, setError } = useAuth();
    const { rooms } = useRooms();

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useForm(
        {
            login: '',
            password: '',
            room: DEFAULT_ROOM,
        },
        validateLogin
    );

    // Очистка ошибки при изменении полей
    useEffect(() => {
        if (error) setError(null);
    }, [values, error, setError]);

    const onSubmit = async (formValues) => {
        try {
            await login(
                {
                    login: formValues.login,
                    password: formValues.password
                },
                formValues.room
            );
        } catch (err) {
            // Ошибка уже обработана в хуке
        }
    };

    const roomOptions = rooms.length > 0
        ? rooms.map(room => ({
            value: room.name,
            label: `# ${room.displayName}${room.description ? ` - ${room.description}` : ''}`,
        }))
        : [{ value: DEFAULT_ROOM, label: '# Главная' }];

    return (
        <AuthLayout>
            <div className="card shadow-lg border-0">
                <div className="card-body p-5">
                    <h2 className="text-center mb-4">🔐 Вход в чат</h2>

                    {error && <Alert type="danger">{error}</Alert>}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            label="Никнейм или Email"
                            name="login"
                            value={values.login}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.login}
                            touched={touched.login}
                            required
                            autoFocus
                        />

                        <Input
                            label="Пароль"
                            name="password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.password}
                            touched={touched.password}
                            required
                        />

                        <Select
                            label="🚪 Выберите комнату"
                            name="room"
                            value={values.room}
                            onChange={handleChange}
                            options={roomOptions}
                        />
                        <small className="text-muted d-block mb-3">
                            Вы можете переключаться между комнатами в любое время
                        </small>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            loading={loading}
                            disabled={loading}
                            className="mb-3"
                        >
                            Войти в чат
                        </Button>
                    </form>

                    <div className="text-center mb-2">
                        <Link to="/forgot-password" className="text-decoration-none">
                            Забыли пароль?
                        </Link>
                    </div>

                    <hr />

                    <div className="text-center">
                        <p className="mb-2">Нет аккаунта?</p>
                        <Link to="/register">
                            <Button variant="outline-primary">Зарегистрироваться</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}

export default Login;