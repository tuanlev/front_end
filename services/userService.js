import axiosInstance from "../lib/axios"

export const userService = {
  // Lấy danh sách người dùng
  getUsers: async (keyword = "") => {
    try {
      const response = await axiosInstance.get(`/api/users?keyword=${keyword}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể lấy danh sách người dùng")
    }
  },

  // Tạo người dùng mới
  createUser: async (userData) => {
    try {
      const response = await axiosInstance.post("/api/users/register", userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể tạo người dùng")
    }
  },

  // Reset mật khẩu
  resetPassword: async (userId) => {
    try {
      const response = await axiosInstance.patch(`/api/users/reset/${userId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể reset mật khẩu")
    }
  },

  // Xóa người dùng
  deleteUser: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/api/users/${userId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể xóa người dùng")
    }
  },

  // Thay đổi thiết bị cho người dùng
  changeDevice: async (userId, deviceId) => {
    try {
      const response = await axiosInstance.patch(`/api/users/changedevice/${userId}`, {
        device_id: deviceId,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể thay đổi thiết bị")
    }
  },
}
