'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DashboardLayout } from '@/components/dashboard-layout'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Plus, X, Check, XCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'


interface LeaveRequest {
  id: string
  employee_id: string
  leave_type: string
  start_date: string
  end_date: string
  reason?: string
  status: 'pending' | 'approved' | 'rejected'
  reviewed_by?: string
  reviewed_at?: string
  comments?: string
  employee?: { full_name: string }
  reviewer?: { full_name: string }
}

interface Employee {
  id: string
  full_name: string
  employee_code: string
}

export default function LeaveRequestsPage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const supabase = createClient()
  const { register, handleSubmit, reset } = useForm<Partial<LeaveRequest>>()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const { data: empData } = await supabase
        .from('employees')
        .select('id, full_name, employee_code')

      setEmployees(empData || [])

      const { data: reqData, error: reqError } = await supabase
        .from('leave_requests')
        .select(`
          *,
          employee:employee_id(full_name)
        `)
        .order('start_date', { ascending: false })

      console.log('Leave Requests:', reqData)
      console.log('Fetch Error:', reqError)

      if (reqError) throw reqError

      setLeaveRequests(reqData || [])

    } catch (error) {
      console.error('Có lỗi xảy ra:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddRequest = () => {
    setSelectedRequest(null)
    reset()
    setIsDialogOpen(true)
  }

  const handleApprove = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId)

      if (error) throw error
      await fetchData()
    } catch (error) {
      console.error('Có lỗi xảy ra khi duyệt yêu cầu:', error)
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId)

      if (error) throw error
      await fetchData()
    } catch (error) {
      console.error('Có lỗi xảy ra khi từ chối yêu cầu:', error)
    }
  }

  const handleSubmitRequest = async (data: Partial<LeaveRequest>) => {
  console.log('Submit clicked')
  console.log(data)

  try {
    const result = await supabase
      .from('leave_requests')
      .insert([
        {
          employee_id: data.employee_id,
          leave_type: data.leave_type,
          start_date: data.start_date,
          end_date: data.end_date,
          reason: data.reason,
          status: 'pending',
        },
])
.select()
    console.log('Result:', result)

    if (result.error) {
      alert(result.error.message)
      console.error(result.error)
      return
    }

    alert('Thành công')
    await fetchData()
    setIsDialogOpen(false)
  } catch (err) {
    console.error('Catch error:', err)
    alert('Catch error')
  }
}
  const statusColors = {
  pending:
    'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  approved:
    'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  rejected:
    'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  }
  const statusLabels = {
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
  }

  const columns = [
    {
      key: 'employee_id' as const,
      label: 'Employee',
      render: (value: string, row: LeaveRequest) => row.employee?.full_name || '-',
      sortable: true,
    },
    {
      key: 'leave_type' as const,
      label: 'Leave Type',
      
      sortable: true,

    },
    {
      key: 'start_date' as const,
      label: 'Ngày Bắt Đầu',
      render: (value: string) =>
        new Date(value).toLocaleDateString('vi-VN'),
    },
    {
      key: 'end_date' as const,
      label: 'Ngày Kết Thúc',
      render: (value: string) =>
        new Date(value).toLocaleDateString('vi-VN'),
    },
    {
      key: 'reason' as const,
      label: 'Reason',
    },
    {
      key: 'status' as const,
      label: 'Trạng Thái',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[value as keyof typeof statusColors]
          }`}
        >
          {statusLabels[value as keyof typeof statusLabels]}
        </span>
      ),
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (value: string, row: LeaveRequest) => (
        <div className="flex gap-2">
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => handleApprove(row.id)}
                className="p-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded text-green-600 dark:text-green-400"
                title="Approve"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => handleReject(row.id)}
                className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400"
                title="Reject"
              >
                <XCircle size={16} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Yêu Cầu Nghỉ Phép</h1>
            <p className="text-muted-foreground mt-1">Quản lý yêu cầu nghỉ phép của nhân viên</p>
          </div>
          <Button onClick={handleAddRequest} className="flex items-center gap-2">
            <Plus size={20} />
            Yêu Cầu Nghỉ Phép
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={leaveRequests}
            searchPlaceholder="Tìm kiếm theo nhân viên..."
            searchableFields={['leave_type']}
          />
        )}

       {/* Dialog */}
       
      {/* Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedRequest
                      ? 'Chỉnh Sửa Yêu Cầu Nghỉ Phép'
                      : 'Tạo Yêu Cầu Nghỉ Phép'}
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Điền thông tin nghỉ phép của nhân viên
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
                  onSubmit={handleSubmit(handleSubmitRequest)}
                  className="space-y-5"
                >
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
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

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Loại Nghỉ Phép *
                    </label>

                    <select
                      {...register('leave_type', { required: true })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn loại nghỉ</option>
                      <option value="vacation">Nghỉ phép năm</option>
                      <option value="sick">Nghỉ ốm</option>
                      <option value="personal">Nghỉ cá nhân</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Ngày Bắt Đầu *
                      </label>

                      <input
                        type="date"
                        lang="vi"
                        placeholder="dd/mm/yyyy"
                        {...register('start_date', { required: true })}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Ngày Kết Thúc *
                      </label>

                      <input
                        type="date"
                        lang="vi"
                        placeholder="dd/mm/yyyy"
                        {...register('end_date', { required: true })}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Lý Do Nghỉ Phép
                    </label>

                    <textarea
                      {...register('reason')}
                      rows={4}
                      placeholder="Nhập lý do nghỉ phép..."
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
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
                      {selectedRequest ? 'Cập Nhật' : 'Gửi Yêu Cầu'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
```

    
      </div>
    </DashboardLayout>
  )
}
