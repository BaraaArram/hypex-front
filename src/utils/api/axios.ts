import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL|| "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json", 
  },
});



// interceptors for handling authentication tokens
axiosInstance.interceptors.request.use(
  (config) => {
    // If you have a token, attach it to each request
    const token = localStorage.getItem("accessToken"); // Example for localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
