"use client"

import { useState, useCallback } from "react"

export function useNotification() {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((notification) => {
    const id = Date.now()
    const newNotification = {
      id,
      type: "info", // info, success, warning, error
      title: "",
      message: "",
      duration: 5000,
      ...notification,
    }

    setNotifications((prev) => [...prev, newNotification])

    // Auto remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Helper methods
  const showSuccess = useCallback(
    (message, title = "Thành công") => {
      return addNotification({ type: "success", title, message })
    },
    [addNotification],
  )

  const showError = useCallback(
    (message, title = "Lỗi") => {
      return addNotification({ type: "error", title, message, duration: 7000 })
    },
    [addNotification],
  )

  const showWarning = useCallback(
    (message, title = "Cảnh báo") => {
      return addNotification({ type: "warning", title, message })
    },
    [addNotification],
  )

  const showInfo = useCallback(
    (message, title = "Thông tin") => {
      return addNotification({ type: "info", title, message })
    },
    [addNotification],
  )

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
