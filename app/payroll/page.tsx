'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DashboardLayout } from '@/components/dashboard-layout'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Plus, Download, X } from 'lucide-react'
import { useForm } from 'react-hook-form'

interface Payroll {
  id: string
  employee_id: string
  month: string
  base_salary: number
  allowance: number
  bonus: number
  deduction: number
  total_salary: number
  status: 'draft' | 'processed' | 'paid'
  employee?: {
    full_name: string
  }
}

interface Employee {
  id: string
  full_name: string
  employee_code: string
  salary?: number
}

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null)
  const supabase = createClient()
  const { register, handleSubmit, reset, watch } = useForm<Partial<Payroll>>()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const { data: empData } = await supabase
        .from('employees')
        .select('id, full_name, employee_code, salary')

      setEmployees(empData || [])

      const { data: payData, error: payError } = await supabase
        .from('payrolls')
        .select(`
          *,
          employee:employees!payrolls_employee_id_fkey(full_name)
        `)
        .order('month', { ascending: false })

      console.log('Payroll Data:', payData)
      console.log('Payroll Error:', payError)

      if (payError) throw payError

      setPayrolls(payData || [])

console.log('PAYROLL DATA:', payData)
console.log('PAYROLL ERROR:', payError)

if (payError) {
  throw payError
}

setPayrolls(payData || [])

     
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPayroll = () => {
    setSelectedPayroll(null)
    reset()
    setIsDialogOpen(true)
  }

  const handleSubmitPayroll = async (data: Partial<Payroll>) => {
  try {
    const total =
      Number(data.base_salary || 0) +
      Number(data.allowance || 0) +
      Number(data.bonus || 0) -
      Number(data.deduction || 0)

    const payload = {
      employee_id: data.employee_id,
      month: `${data.month}-01`,
      base_salary: Number(data.base_salary || 0),
      allowance: Number(data.allowance || 0),
      bonus: Number(data.bonus || 0),
      deduction: Number(data.deduction || 0),
      total_salary: total,
      status: data.status || 'draft',
    }

    console.log('Payload:', payload)

    if (selectedPayroll) {
      const { error } = await supabase
        .from('payrolls')
        .update(payload)
        .eq('id', selectedPayroll.id)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('payrolls')
        .insert([payload])

      if (error) throw error
    }

    alert('Lưu thành công')

    await fetchData()
    setIsDialogOpen(false)
  } catch (error) {
    console.error('Payroll Error:', error)
    alert(JSON.stringify(error))
  }
}

  // const statusColors = {
  //   draft: 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
  //   processed: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  //   paid: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  // }
  const statusColors = {
    draft:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    processed:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    paid:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  }

  // const formatCurrency = (value: number) => {
  //   return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  // }
  const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

  const columns = [
    {
      key: 'employee_id' as const,
      label: 'Nhân viên',
      render: (value: string, row: Payroll) => row.employee?.full_name || '-',
      sortable: true,
    },
    {
      key: 'month' as const,
      label: 'Tháng',
      sortable: true,
    },
    {
      key: 'base_salary' as const,
      label: 'Lương cơ bản',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'allowance' as const,
      label: 'Trợ cấp',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'bonus' as const,
      label: 'Thưởng',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'deduction' as const,
      label: 'Giảm trừ',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'total_salary' as const,
      label: 'Tổng lương',
      render: (value: number) => (
        <span className="font-semibold">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'status' as const,
      label: 'Trạng thái',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors]}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'id' as const,
      label: 'Hành động',
      render: (value: string, row: Payroll) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedPayroll(row)
              reset(row)
              setIsDialogOpen(true)
            }}
            className="p-1 hover:bg-accent rounded"
          >
            Sửa
          </button>
          <button
            onClick={() => window.print()}
            className="p-1 hover:bg-accent rounded"
          >
            <Download size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lương và Thanh toán</h1>
            <p className="text-muted-foreground mt-1">Quản lý lương và thanh toán nhân viên</p>
          </div>
          <Button onClick={handleAddPayroll} className="flex items-center gap-2">
            <Plus size={20} />
            Thêm Lương và Thanh toán
          </Button>
        </div> */}
        <div className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold text-foreground">
      Quản Lý Lương
    </h1>
    <p className="text-muted-foreground mt-1">
      Quản lý bảng lương và thanh toán nhân viên
    </p>
  </div>

  <Button
    onClick={handleAddPayroll}
    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
  >
    <Plus size={18} />
    Tạo Bảng Lương
  </Button>
</div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={payrolls}
            searchPlaceholder="Tìm kiếm bảng lương..."
            searchableFields={['month']}
          />
        )}

        {/* Dialog */}
        {isDialogOpen && (
  <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md p-4">
    {/* <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"> */}
       <div className="flex min-h-full items-center justify-center">
       <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"> 
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div>
            <h2 className="text-xl font-bold text-white">
              {selectedPayroll
                ? 'Chỉnh Sửa Bảng Lương'
                : 'Tạo Bảng Lương'}
            </h2>

            <p className="text-blue-100 text-sm mt-1">
              Quản lý thông tin lương nhân viên
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsDialogOpen(false)}
            className="p-2 rounded-lg text-white hover:bg-white/20 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form
            onSubmit={handleSubmit(handleSubmitPayroll)}
            className="space-y-5"
          >

            {/* Employee */}
            <div>
              <label className="block mb-2 text-sm font-semibold">
                Nhân Viên *
              </label>

              <select
                {...register('employee_id', { required: true })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn nhân viên</option>

                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name} ({emp.employee_code})
                  </option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div>
              <label className="block mb-2 text-sm font-semibold">
                Tháng *
              </label>

              <input
                type="month"
                {...register('month', { required: true })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Lương Cơ Bản
                </label>

                <input
                  type="number"
                  {...register('base_salary', {
                    valueAsNumber: true,
                    required: true,
                  })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Phụ Cấp
                </label>

                <input
                  type="number"
                  {...register('allowance', {
                    valueAsNumber: true,
                  })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Thưởng
                </label>

                <input
                  type="number"
                  {...register('bonus', {
                    valueAsNumber: true,
                  })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Khấu Trừ
                </label>

                <input
                  type="number"
                  {...register('deduction', {
                    valueAsNumber: true,
                  })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm"
                />
              </div>
            </div>

          {/* Total Salary */}
          <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex justify-between">
              <span className="font-medium">
                Tổng Lương:
              </span>

              <span className="font-bold text-blue-600 text-lg">
                {(
                  (Number(watch('base_salary')) || 0) +
                  (Number(watch('allowance')) || 0) +
                  (Number(watch('bonus')) || 0) -
                  (Number(watch('deduction')) || 0)
                ).toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 text-sm font-semibold">
              Trạng Thái
            </label>

            <select
              {...register('status')}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm"
            >
              <option value="draft">Nháp</option>
              <option value="processed">Đã xử lý</option>
              <option value="paid">Đã thanh toán</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-xl"
            >
              Hủy
            </Button>

            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
            >
              {selectedPayroll
                ? 'Cập Nhật'
                : 'Tạo Bảng Lương'}
            </Button>
          </div>

        </form>
      </div>
      </div>
    </div>
  </div>
)}
      </div>
    </DashboardLayout>
  )
}
