"use client"

import { useState, useEffect } from "react"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Kiểm tra authentication khi component mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Lắng nghe sự kiện logout từ axios interceptor
  useEffect(() => {
    const handleLogout = () => {
      setUser(null)
      setIsAuthenticated(false)
    }

    window.addEventListener("auth-logout", handleLogout)
    return () => window.removeEventListener("auth-logout", handleLogout)
  }, [])

  const checkAuthStatus = () => {
    try {
      const savedUser = localStorage.getItem("user")
      const savedToken = localStorage.getItem("token")

      if (savedUser && savedToken) {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    } finally {
      setIsLoading(false)
    }
  }

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  }
}
