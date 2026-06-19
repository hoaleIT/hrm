'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DashboardLayout } from '@/components/dashboard-layout'
import { DataTable } from '@/components/data-table'
import { EmployeeDialog } from '@/components/employee-dialog'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import type { EmployeeFormData } from '@/components/employee-dialog'

interface Employee {
  id: string
  employee_code: string
  full_name: string
  email: string
  phone?: string
  gender?: string
  birth_date?: string
  address?: string
  department_id?: string
  position_id?: string
  salary?: number
  avatar_url?: string
  status: 'active' | 'inactive' | 'on_leave'
  start_date: string
  department?: { name: string }
  position?: { name: string }
}

interface Department {
  id: string
  name: string
}

interface Position {
  id: string
  name: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch employees with relations
      const { data: employeesData, error: empError } = await supabase
        .from('employees')
        .select(`
          *,
          department:department_id(id, name),
          position:position_id(id, name)
        `)

      if (empError) throw empError

      // Fetch departments
      const { data: deptsData, error: deptError } = await supabase
        .from('departments')
        .select('*')

      if (deptError) throw deptError

      // Fetch positions
      const { data: posData, error: posError } = await supabase
        .from('positions')
        .select('*')

      if (posError) throw posError

      setEmployees(employeesData || [])
      setDepartments(deptsData || [])
      setPositions(posData || [])
    } catch (err: any) {
      const errorMsg = err?.message || 'Đã có lỗi xảy ra khi tải dữ liệu'
      console.error('Có lỗi xảy ra:', err)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEmployee = () => {
    setSelectedEmployee(null)
    setIsDialogOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return

    try {
      setError(null)
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setEmployees(employees.filter(e => e.id !== id))
      alert('Employee deleted successfully')
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to delete employee'
      console.error('Có lỗi xảy ra:', err)
      setError(errorMsg)
      alert('Lỗi: ' + errorMsg)
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      setError(null)
      if (selectedEmployee) {
        // Update
        const { error } = await supabase
          .from('employees')
          .update(data)
          .eq('id', selectedEmployee.id)

        if (error) throw error
        alert('Nhân viên đã được cập nhật thành công')
      } else {
        // Create
        const { error } = await supabase
          .from('employees')
          .insert([data])

        if (error) throw error
        alert('Nhân viên đã được tạo thành công')
      }

      await fetchData()
      setIsDialogOpen(false)
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to save employee'
      console.error('Có lỗi xảy ra:', err)
      setError(errorMsg)
      alert('Lỗi: ' + errorMsg)
    }
  }

  const statusColors = {
    active: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    inactive: 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
    on_leave: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  }

  const columns = [
    {
      key: 'employee_code' as const,
      label: 'Mã Nhân Viên',
      sortable: true,
    },
    {
      key: 'full_name' as const,
      label: 'Tên',
      sortable: true,
    },
    {
      key: 'email' as const,
      label: 'Email',
      sortable: true,
    },
    {
      key: 'phone' as const,
      label: 'Số Điện Thoại',
    },
    {
      key: 'department_id' as const,
      label: 'Phòng Ban',
      render: (value: any, row: Employee) => row.department?.name || '-',
    },
    {
      key: 'position_id' as const,
      label: 'Chức Vụ',
      render: (value: any, row: Employee) => row.position?.name || '-',
    },
    {
      key: 'status' as const,
      label: 'Trạng Thái',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors]}`}>
          {value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'start_date' as const,
      label: 'Ngày Bắt Đầu',
      sortable: true,
    },
    {
      key: 'id' as const,
      label: 'Hành Động',
      render: (value: string, row: Employee) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditEmployee(row)}
            className="p-1 hover:bg-accent rounded transition-colors"
            title="Sửa"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDeleteEmployee(row.id)}
            className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400 transition-colors"
            title="Xóa"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 dark:text-red-400">Lỗi</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              ✕
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nhân Viên</h1>
            <p className="text-muted-foreground mt-1">
              Quản lý nhân viên trong tổ chức
            </p>
          </div>
          <Button onClick={handleAddEmployee} className="flex items-center gap-2">
            <Plus size={20} />
            Thêm Nhân Viên
          </Button>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={employees}
            searchPlaceholder="Tìm kiếm theo tên, email, hoặc mã..."
            searchableFields={['full_name', 'email', 'employee_code']}
          />
        )}

        {/* Dialog */}
        <EmployeeDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleSubmit}
          departments={departments}
          positions={positions}
          initialData={
            selectedEmployee
              ? {
                  employee_code: selectedEmployee.employee_code,
                  full_name: selectedEmployee.full_name,
                  email: selectedEmployee.email,
                  phone: selectedEmployee.phone ?? '',
                  gender: selectedEmployee.gender ?? '',
                  birth_date: selectedEmployee.birth_date ?? '',
                  address: selectedEmployee.address ?? '',
                  department_id: selectedEmployee.department_id,
                  position_id: selectedEmployee.position_id,
                  salary: selectedEmployee.salary,
                  start_date: selectedEmployee.start_date,
                  status: selectedEmployee.status,
                }
              : undefined
          }
        />
      </div>
    </DashboardLayout>
  )
}
