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
    // Check if the error is 401 and not a login request
    const isLoginRequest = error?.config?.url?.includes("/auth/login");
    const isAlreadyOnLoginPage = typeof window !== "undefined" && window.location.pathname === "/Login";

    if (error?.response?.status === 401 && !isLoginRequest && !isAlreadyOnLoginPage) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/Login";
    }
    return Promise.reject(error);
  }
);
