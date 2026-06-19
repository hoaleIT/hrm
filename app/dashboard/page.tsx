'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DashboardLayout } from '@/components/dashboard-layout'
import { StatCard } from '@/components/stat-card'
import { Users, Clock, Calendar, TrendingUp, DollarSign, CheckCircle } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Mock data for charts
const employeeGrowthData = [
  { month: 'Tháng 1', employees: 45 },
  { month: 'Tháng 2', employees: 48 },
  { month: 'Tháng 3', employees: 52 },
  { month: 'Tháng 4', employees: 55 },
  { month: 'Tháng 5', employees: 58 },
  { month: 'Tháng 6', employees: 62 },
]

const departmentData = [
  { name: 'Kỹ thuật', value: 35, fill: '#2563eb' },
  { name: 'Bán hàng', value: 12, fill: '#60a5fa' },
  { name: 'Nhân sự', value: 8, fill: '#93c5fd' },
  { name: 'Vận hành', value: 7, fill: '#dbeafe' },
]

const leaveData = [
  { month: 'Tháng 1', approved: 8, pending: 2, rejected: 1 },
  { month: 'Tháng 2', approved: 12, pending: 3, rejected: 0 },
  { month: 'Tháng 3', approved: 15, pending: 2, rejected: 1 },
  { month: 'Tháng 4', approved: 10, pending: 4, rejected: 2 },
  { month: 'Tháng 5', approved: 18, pending: 1, rejected: 0 },
  { month: 'Tháng 6', approved: 14, pending: 3, rejected: 1 },
]

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeave: 0,
    newThisMonth: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: employees } = await supabase
          .from('employees')
          .select('*', { count: 'exact' })

        const activeCount = employees?.filter(e => e.status === 'active').length || 0
        const onLeaveCount = employees?.filter(e => e.status === 'on_leave').length || 0
        
        // Mock new employees this month
        const newCount = employees?.filter(e => {
          const startDate = new Date(e.start_date)
          const now = new Date()
          return startDate.getMonth() === now.getMonth() && 
                 startDate.getFullYear() === now.getFullYear()
        }).length || 0

        setStats({
          totalEmployees: employees?.length || 0,
          activeEmployees: activeCount,
          onLeave: onLeaveCount,
          newThisMonth: newCount,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Tổng Nhân Viên"
            value={stats.totalEmployees}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            icon={CheckCircle}
            label="Nhân Viên Hoạt Động"
            value={stats.activeEmployees}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            icon={Calendar}
            label="Nghỉ phép"
            value={stats.onLeave}
            trend={{ value: 2, isPositive: false }}
          />
          <StatCard
            icon={TrendingUp}
            label="Mới Tháng Này"
            value={stats.newThisMonth}
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee Growth Chart */}
          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Tăng trưởng nhân viên
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={employeeGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="employees"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--primary)', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Department Distribution */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Phân bố phòng ban
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Requests Chart */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Tổng Quan Yêu Cầu Nghỉ Phép
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leaveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="approved" fill="#10b981" />
              <Bar dataKey="pending" fill="#f59e0b" />
              <Bar dataKey="rejected" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/10 rounded-lg border border-primary/20 p-4">
            <p className="text-sm font-medium text-foreground mb-2">
              Yêu Cầu Nghỉ Phép Đang Chờ
            </p>
            <p className="text-2xl font-bold text-primary">12</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 p-4">
            <p className="text-sm font-medium text-foreground mb-2">
              Sự Cố Thời Gian Làm Việc
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">8</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-4">
            <p className="text-sm font-medium text-foreground mb-2">
              Lương và Thanh toán Chờ Xử Lý
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">Yes</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
