import toast from "@/utils/toast";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR", error?.response?.data || error.message);

    if (error.response?.status === 401) {
      toast.info("Session Expired! Please login again.");
      localStorage.clear();
      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
