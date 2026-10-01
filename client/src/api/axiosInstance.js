
import axios from "axios";

// Get API URL from .env
const rawBaseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Make sure /api is added only once
const baseURL = rawBaseURL.endsWith("/api")
  ? rawBaseURL
  : `${rawBaseURL.replace(/\/+$/, "")}/api`;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log(
      "API URL:",
      `${config.baseURL}${config.url}`
    );

    console.log(
      "TOKEN:",
      token ? "FOUND ✅" : "NOT FOUND ❌"
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized requests
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

