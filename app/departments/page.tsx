'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DashboardLayout } from '@/components/dashboard-layout'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'

interface Department {
  id: string
  name: string
  description?: string
  manager_id?: string
  created_at?: string
  updated_at?: string
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDept, setSelectedDept] = useState<Department | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  const supabase = createClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Department>()

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('departments')
        .select('*')

      if (error) throw error
      setDepartments(data || [])
    } catch (err: any) {
      const msg = err?.message || 'Failed to fetch departments'
      console.error('Có lỗi xảy ra:', err)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDept = () => {
    setSelectedDept(null)
    reset()
    setError(null)
    setIsDialogOpen(true)
  }

  const handleEditDept = (dept: Department) => {
    setSelectedDept(dept)
    reset(dept)
    setError(null)
    setIsDialogOpen(true)
  }

  const handleDeleteDept = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) return

    try {
      setError(null)
      const { error } = await supabase.from('departments').delete().eq('id', id)
      if (error) throw error
      setDepartments(departments.filter(d => d.id !== id))
      alert('Phòng ban đã được xóa thành công')
    } catch (err: any) {
      const msg = err?.message || 'Failed to delete department'
      console.error('Lỗi:', err)
      setError(msg)
      alert('Lỗi: ' + msg)
    }
  }

  const handleSubmitDept = async (data: Department) => {
    try {
      setError(null)
      setDialogLoading(true)
      if (selectedDept) {
        const { error } = await supabase
          .from('departments')
          .update(data)
          .eq('id', selectedDept.id)
        if (error) throw error
        alert('Phòng ban đã được cập nhật thành công')
      } else {
        const { error } = await supabase.from('departments').insert([data])
        if (error) throw error
        alert('Phòng ban đã được tạo thành công')
      }
      await fetchDepartments()
      setIsDialogOpen(false)
    } catch (err: any) {
      const msg = err?.message || 'Failed to save department'
      console.error('Có lỗi xảy ra khi lưu phòng ban:', err)
      setError(msg)
      alert('Lỗi: ' + msg)
    } finally {
      setDialogLoading(false)
    }
  }

  const columns = [
    { key: 'name' as const, label: 'Tên Phòng Ban', sortable: true },
    { key: 'description' as const, label: 'Mô Tả' },
    {
      key: 'id' as const,
      label: 'Hành Động',
      render: (value: string, row: Department) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditDept(row)} className="p-1 hover:bg-accent rounded">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDeleteDept(row.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400">
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

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Phòng Ban</h1>
            <p className="text-muted-foreground mt-1">Quản lý phòng ban trong tổ chức</p>
          </div>
          <Button onClick={handleAddDept} className="flex items-center gap-2">
            <Plus size={20} />
            Thêm Phòng Ban
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={departments}
            searchPlaceholder="Tìm kiếm phòng ban..."
            searchableFields={['name']}
          />
        )}

        {/* Dialog */}
        {isDialogOpen && (
          // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          //   <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md">
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
           <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedDept ? 'Chỉnh Sửa Phòng Ban' : 'Thêm Phòng Ban'}
                </h2>
                <button onClick={() => setIsDialogOpen(false)} className="p-1 hover:bg-accent rounded">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(handleSubmitDept)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên Phòng Ban *</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Tên là bắt buộc' })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                    disabled={dialogLoading}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{String(errors.name.message)}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Mô Tả</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                    disabled={dialogLoading}
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={dialogLoading}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={dialogLoading}>
                    {dialogLoading ? 'Đang lưu...' : selectedDept ? 'Cập nhật' : 'Tạo mới'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
