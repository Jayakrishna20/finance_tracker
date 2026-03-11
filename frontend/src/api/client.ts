import axios from "axios";
import toast from "react-hot-toast";

// Create base client
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => {
    // Only show success toasts for mutations, not GET requests
    const isMutation =
      response.config.method &&
      ["post", "put", "delete"].includes(response.config.method.toLowerCase());

    if (
      response.data &&
      typeof response.data === "object" &&
      "success" in response.data
    ) {
      if (response.data.success && isMutation && response.data.message) {
        toast.success(response.data.message);
      } else if (response.data.success === false && response.data.message) {
        toast.error(response.data.message);
      }
    }
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    toast.error(message);
    return Promise.reject(error);
  },
);
