"use client"

import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useNotification } from "../hooks/useNotification"
import LoginForm from "../components/LoginForm"
import Layout from "../components/Layout"
import UserManagement from "../components/UserManagement"
import DeviceManagement from "../components/DeviceManagement"
import NotificationContainer from "../components/NotificationContainer"
import { authService } from "../services/authService"

export default function HomePage() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth()
  const { notifications, removeNotification, showSuccess, showError, showInfo } = useNotification()
  const [currentPage, setCurrentPage] = useState("users")

  const handleLogin = (userData) => {
    login(userData)
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      logout()
      showInfo("Đã đăng xuất thành công")
    } catch (error) {
      console.error("Logout error:", error)
      logout() // Force logout even if API fails
    }
  }

  const handleShowNotification = (message, title = "Thông báo") => {
    if (title.toLowerCase().includes("thành công") || title.toLowerCase().includes("success")) {
      showSuccess(message, title)
    } else if (title.toLowerCase().includes("lỗi") || title.toLowerCase().includes("error")) {
      showError(message, title)
    } else {
      showInfo(message, title)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-gray-600 font-medium">Đang khởi tạo hệ thống...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - show login form
  if (!isAuthenticated) {
    return (
      <>
        <LoginForm onLoginSuccess={handleLogin} onShowNotification={handleShowNotification} />
        <NotificationContainer notifications={notifications} onRemove={removeNotification} />
      </>
    )
  }

  // Authenticated - show main application
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "users":
        return <UserManagement onShowNotification={handleShowNotification} />
      case "devices":
        return <DeviceManagement onShowNotification={handleShowNotification} />
      default:
        return <UserManagement onShowNotification={handleShowNotification} />
    }
  }

  return (
    <>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage} user={user} onLogout={handleLogout}>
        {renderCurrentPage()}
      </Layout>
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </>
  )
}
