import axios from "axios";
import { API_BASE_URL } from "./appConfig";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
});

// Always attach token + fix missing slash
http.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Force leading slash
    if (!config.url.startsWith("/")) {
      config.url = "/" + config.url;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Handle unauthorized
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/Login";
    }
    return Promise.reject(error);
  }
);
