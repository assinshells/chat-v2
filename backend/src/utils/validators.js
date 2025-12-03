// ==========================================
// src/utils/validators.js
// ==========================================
import Joi from "joi";

export const validators = {
  register: Joi.object({
    nickname: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().allow("", null),
    password: Joi.string().min(6).required(),
    messageColor: Joi.string()
      .valid("black", "blue", "green", "purple", "orange")
      .default("black"),
    gender: Joi.string().valid("male", "female", "unknown").default("male"),
  }),

  login: Joi.object({
    login: Joi.string().required(),
    password: Joi.string().required(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }),

  updateColor: Joi.object({
    messageColor: Joi.string()
      .valid("black", "blue", "green", "purple", "orange")
      .required(),
  }),

  updateGender: Joi.object({
    gender: Joi.string().valid("male", "female", "unknown").required(),
  }),

  sendMessage: Joi.object({
    text: Joi.string().required().max(1000),
    toUserId: Joi.string(),
    toNickname: Joi.string(),
  }),
};
