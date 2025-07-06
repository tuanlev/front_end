"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Eye, EyeOff, Lock, User, Shield, CheckCircle2, Loader2 } from "lucide-react"
import { authService } from "../services/authService"

export default function LoginForm({ onLoginSuccess, onShowNotification }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    // Load remember me data
    const savedUsername = localStorage.getItem("rememberedUsername")
    const savedRememberMe = localStorage.getItem("rememberMe") === "true"

    if (savedUsername && savedRememberMe) {
      setFormData((prev) => ({ ...prev, username: savedUsername }))
      setRememberMe(true)
    }

    // Listen for session expired
    const handleAuthLogout = () => {
      onShowNotification?.("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", "Thông báo")
    }

    window.addEventListener("auth-logout", handleAuthLogout)
    return () => window.removeEventListener("auth-logout", handleAuthLogout)
  }, [onShowNotification])

  const validateForm = () => {
    const errors = {}

    if (!formData.username.trim()) {
      errors.username = "Tên đăng nhập không được để trống"
    } else if (formData.username.length < 3) {
      errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự"
    }

    if (!formData.password) {
      errors.password = "Mật khẩu không được để trống"
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await authService.login(formData)

      if (response.success && response.data) {
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", formData.username)
          localStorage.setItem("rememberMe", "true")
        } else {
          localStorage.removeItem("rememberedUsername")
          localStorage.removeItem("rememberMe")
        }

        onShowNotification?.(`Chào mừng ${response.data.username}!`, "Đăng nhập thành công")
        onLoginSuccess(response.data)
      } else {
        onShowNotification?.(response.message || "Đăng nhập thất bại", "Lỗi")
      }
    } catch (err) {
      onShowNotification?.(err.message, "Lỗi đăng nhập")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hệ thống quản lý</h1>
          <p className="text-gray-600">Đăng nhập để truy cập các chức năng quản lý</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Đăng nhập</CardTitle>
            <CardDescription className="text-gray-600">Nhập thông tin đăng nhập của bạn</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Tên đăng nhập
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`pl-10 h-11 transition-all duration-200 ${
                      validationErrors.username
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  />
                </div>
                {validationErrors.username && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.username}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`pl-10 pr-10 h-11 transition-all duration-200 ${
                      validationErrors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  disabled={isLoading}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">
                  Ghi nhớ tên đăng nhập
                </Label>
              </div>
            </CardContent>

            <CardFooter className="pt-4">
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang đăng nhập...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Đăng nhập
                  </div>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">🔑 Thông tin đăng nhập demo:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Tên đăng nhập:</strong> voanhdung
            </p>
            <p>
              <strong>Mật khẩu:</strong> 12345678
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 Hệ thống quản lý. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </div>
  )
}
