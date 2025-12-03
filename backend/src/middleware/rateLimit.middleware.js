// ==========================================
// src/middleware/rateLimit.middleware.js
// ==========================================
const rateLimitStore = new Map();

export const rateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 минут
    max = 100, // максимум запросов
    message = "Too many requests, please try again later",
  } = options;

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();

    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    const data = rateLimitStore.get(key);

    if (now > data.resetTime) {
      data.count = 1;
      data.resetTime = now + windowMs;
      return next();
    }

    if (data.count >= max) {
      return res.status(429).json({ error: message });
    }

    data.count += 1;
    next();
  };
};

// Очистка старых записей каждые 30 минут
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 30 * 60 * 1000);
