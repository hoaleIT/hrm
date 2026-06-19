'use client'

import { usePathname } from 'next/navigation'
import { Bell, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

const pageNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/employees': 'Nhân viên',
  '/departments': 'Phòng ban',
  '/positions': 'Chức vụ',
  '/attendance': 'Chấm công',
  '/leave-requests': 'Đơn xin nghỉ phép',
  '/payroll': 'Bảng lương',
  '/settings': 'Cài đặt',
}

export function Header() {
  const pathname = usePathname()

  if (pathname?.startsWith('/auth')) {
    return null
  }

  const title = pageNames[pathname || ''] || 'Dashboard'

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Title */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        </div>

        {/* Right: Search, Notifications, User */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 bg-accent rounded-lg px-4 py-2">
            <Search size={18} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="bg-transparent outline-none text-sm text-foreground placeholder-muted-foreground w-32"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          {/* User Menu */}
          <Button variant="ghost" size="icon">
            <User size={20} />
          </Button>
        </div>
      </div>
    </header>
  )
}
