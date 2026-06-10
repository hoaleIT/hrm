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

      const { data: reqData } = await supabase
        .from('leave_requests')
        .select(`
          *,
          employee:employee_id(full_name),
          reviewer:reviewed_by(full_name)
        `)
        .order('start_date', { ascending: false })

      setLeaveRequests(reqData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
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
      console.error('Error approving request:', error)
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
      console.error('Error rejecting request:', error)
    }
  }

  const handleSubmitRequest = async (data: Partial<LeaveRequest>) => {
    try {
      if (selectedRequest) {
        const { error } = await supabase
          .from('leave_requests')
          .update(data)
          .eq('id', selectedRequest.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('leave_requests')
          .insert([{ ...data, status: 'pending' }])
        if (error) throw error
      }
      await fetchData()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving request:', error)
    }
  }

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    approved: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    rejected: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
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
      label: 'Start Date',
      sortable: true,
    },
    {
      key: 'end_date' as const,
      label: 'End Date',
      sortable: true,
    },
    {
      key: 'reason' as const,
      label: 'Reason',
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
            <h1 className="text-3xl font-bold text-foreground">Leave Requests</h1>
            <p className="text-muted-foreground mt-1">Manage employee leave requests</p>
          </div>
          <Button onClick={handleAddRequest} className="flex items-center gap-2">
            <Plus size={20} />
            Request Leave
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={leaveRequests}
            searchPlaceholder="Search by employee..."
            searchableFields={['leave_type']}
          />
        )}

        {/* Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedRequest ? 'Edit Leave Request' : 'Request Leave'}
                </h2>
                <button onClick={() => setIsDialogOpen(false)} className="p-1 hover:bg-accent rounded">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(handleSubmitRequest)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Employee *</label>
                  <select
                    {...register('employee_id', { required: true })}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.full_name} ({emp.employee_code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Leave Type *</label>
                  <select
                    {...register('leave_type', { required: true })}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="">Select type</option>
                    <option value="vacation">Vacation</option>
                    <option value="sick">Sick Leave</option>
                    <option value="personal">Personal</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Start Date *</label>
                  <input
                    type="date"
                    {...register('start_date', { required: true })}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">End Date *</label>
                  <input
                    type="date"
                    {...register('end_date', { required: true })}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Reason</label>
                  <textarea
                    {...register('reason')}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{selectedRequest ? 'Update' : 'Submit'}</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
