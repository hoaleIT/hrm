'use client'

import { useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/client'
import { DashboardLayout } from '@/components/dashboard-layout'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Clock, LogIn, LogOut } from 'lucide-react'

interface AttendanceRecord {
  id: string
  employee_id: string
  date: string
  check_in?: string
  check_out?: string
  status: 'present' | 'late' | 'absent' | 'leave'
  notes?: string
  employee?: { full_name: string }
}

interface Employee {
  id: string
  full_name: string
  employee_code: string
  email: string
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch employees
      const { data: empData } = await supabase
        .from('employees')
        .select('id, full_name, employee_code, email')

      setEmployees(empData || [])

      // Fetch attendance
      const { data: attData } = await supabase
        .from('attendance')
        .select(`
          *,
          employee:employee_id(full_name)
        `)
        .order('date', { ascending: false })

      setAttendance(attData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async (employeeId: string) => {
    try {
      const now = new Date()

      console.log('employeeId:', employeeId)
      console.log('selectedDate:', selectedDate)

      const { data, error } = await supabase
        .from('attendance')
        .insert([
          {
            employee_id: employeeId,
            date: selectedDate,
            check_in: now.toISOString(),
            status: now.getHours() > 9 ? 'late' : 'present',
          },
        ])
        .select()

      console.log('data:', data)

      if (error) {
        console.error('Supabase Error:', error)
        alert(error.message)
        return
      }

      await fetchData()
    } catch (error) {
      console.error(error)
    }
  }

  const handleCheckOut = async (recordId: string) => {
    try {
      const now = new Date()
      const { error } = await supabase
        .from('attendance')
        .update({ check_out: now.toISOString() })
        .eq('id', recordId)

      if (error) throw error
      await fetchData()
    } catch (error) {
      console.error('Error checking out:', error)
    }
  }

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '-'
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const statusColors = {
    present: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    late: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    absent: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    leave: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  }

  const todayAttendance = attendance.filter(a => a.date === selectedDate)

  const columns = [
    {
      key: 'date' as const,
      label: 'Date',
      sortable: true,
    },
    {
      key: 'employee_id' as const,
      label: 'Employee',
      render: (value: string, row: AttendanceRecord) => row.employee?.full_name || '-',
    },
    {
      key: 'check_in' as const,
      label: 'Check In',
      render: (value: string) => formatTime(value),
    },
    {
      key: 'check_out' as const,
      label: 'Check Out',
      render: (value: string) => formatTime(value),
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors]}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (value: string, row: AttendanceRecord) => (
        <div className="flex gap-2">
          {!row.check_in && (
            <Button
              onClick={() => handleCheckIn(row.employee_id)}
              size="sm"
              className="flex items-center gap-1"
            >
              <LogIn size={14} />
              Check In
            </Button>
          )}
          {row.check_in && !row.check_out && (
            <Button
              onClick={() => handleCheckOut(row.id)}
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <LogOut size={14} />
              Check Out
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground mt-1">Manage employee attendance and check-ins</p>
        </div>

        {/* Quick Check-in Section */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock size={20} />
            Quick Check-In
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Select Employee</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg"
              >
                <option value="">Choose employee...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name} ({emp.employee_code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={() => selectedEmployee && handleCheckIn(selectedEmployee)}
            disabled={!selectedEmployee}
            className="flex items-center gap-2"
          >
            <LogIn size={18} />
            Check In
          </Button>
        </div>

        {/* Attendance Records */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Attendance Records</h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={attendance}
              searchPlaceholder="Search by employee..."
              searchableFields={['date']}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
