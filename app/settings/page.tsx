'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Settings, Moon, Sun } from 'lucide-react'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Get theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cài đặt</h1>
          <p className="text-muted-foreground mt-1">Quản lý tài khoản và tùy chọn</p>
        </div>

        {/* Account Information */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Thông tin tài khoản</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Email
              </label>
              <p className="text-foreground">{user?.email || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Mã người dùng
              </label>
              <p className="text-foreground font-mono text-sm">{user?.id || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Đã đăng ký vào ngày
              </label>
              <p className="text-foreground">
                {user?.created_at 
                  ? new Date(user.created_at).toLocaleDateString()
                  : '-'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Tùy chọn</h2>
          
          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Sun size={20} className="text-yellow-500" />
                ) : (
                  <Moon size={20} className="text-blue-400" />
                )}
                <div>
                  <p className="font-medium text-foreground">Chế độ tối</p>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'light' ? 'Chế độ sáng đã được bật' : 'Chế độ tối đã được bật'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">Thông báo qua email</p>
                <p className="text-sm text-muted-foreground">
                  Nhận cập nhật về các yêu cầu nghỉ phép và chấm công
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-6 h-6 rounded" />
            </div>

            {/* Language */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">Ngôn ngữ</p>
                <p className="text-sm text-muted-foreground">
                  Chọn ngôn ngữ ưa thích của bạn
                </p>
              </div>
              <select className="px-3 py-2 border border-border rounded-lg bg-background">
                <option>Tiếng Việt</option>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Bảo mật</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">Đổi mật khẩu</p>
                <p className="text-sm text-muted-foreground">
                  Cập nhật mật khẩu tài khoản định kỳ
                </p>
              </div>
              <Button variant="outline">Đổi</Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">Xác thực hai lớp</p>
                <p className="text-sm text-muted-foreground">
                  Thêm một lớp bảo mật bổ sung
                </p>
              </div>
              <Button variant="outline">Bật</Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">Sessions đang hoạt động</p>
                <p className="text-sm text-muted-foreground">
                  Xem và quản lý các phiên đang hoạt động
                </p>
              </div>
              <Button variant="outline">Xem</Button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Giới thiệu</h2>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ứng dụng</span>
              <span className="text-foreground font-medium">HRM System </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngày xây dựng</span>
              <span className="text-foreground font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trạng thái</span>
              <span className="text-foreground font-medium text-green-600">Đang chạy</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-6">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-4">Nguy hiểm</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-red-900/10">
              <div>
                <p className="font-medium text-red-700 dark:text-red-400">Xóa Tài Khoản</p>
                <p className="text-sm text-red-600 dark:text-red-500">
                  Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
                </p>
              </div>
              <Button variant="destructive">Xóa</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
