'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DashboardLayout } from '@/components/dashboard-layout'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'

interface Position {
  id: string
  name: string
  description?: string
  allowance?: number
  created_at?: string
}

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPos, setSelectedPos] = useState<Position | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  const supabase = createClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Position>()

  const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"

  useEffect(() => {
    fetchPositions()
  }, [])

  const fetchPositions = async () => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('positions')
        .select('*')

      if (error) throw console.error(error);
      
      setPositions(data || [])
    } catch (err: any) {
      const msg = err?.message || 'Có lỗi xảy ra khi tải danh sách vị trí'
      console.error('Có lỗi xảy ra:', err)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPos = () => {
    setSelectedPos(null)
    reset()
    setError(null)
    setIsDialogOpen(true)
  }

  const handleEditPos = (pos: Position) => {
    setSelectedPos(pos)
    reset(pos)
    setError(null)
    setIsDialogOpen(true)
  }

  const handleDeletePos = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chức vụ này?')) return

    try {
      setError(null)
      const { error } = await supabase.from('positions').delete().eq('id', id)
      if (error) throw error
      setPositions(positions.filter(p => p.id !== id))
      alert('Chức vụ đã được xóa thành công')
    } catch (err: any) {
      const msg = err?.message || 'Có lỗi xảy ra khi xóa vị trí'
      console.error('Có lỗi xảy ra khi xóa vị trí:', err)
      setError(msg)
      alert('Error: ' + msg)
    }
  }

  const handleSubmitPos = async (data: Position) => {
    try {
      setError(null)
      setDialogLoading(true)
      if (selectedPos) {
        const { error } = await supabase
          .from('positions')
          .update(data)
          .eq('id', selectedPos.id)
        if (error) throw error
        alert('Đã cập nhật chức vụ thành công')
      } else {
        const { error } = await supabase.from('positions').insert([data])
        if (error) throw error
        alert('Chức vụ đã được tạo thành công')
      }
      await fetchPositions()
      setIsDialogOpen(false)
    } catch (err: any) {
      const msg = err?.message || 'Có lỗi xảy ra khi lưu chức vụ'
      console.error('Có lỗi xảy ra khi lưu chức vụ:', err)
      setError(msg)
      alert('Error: ' + msg)
    } finally {
      setDialogLoading(false)
    }
  }

  const columns = [
    { key: 'name' as const, label: 'Chức vụ', sortable: true },
    { key: 'description' as const, label: 'Mô tả' },
    {
      key: 'allowance' as const,
      label: 'Phụ cấp',
      render: (value: number) => value ? `$${value.toLocaleString()}` : '-',
    },
    {
      key: 'id' as const,
      label: 'Hành động',
      render: (value: string, row: Position) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditPos(row)} className="p-1 hover:bg-accent rounded">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDeletePos(row.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400">
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
            <h1 className="text-3xl font-bold text-foreground">Chức vụ</h1>
            <p className="text-muted-foreground mt-1">Quản lý chức vụ và vai trò</p>
          </div>
          <Button onClick={handleAddPos} className="flex items-center gap-2">
            <Plus size={20} />
            Thêm Chức vụ
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={positions}
            searchPlaceholder="Tìm kiếm chức vụ..."
            searchableFields={['name']}
          />
        )}

        {/* Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">            
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 w-full max-w-lg">              <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">
                  {selectedPos ? 'Chỉnh sửa Chức vụ' : 'Thêm Chức vụ'}
                </h2>
                <button onClick={() => setIsDialogOpen(false)} className="p-1 hover:bg-accent rounded">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(handleSubmitPos)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên Chức vụ *</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className={inputClass}                    
                    disabled={dialogLoading}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{String(errors.name.message)}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Mô tả</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className={inputClass}                    
                    disabled={dialogLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phụ cấp</label>
                  <input
                    type="number"
                    {...register('allowance', { valueAsNumber: true })}
                    placeholder="0"
                    className={inputClass}
                    disabled={dialogLoading}
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={dialogLoading}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={dialogLoading}>
                    {dialogLoading ? 'Đang lưu...' : selectedPos ? 'Cập nhật' : 'Tạo mới'}
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
