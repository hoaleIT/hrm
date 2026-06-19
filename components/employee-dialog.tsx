'use client'

import { useState } from 'react'
// import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useForm, SubmitHandler } from 'react-hook-form'
const employeeSchema = z.object({
  employee_code: z.string().min(1, 'Employee code is required'),
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),

  phone: z.string().optional(),
  gender: z.string().optional(),
  birth_date: z.string().optional(),
  address: z.string().optional(),

  department_id: z.string().optional(),
  position_id: z.string().optional(),

  salary: z.number().optional(),

  start_date: z.string().min(1, 'Start date is required'),

  status: z.enum(['active', 'inactive', 'on_leave']),
})
export type EmployeeFormData = z.infer<typeof employeeSchema>

// if

interface EmployeeDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EmployeeFormData) => Promise<void>
  departments: Array<{ id: string; name: string }>
  positions: Array<{ id: string; name: string }>
  initialData?: EmployeeFormData
  isLoading?: boolean
}

export function EmployeeDialog({
  isOpen,
  onClose,
  onSubmit,
  departments,
  positions,
  initialData,
  isLoading,
}: EmployeeDialogProps) {
  const [localLoading, setLocalLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData ? {
      ...initialData,
      salary: initialData.salary ? parseFloat(String(initialData.salary)) : undefined,
    } : {
      status: 'active',
    },
  })

  const onSubmitForm = async (data: EmployeeFormData) => {
    try {
      setLocalLoading(true)
      // Convert salary to number
      const submitData: EmployeeFormData = {
        ...data,
        salary: data.salary ?? undefined,
        department_id: data.department_id || undefined,
        position_id: data.position_id || undefined,
      }
      await onSubmit(submitData)
      reset()
      onClose()
    } catch (error) {
      console.error('Lỗi khi gửi biểu mẫu:', error)
    } finally {
      setLocalLoading(false)
    }
  }
  const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'

  if (!isOpen) return null

  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-2xl">        
          {/* <div className="flex items-center justify-between mb-6"> */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-foreground">
            {initialData ? 'Edit Employee' : 'Add Employee'}
          </h2>
          <button
            onClick={onClose}
            // className="p-1 hover:bg-accent rounded transition-colors"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Mã nhân viên *
              </label>
              <input
                type="text"
                {...register('employee_code')}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={localLoading}
              />
              {errors.employee_code && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.employee_code.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Họ và tên *
              </label>
              <input
                type="text"
                {...register('full_name')}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={localLoading}
              />
              {errors.full_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.full_name.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Email *
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={localLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={localLoading}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                {...register('gender')}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={localLoading}
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                {...register('birth_date')}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={localLoading}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
            <textarea
              {...register('address')}
              rows={2}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phòng ban</label>
              <select
                {...register('department_id')}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={localLoading}
              >
                <option value="">Chọn phòng ban</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chức vụ</label>
              <select
                {...register('position_id')}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={localLoading}
              >
                <option value="">Chọn chức vụ</option>
                {positions.map(pos => (
                  <option key={pos.id} value={pos.id}>
                    {pos.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Ngày bắt đầu *
              </label>
              <input
                type="date"
                {...register('start_date')}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={localLoading}
              />
              {errors.start_date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.start_date.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lương</label>
              <input
                type="number"
                {...register('salary', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={localLoading}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isLoading}
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="on_leave">Nghỉ phép</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={localLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={localLoading}>
              {localLoading ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
