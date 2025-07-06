import axiosInstance from "../lib/axios"

export const deviceService = {
  // Lấy danh sách thiết bị
  getDevices: async (keyword = "") => {
    try {
      const response = await axiosInstance.get(`/api/devices?keyword=${keyword}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể lấy danh sách thiết bị")
    }
  },

  // Lấy thiết bị theo ID
  getDeviceById: async (deviceId) => {
    try {
      const response = await axiosInstance.get(`/api/devices/${deviceId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể lấy thông tin thiết bị")
    }
  },

  // Tạo thiết bị mới
  createDevice: async (deviceData) => {
    try {
      const response = await axiosInstance.post("/api/devices", deviceData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể tạo thiết bị")
    }
  },

  // Cập nhật thiết bị
  updateDevice: async (deviceId, deviceData) => {
    try {
      const response = await axiosInstance.patch(`/api/devices/${deviceId}`, deviceData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể cập nhật thiết bị")
    }
  },

  // Xóa thiết bị
  deleteDevice: async (deviceId) => {
    try {
      const response = await axiosInstance.delete(`/api/devices/${deviceId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể xóa thiết bị")
    }
  },
}
