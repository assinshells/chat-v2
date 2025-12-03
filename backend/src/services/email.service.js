// ==========================================
// src/services/email.service.js
// ==========================================
import nodemailer from "nodemailer";
import { config } from "../config/env.js";
import logger from "../utils/logger.js";

class EmailService {
  constructor() {
    if (config.email.user && config.email.pass) {
      this.transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: false,
        auth: {
          user: config.email.user,
          pass: config.email.pass,
        },
      });
    }
  }

  async sendPasswordResetEmail(email, resetToken) {
    if (!this.transporter) {
      logger.warn("Email service not configured");
      return;
    }

    const resetUrl = `${config.clientUrl}/reset-password/${resetToken}`;

    try {
      await this.transporter.sendMail({
        from: config.email.user,
        to: email,
        subject: "Восстановление пароля",
        html: `
          <h2>Восстановление пароля</h2>
          <p>Для восстановления пароля перейдите по ссылке:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>Ссылка действительна 1 час.</p>
        `,
      });
      logger.success(`Password reset email sent to ${email}`);
    } catch (error) {
      logger.error("Error sending email:", error);
      throw error;
    }
  }
}

export default new EmailService();
