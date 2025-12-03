// ==========================================
// src/utils/logger.js
// ==========================================
const logLevels = {
  error: "\x1b[31m",
  warn: "\x1b[33m",
  info: "\x1b[36m",
  success: "\x1b[32m",
  reset: "\x1b[0m",
};

class Logger {
  error(message, ...args) {
    console.error(
      `${logLevels.error}[ERROR]${logLevels.reset}`,
      message,
      ...args
    );
  }

  warn(message, ...args) {
    console.warn(`${logLevels.warn}[WARN]${logLevels.reset}`, message, ...args);
  }

  info(message, ...args) {
    console.info(`${logLevels.info}[INFO]${logLevels.reset}`, message, ...args);
  }

  success(message, ...args) {
    console.log(
      `${logLevels.success}[SUCCESS]${logLevels.reset}`,
      message,
      ...args
    );
  }
}

export default new Logger();
