export const formatRole = (role) => {
  const roleMap = {
    superadmin: "Super Admin",
    admin: "Admin",
    user: "Người dùng",
  }
  return roleMap[role] || role
}

export const validateForm = (formData) => {
  const errors = {}

  if (!formData.username || formData.username.trim().length < 3) {
    errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự"
  }

  if (!formData.password || formData.password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
