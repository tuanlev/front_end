import axios from "axios"

// Tạo axios instance với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: "http://localhost:3002",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor - thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = token
    }
    console.log("🚀 Request:", config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error("❌ Request Error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor - xử lý token và lỗi
axiosInstance.interceptors.response.use(
  (response) => {
    // Lưu token mới từ header Authorization
    const newToken = response.headers.authorization || response.headers.Authorization
    if (newToken) {
      localStorage.setItem("token", newToken)
      console.log("🔄 Token refreshed")
    }

    console.log("✅ Response:", response.status, response.config.url)
    return response
  },
  (error) => {
    console.error("❌ Response Error:", error.response?.status, error.message)

    // Xử lý lỗi 401 và 403 - logout tự động
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("🚪 Authentication failed, logging out...")
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.dispatchEvent(new CustomEvent("auth-logout"))

      if (window.location.pathname !== "/") {
        window.location.href = "/"
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
