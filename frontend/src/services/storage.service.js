// frontend/src/services/storage.service.js
import { STORAGE_KEYS } from "../constants/config";

class StorageService {
  setToken(token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  removeToken() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }

  setUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  removeUser() {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  setRoom(room) {
    localStorage.setItem(STORAGE_KEYS.ROOM, room);
  }

  getRoom() {
    return localStorage.getItem(STORAGE_KEYS.ROOM);
  }

  removeRoom() {
    localStorage.removeItem(STORAGE_KEYS.ROOM);
  }

  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || "light";
  }

  clearAll() {
    this.removeToken();
    this.removeUser();
    this.removeRoom();
  }
}

export default new StorageService();
