import axiosInstance from "../lib/axios"

export const authService = {
  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post("/login", credentials)

      // Lưu token từ header Authorization
      const token = response.headers.authorization || response.headers.Authorization
      if (token) {
        localStorage.setItem("token", token)
      }

      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể kết nối đến server")
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      // Có thể gọi API logout nếu cần
      // await axiosInstance.post("/logout")

      localStorage.removeItem("token")
      localStorage.removeItem("user")
      return { success: true }
    } catch (error) {
      console.log(error.message)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      return { success: true }
    }
  },
}
