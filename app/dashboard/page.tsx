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
  { month: 'Jan', employees: 45 },
  { month: 'Feb', employees: 48 },
  { month: 'Mar', employees: 52 },
  { month: 'Apr', employees: 55 },
  { month: 'May', employees: 58 },
  { month: 'Jun', employees: 62 },
]

const departmentData = [
  { name: 'Engineering', value: 35, fill: '#2563eb' },
  { name: 'Sales', value: 12, fill: '#60a5fa' },
  { name: 'HR', value: 8, fill: '#93c5fd' },
  { name: 'Operations', value: 7, fill: '#dbeafe' },
]

const leaveData = [
  { month: 'Jan', approved: 8, pending: 2, rejected: 1 },
  { month: 'Feb', approved: 12, pending: 3, rejected: 0 },
  { month: 'Mar', approved: 15, pending: 2, rejected: 1 },
  { month: 'Apr', approved: 10, pending: 4, rejected: 2 },
  { month: 'May', approved: 18, pending: 1, rejected: 0 },
  { month: 'Jun', approved: 14, pending: 3, rejected: 1 },
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
            label="Total Employees"
            value={stats.totalEmployees}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            icon={CheckCircle}
            label="Active Employees"
            value={stats.activeEmployees}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            icon={Calendar}
            label="On Leave"
            value={stats.onLeave}
            trend={{ value: 2, isPositive: false }}
          />
          <StatCard
            icon={TrendingUp}
            label="New This Month"
            value={stats.newThisMonth}
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee Growth Chart */}
          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Employee Growth
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
              Departments
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
            Leave Requests Overview
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
              Pending Leave Requests
            </p>
            <p className="text-2xl font-bold text-primary">12</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 p-4">
            <p className="text-sm font-medium text-foreground mb-2">
              Attendance Issues
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">8</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-4">
            <p className="text-sm font-medium text-foreground mb-2">
              Payroll Ready
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">Yes</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
