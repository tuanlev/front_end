"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, RotateCcw, Trash2, Users, Loader2 } from "lucide-react"
import { userService } from "../services/userService"
import { deviceService } from "../services/deviceService"

export default function UserManagement({ onShowNotification }) {
  const [users, setUsers] = useState([])
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    device_id: "",
  })

  const [editingDeviceUserId, setEditingDeviceUserId] = useState(null)
  const [selectedDeviceId, setSelectedDeviceId] = useState("")

  useEffect(() => {
    loadUsers()
    loadDevices()
  }, [])

  const loadUsers = async (keyword = "") => {
    try {
      setLoading(true)
      const response = await userService.getUsers(keyword)
      if (response.success) {
        setUsers(response.data)
      }
    } catch (err) {
      onShowNotification?.(err.message, "Lỗi")
    } finally {
      setLoading(false)
    }
  }

  const loadDevices = async () => {
    try {
      const response = await deviceService.getDevices()
      if (response.success) {
        setDevices(response.data)
      }
    } catch (err) {
      console.error("Error loading devices:", err)
    }
  }

  const handleSearch = () => {
    loadUsers(searchKeyword)
  }

  const handleCreateUser = async () => {
    try {
      setLoading(true)
      const userData = {
        ...newUser,
        device_id: newUser.device_id || null,
      }
      const response = await userService.createUser(userData)
      if (response.success) {
        onShowNotification?.("Tạo người dùng thành công!", "Thành công")
        setIsCreateDialogOpen(false)
        setNewUser({ username: "", password: "", device_id: "" })
        loadUsers(searchKeyword)
      }
    } catch (err) {
      onShowNotification?.(err.message, "Lỗi")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (userId, username) => {
    if (!confirm(`Bạn có chắc chắn muốn reset mật khẩu cho người dùng "${username}"?`)) return

    try {
      setLoading(true)
      const response = await userService.resetPassword(userId)
      if (response.success) {
        onShowNotification?.(`Reset mật khẩu cho "${username}" thành công!`, "Thành công")
        loadUsers(searchKeyword)
      }
    } catch (err) {
      onShowNotification?.(err.message, "Lỗi")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId, username) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa người dùng "${username}"?`)) return

    try {
      setLoading(true)
      const response = await userService.deleteUser(userId)
      if (response.success) {
        onShowNotification?.(`Xóa người dùng "${username}" thành công!`, "Thành công")
        loadUsers(searchKeyword)
      }
    } catch (err) {
      onShowNotification?.(err.message, "Lỗi")
    } finally {
      setLoading(false)
    }
  }

  const handleDeviceChange = (userId, currentDeviceId) => {
    setEditingDeviceUserId(userId)
    setSelectedDeviceId(currentDeviceId || "")
  }

  const handleSaveDeviceChange = async (userId, username) => {
    try {
      setLoading(true)
      const response = await userService.changeDevice(userId, selectedDeviceId || null)
      if (response.success) {
        onShowNotification?.(`Thay đổi thiết bị cho "${username}" thành công!`, "Thành công")
        setEditingDeviceUserId(null)
        setSelectedDeviceId("")
        loadUsers(searchKeyword)
      }
    } catch (err) {
      onShowNotification?.(err.message, "Lỗi")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelDeviceChange = () => {
    setEditingDeviceUserId(null)
    setSelectedDeviceId("")
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  const getDeviceInfo = (deviceId) => {
    if (!deviceId) return null
    const device = devices.find((d) => d.id === deviceId)
    return device
  }

  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Quản lý người dùng
          </h1>
          <p className="text-gray-600 mt-1">Quản lý danh sách người dùng trong hệ thống</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {users.length} người dùng
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>Tìm kiếm và quản lý tài khoản người dùng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search và Create */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2 flex-1">
              <Input
                placeholder="Tìm kiếm theo tên..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="max-w-sm"
              />
              <Button onClick={handleSearch} disabled={loading} variant="outline">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo người dùng
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tạo người dùng mới</DialogTitle>
                  <DialogDescription>Nhập thông tin để tạo tài khoản người dùng mới</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Tên đăng nhập *</Label>
                    <Input
                      id="username"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      placeholder="Nhập tên đăng nhập"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Mật khẩu *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="Nhập mật khẩu"
                    />
                  </div>
                  <div>
                    <Label htmlFor="device">Thiết bị</Label>
                    <select
                      id="device"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newUser.device_id}
                      onChange={(e) => setNewUser({ ...newUser, device_id: e.target.value })}
                    >
                      <option value="">Chưa gán thiết bị</option>
                      {devices.map((device) => (
                        <option key={device.id} value={device.id}>
                          {device.name || device.external_id}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button
                    onClick={handleCreateUser}
                    disabled={loading || !newUser.username || !newUser.password}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Tạo người dùng
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Tên đăng nhập</TableHead>
                  <TableHead className="font-semibold">Thiết bị</TableHead>
                  <TableHead className="font-semibold">Cập nhật lần cuối</TableHead>
                  <TableHead className="font-semibold text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tải...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      {searchKeyword ? "Không tìm thấy người dùng nào" : "Chưa có người dùng nào"}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          {user.username}
                        </div>
                      </TableCell>
                      <TableCell>
                        {editingDeviceUserId === user.id ? (
                          <div className="space-y-2">
                            <select
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              value={selectedDeviceId}
                              onChange={(e) => setSelectedDeviceId(e.target.value)}
                              disabled={loading}
                            >
                              <option value="">Chưa gán thiết bị</option>
                              {devices.map((device) => (
                                <option key={device.id} value={device.id}>
                                  {device.name || device.external_id}
                                </option>
                              ))}
                            </select>
                            {selectedDeviceId && (
                              <div className="text-xs text-gray-500">
                                {(() => {
                                  const device = getDeviceInfo(selectedDeviceId)
                                  return device ? (
                                    <div>
                                      <div className="font-medium">{device.name || "Chưa đặt tên"}</div>
                                      <div className="text-gray-400">ID: {device.external_id}</div>
                                    </div>
                                  ) : null
                                })()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
                            onClick={() => handleDeviceChange(user.id, user.device_id)}
                            title="Click để thay đổi thiết bị"
                          >
                            {(() => {
                              const device = getDeviceInfo(user.device_id)
                              return device ? (
                                <div>
                                  <Badge variant="secondary" className="mb-1">
                                    {device.name || device.external_id}
                                  </Badge>
                                  <div className="text-xs text-gray-500">ID: {device.external_id}</div>
                                </div>
                              ) : (
                                <span className="text-gray-400 italic">Chưa gán - Click để chọn</span>
                              )
                            })()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600">{formatDate(user.updated_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          {editingDeviceUserId === user.id ? (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleSaveDeviceChange(user.id, user.username)}
                                disabled={loading}
                                title="Lưu thay đổi"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelDeviceChange}
                                disabled={loading}
                                title="Hủy thay đổi"
                              >
                                Hủy
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResetPassword(user.id, user.username)}
                                disabled={loading}
                                title="Reset mật khẩu"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(user.id, user.username)}
                                disabled={loading}
                                title="Xóa người dùng"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
