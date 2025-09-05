import axios from "axios";

const httpClient = axios.create({
  baseURL: "http://localhost:3333",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-token");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// Simple facade methods
export const http = {
  get: (url: string) => httpClient.get(url).then((res) => res.data),
  post: (url: string, data?: unknown) =>
    httpClient.post(url, data).then((res) => res.data),
  put: (url: string, data?: unknown) =>
    httpClient.put(url, data).then((res) => res.data),
  patch: (url: string, data?: unknown) =>
    httpClient.patch(url, data).then((res) => res.data),
  delete: (url: string) => httpClient.delete(url).then((res) => res.data),
};

export default http;
