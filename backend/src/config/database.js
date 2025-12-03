// ==========================================
// src/config/database.js
// ==========================================
import mongoose from "mongoose";
import logger from "../utils/logger.js";

export class Database {
  constructor() {
    this.connection = null;
  }

  async connect(uri) {
    try {
      await mongoose.connect(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.connection = mongoose.connection;
      logger.success("✅ MongoDB подключен");

      this.setupEventHandlers();
      return this.connection;
    } catch (error) {
      logger.error("❌ Ошибка подключения к MongoDB:", error);
      process.exit(1);
    }
  }

  setupEventHandlers() {
    this.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });

    this.connection.on("disconnected", () => {
      logger.warn("⚠️ MongoDB disconnected");
    });

    this.connection.on("reconnected", () => {
      logger.success("MongoDB reconnected");
    });
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.close();
      logger.info("MongoDB connection closed");
    }
  }
}

export default new Database();
