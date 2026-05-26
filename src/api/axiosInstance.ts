import axios from "axios";

// Old hardcoded URL (commented out)
// const api = axios.create({
//   baseURL: "https://doctotrrefweb.onrender.com/api/",
//   timeout: 5 * 60 * 1000, // 60 seconds
// });

// New: Determine API URL based on environment
const getBaseURL = () => {
  const isDev = import.meta.env.MODE === "development";
  const devUrl = import.meta.env.VITE_DEV_API_URL;
  const prodUrl = import.meta.env.VITE_PROD_API_URL;

  const baseURL = isDev ? devUrl : prodUrl;
  console.log(`Using API URL: ${baseURL}`);
  return baseURL;
};

// const api = axios.create({
//   baseURL: `${getBaseURL()}/api/`,
//   timeout: 5 * 60 * 1000, // 60 seconds
// }); 

const api = axios.create({
  // baseURL: "https://doctotrrefweb.onrender.com/api/",
  baseURL : "http://127.0.0.1:8000/api/",
  timeout: 5 * 60 * 1000, // 60 seconds
}); 


// Request interceptor → attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
          // Old hardcoded URL (commented out)
          // const res = await axios.post('https://doctotrrefweb.onrender.com/api/token/refresh/', {

          // New: Use dynamic base URL
          const baseURL = getBaseURL();
          const res = await axios.post(`${baseURL}/api/token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccess = res.data.access;
          localStorage.setItem("token", newAccess);

          // Update authorization header and retry
          api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

          return api(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token expired or invalid", refreshError);
          localStorage.removeItem("token");
          localStorage.removeItem("refresh");
          window.location.href = "/login";
        }
      } else {
        // No refresh token stored → force logout
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }

    // Case 2: other errors
    return Promise.reject(error);
  }
);

export default api;
