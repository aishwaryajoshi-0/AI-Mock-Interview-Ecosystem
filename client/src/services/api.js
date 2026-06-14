import axios from "axios";
import { toast } from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mockInterviewToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error.message || "Something went wrong";
    if (error?.response?.status === 401) {
      localStorage.removeItem("mockInterviewToken");
    }
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
