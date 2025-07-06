"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import { Search, Plus, Edit, Trash2, Monitor, Loader2 } from "lucide-react"
import { deviceService } from "../services/deviceService"

export default function DeviceManagement({ onShowNotification }) {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentDevice, setCurrentDevice] = useState(null)
  const [deviceForm, setDeviceForm] = useState({
    external_id: "",
    name: "",
    description: "",
  })

  useEffect(() => {
    loadDevices()
  }, [])

  const loadDevices = async (keyword = "") => {
    try {
      setLoading(true)
      const response = await deviceService.getDevices(keyword)
      if (response.success) {
        setDevices(response.data)
      }
    } catch (err) {
      onShowNotification?.(err.message, "Lỗi")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadDevices(searchKeyword)
  }

  const resetForm = () => {
    setDeviceForm({
      external_id: "",
      name: "",
      description: "",
    })
  }

  const handleCreateDevice = async () => {
    try {
      setLoading(true)
      const response = await deviceService.createDevice(deviceForm)
      if (response.success) {
        onShowNotification?.("Tạo thiết bị thành công!", "Thành công")
        setIsCreateDialogOpen(false)
        resetForm()
        loadDevices(searchKeyword)
      }
    } catch (err) {
      onShowNotification?.(err.message, "Lỗi")
    } finally {
      setLoading(false)
    }
  }

  const handleEditDevice = (device) => {
    setCurrentDevice(device)
    setDeviceForm({
      external_id: device.external_id,
      name: device.name || "",
      description: device.description || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateDevice = async () => {
    try {
      setLoading(true)
      const response = await deviceService.updateDevice(currentDevice.id, deviceForm)
      if (response.success) {
        onShowNotification?.(
          `Cập nhật thiết bị "${deviceForm.name || deviceForm.external_id}" thành công!`,
          "Thành công",
        )
        setIsEditDialogOpen(false)
        setCurrentDevice(null)
        resetForm()
        loadDevices(searchKeyword)
      }
    } catch (err) {
      onShowNotification?.(err.message, "Lỗi")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDevice = async (deviceId, deviceName) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa thiết bị "${deviceName}"?`)) return

    try {
      setLoading(true)
      const response = await deviceService.deleteDevice(deviceId)
      if (response.success) {
        onShowNotification?.(`Xóa thiết bị "${deviceName}" thành công!`, "Thành công")
        loadDevices(searchKeyword)
      }
    } catch (err) {
      onShowNotification?.(err.message, "Lỗi")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Monitor className="w-6 h-6" />
            Quản lý thiết bị
          </h1>
          <p className="text-gray-600 mt-1">Quản lý danh sách thiết bị trong hệ thống</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {devices.length} thiết bị
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách thiết bị</CardTitle>
          <CardDescription>Tìm kiếm và quản lý thiết bị hệ thống</CardDescription>
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
                  Tạo thiết bị
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tạo thiết bị mới</DialogTitle>
                  <DialogDescription>Nhập thông tin để tạo thiết bị mới</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="external_id">External ID *</Label>
                    <Input
                      id="external_id"
                      value={deviceForm.external_id}
                      onChange={(e) => setDeviceForm({ ...deviceForm, external_id: e.target.value })}
                      placeholder="Nhập External ID"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Tên thiết bị</Label>
                    <Input
                      id="name"
                      value={deviceForm.name}
                      onChange={(e) => setDeviceForm({ ...deviceForm, name: e.target.value })}
                      placeholder="Nhập tên thiết bị"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      value={deviceForm.description}
                      onChange={(e) => setDeviceForm({ ...deviceForm, description: e.target.value })}
                      placeholder="Nhập mô tả thiết bị"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button
                    onClick={handleCreateDevice}
                    disabled={loading || !deviceForm.external_id}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Tạo thiết bị
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Chỉnh sửa thiết bị</DialogTitle>
                <DialogDescription>Cập nhật thông tin thiết bị</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit_external_id">External ID *</Label>
                  <Input
                    id="edit_external_id"
                    value={deviceForm.external_id}
                    onChange={(e) => setDeviceForm({ ...deviceForm, external_id: e.target.value })}
                    placeholder="Nhập External ID"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_name">Tên thiết bị</Label>
                  <Input
                    id="edit_name"
                    value={deviceForm.name}
                    onChange={(e) => setDeviceForm({ ...deviceForm, name: e.target.value })}
                    placeholder="Nhập tên thiết bị"
                  />
                </div>
                <div>
                  <Label htmlFor="edit_description">Mô tả</Label>
                  <Textarea
                    id="edit_description"
                    value={deviceForm.description}
                    onChange={(e) => setDeviceForm({ ...deviceForm, description: e.target.value })}
                    placeholder="Nhập mô tả thiết bị"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Hủy
                </Button>
                <Button
                  onClick={handleUpdateDevice}
                  disabled={loading || !deviceForm.external_id}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Cập nhật
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">External ID</TableHead>
                  <TableHead className="font-semibold">Tên thiết bị</TableHead>
                  <TableHead className="font-semibold">Mô tả</TableHead>
                  <TableHead className="font-semibold">Cập nhật lần cuối</TableHead>
                  <TableHead className="font-semibold text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tải...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : devices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchKeyword ? "Không tìm thấy thiết bị nào" : "Chưa có thiết bị nào"}
                    </TableCell>
                  </TableRow>
                ) : (
                  devices.map((device) => (
                    <TableRow key={device.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{device.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {device.external_id}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <Monitor className="w-4 h-4 text-white" />
                          </div>
                          {device.name || <span className="text-gray-400 italic">Chưa đặt tên</span>}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={device.description}>
                          {device.description || <span className="text-gray-400 italic">Không có mô tả</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{formatDate(device.updated_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditDevice(device)}
                            disabled={loading}
                            title="Chỉnh sửa thiết bị"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteDevice(device.id, device.name || device.external_id)}
                            disabled={loading}
                            title="Xóa thiết bị"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
