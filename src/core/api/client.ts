import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiErrorResponse } from "./types";

const baseURL = import.meta.env.VITE_API_BASE_URL;
if (!baseURL) {
  throw new Error('VITE_API_BASE_URL is not defined in .env file');
}

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "text/plain; x-api-version=1",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const originalRequestUrl = error.config?.url;

    if (error.response?.status === 401 && originalRequestUrl !== "/auth") {
      console.error(
        "API Client: Unauthorized access (401) on protected route. Clearing session."
      );
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userData");

      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
