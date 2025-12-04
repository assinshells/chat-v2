// frontend/src/api/client.js
import axios from "axios";
import { API_CONFIG } from "../constants/config";
import storageService from "../services/storage.service";

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = storageService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(this.normalizeError(error))
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const normalizedError = this.normalizeError(error);

        // Обработка 401
        if (normalizedError.status === 401) {
          storageService.clearAll();
          window.location.href = "/login";
        }

        return Promise.reject(normalizedError);
      }
    );
  }

  normalizeError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.error || error.message,
        data: error.response.data,
      };
    }

    if (error.request) {
      return {
        status: 0,
        message: "Нет соединения с сервером",
        data: null,
      };
    }

    return {
      status: -1,
      message: error.message || "Неизвестная ошибка",
      data: null,
    };
  }

  // HTTP методы
  get(url, config) {
    return this.client.get(url, config);
  }

  post(url, data, config) {
    return this.client.post(url, data, config);
  }

  put(url, data, config) {
    return this.client.put(url, data, config);
  }

  patch(url, data, config) {
    return this.client.patch(url, data, config);
  }

  delete(url, config) {
    return this.client.delete(url, config);
  }
}

export default new ApiClient();
