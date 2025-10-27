import axios from "axios";
import { API_BASE_URL } from "./appConfig";

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
  },
});

// Add request interceptor
http.interceptors.request.use(
  function (config) {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add response interceptor
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.message === "Unauthenticated."
    ) {
      // Clear local storage
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }

      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/Login";
      }
    }

    return Promise.reject(error);
  }
);
