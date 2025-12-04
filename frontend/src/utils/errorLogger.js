// frontend/src/utils/errorLogger.js - Сервис логирования ошибок
class ErrorLogger {
  constructor() {
    this.errors = [];
    this.maxErrors = 50;
  }

  log(error, errorInfo, context = {}) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.errors.push(errorLog);

    // Ограничение размера массива
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Отправка на сервер (опционально)
    if (process.env.NODE_ENV === "production") {
      this.sendToServer(errorLog);
    }

    console.error("Error logged:", errorLog);
  }

  async sendToServer(errorLog) {
    try {
      // Замените на ваш endpoint
      await fetch("/api/errors/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(errorLog),
      });
    } catch (err) {
      console.error("Failed to send error to server:", err);
    }
  }

  getErrors() {
    return [...this.errors];
  }

  clear() {
    this.errors = [];
  }
}

export const errorLogger = new ErrorLogger();
