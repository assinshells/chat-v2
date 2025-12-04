import axios from "axios";
import { API_CONFIG } from "../constants/config";
import storageService from "../services/storage.service";

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = storageService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      storageService.clearAll();
      window.location.href = "/login";
    }

    const errorMessage =
      response?.data?.error || error.message || "Неизвестная ошибка";

    return Promise.reject({
      status: response?.status,
      message: errorMessage,
      data: response?.data,
    });
  }
);

export default apiClient;
