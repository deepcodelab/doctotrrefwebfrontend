import axios from "axios";

// const mode = import.meta.env.REACT_APP_MODE;
const mode = "development";

const API_URL =
  mode === "development"
    ? "http://localhost:8000"
    : "https://doctotrrefweb.onrender.com"

const api = axios.create({
  baseURL: `${API_URL}/api/`,
  timeout: 5 * 60 * 1000, // 60 seconds
}); 

// Request interceptor → attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access"); // renamed for clarity
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Case 1: access token expired and request not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        try {
          const res = await axios.post('https://doctotrrefwebfrontend1.vercel.app//api/token/refresh/', {
            refresh: refreshToken,
          });

          const newAccess = res.data.access;
          localStorage.setItem("access", newAccess);

          // Update authorization header and retry
          api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

          return api(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token expired or invalid", refreshError);
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/login";
        }
      } else {
        // No refresh token stored → force logout
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }

    // Case 2: other errors
    return Promise.reject(error);
  }
);

export default api;
