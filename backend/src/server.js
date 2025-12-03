// ==========================================
// src/server.js
// ==========================================
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import database from "./config/database.js";
import { config } from "./config/env.js";
import socketHandler from "./sockets/socket.handler.js";
import roomService from "./services/room.service.js";
import Room from "./models/Room.model.js";
import logger from "./utils/logger.js";

// Создание HTTP сервера
const httpServer = createServer(app);

// Инициализация Socket.IO
const io = new Server(httpServer, {
  cors: config.cors,
});

// Функция запуска сервера
async function startServer() {
  try {
    // Подключение к базе данных
    await database.connect(config.mongoUri);

    // Инициализация комнат по умолчанию
    await roomService.initializeDefaultRooms();
    logger.success("✅ Комнаты инициализированы");

    // Инициализация Socket.IO
    socketHandler.initialize(io, Room);
    logger.success("✅ Socket.IO инициализирован");

    // Запуск сервера
    httpServer.listen(config.port, () => {
      logger.success(`🚀 Сервер запущен на порту ${config.port}`);
      logger.info(`📡 Environment: ${config.nodeEnv}`);
      logger.info(`🔗 Client URL: ${config.clientUrl}`);
    });
  } catch (error) {
    logger.error("❌ Ошибка запуска сервера:", error);
    process.exit(1);
  }
}

// Graceful shutdown
const shutdown = async (signal) => {
  logger.info(`\n${signal} получен, закрытие сервера...`);

  // Закрытие HTTP сервера
  httpServer.close(async () => {
    logger.info("HTTP сервер закрыт");

    // Отключение от базы данных
    await database.disconnect();

    logger.info("Процесс завершён");
    process.exit(0);
  });

  // Принудительное завершение через 10 секунд
  setTimeout(() => {
    logger.error(
      "Не удалось корректно завершить процесс, принудительный выход"
    );
    process.exit(1);
  }, 10000);
};

// Обработка сигналов завершения
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Обработка необработанных ошибок
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  // В production можно перезапустить процесс
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  shutdown("UNCAUGHT_EXCEPTION");
});

// Запуск сервера
startServer();
