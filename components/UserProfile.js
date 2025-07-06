"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { CheckCircle, User, Shield } from "lucide-react"

export default function UserProfile({ user, onLogout }) {
  const handleLogout = () => {
    onLogout()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Đăng nhập thành công!</CardTitle>
          <CardDescription>Chào mừng bạn quay trở lại</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Tên đăng nhập</p>
                <p className="font-semibold">{user.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Vai trò</p>
                <p className="font-semibold capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent">
            Đăng xuất
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
