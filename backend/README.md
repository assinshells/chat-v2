# Chat Application Backend

## Архитектура проекта

Проект построен по многослойной архитектуре:

### Слои приложения

1. **Routes** - Определение маршрутов API
2. **Controllers** - Обработка HTTP запросов и формирование ответов
3. **Services** - Бизнес-логика приложения
4. **Models** - Схемы данных и методы работы с БД
5. **Middleware** - Промежуточные обработчики
6. **Utils** - Вспомогательные функции
7. **Sockets** - Обработка WebSocket соединений

### Структура директорий

```
backend/
├── src/
│   ├── config/           # Конфигурация
│   ├── controllers/      # Контроллеры
│   ├── services/         # Бизнес-логика
│   ├── models/           # Модели данных
│   ├── routes/           # Маршруты
│   ├── middleware/       # Middleware
│   ├── sockets/          # WebSocket логика
│   ├── utils/            # Утилиты
│   ├── constants/        # Константы
│   ├── app.js           # Express приложение
│   └── server.js        # Точка входа
```

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Копирование .env файла
cp .env.example .env

# Запуск в dev режиме
npm run dev

# Запуск в production
npm start
```

## Ключевые улучшения

1. **Разделение ответственности** - каждый слой выполняет свою функцию
2. **Единая обработка ошибок** - класс ApiError
3. **Асинхронная обработка** - asyncHandler wrapper
4. **Валидация данных** - централизованная через Joi
5. **Логирование** - единый Logger
6. **Rate limiting** - защита от злоупотреблений
7. **Безопасность** - helmet, cors, jwt
8. **Graceful shutdown** - корректное завершение

## API Endpoints

### Authentication

- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Авторизация
- `POST /api/auth/forgot-password` - Восстановление пароля
- `POST /api/auth/reset-password` - Сброс пароля

### User

- `GET /api/user/profile` - Профиль пользователя
- `PATCH /api/user/message-color` - Изменить цвет сообщений
- `PATCH /api/user/gender` - Изменить пол

### Messages

- `GET /api/messages/room/:room` - Сообщения комнаты
- `GET /api/messages/conversations` - Список диалогов
- `GET /api/messages/private/:userId` - Приватные сообщения
- `POST /api/messages/mark-read/:userId` - Отметить прочитанными
- `GET /api/messages/unread-count` - Счётчик непрочитанных

### Rooms

- `GET /api/rooms` - Список комнат

## WebSocket Events

### Client → Server

- `authenticate` - Авторизация
- `join_room` - Смена комнаты
- `send_message` - Отправка сообщения
- `typing` - Индикатор печати

### Server → Client

- `authenticated` - Успешная авторизация
- `message_history` - История сообщений
- `new_message` - Новое сообщение
- `private_message` - Приватное сообщение
- `user_joined` - Пользователь вошёл
- `user_left` - Пользователь вышел
- `room_changed` - Смена комнаты
- `rooms_update` - Обновление информации о комнатах
- `user_typing` - Пользователь печатает
- `unread_count_update` - Обновление счётчика

## Лицензия

ISC
