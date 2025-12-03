// ==========================================
// src/models/User.model.js
// ==========================================
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    sparse: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  messageColor: {
    type: String,
    default: "black",
    enum: ["black", "blue", "green", "purple", "orange"],
  },
  gender: {
    type: String,
    default: "male",
    enum: ["male", "female", "unknown"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
});

// Индексы
userSchema.index({ nickname: 1 });
userSchema.index({ email: 1 });

// Методы экземпляра
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Статические методы
userSchema.statics.hashPassword = async function (password) {
  return bcrypt.hash(password, 10);
};

userSchema.statics.findByLogin = async function (login) {
  return this.findOne({
    $or: [{ nickname: login }, { email: login }],
  });
};

const User = mongoose.model("User", userSchema);

export default User;
