'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

const employeeSchema = z.object({
  employee_code: z.string().min(1, 'Employee code is required'),
  full_name: z.string().min(1, 'Full name is required'),
  email: z.email('Invalid email'),
  phone: z.string().optional(),
  gender: z.string().optional(),
  birth_date: z.string().optional(),
  address: z.string().optional(),
  department_id: z.string().optional(),
  position_id: z.string().optional(),
  salary: z.number().optional(),
  start_date: z.string(),
  status: z.enum(['active', 'inactive', 'on_leave']),
})

type EmployeeFormData = z.infer<typeof employeeSchema>

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
      const submitData = {
        ...data,
        salary: data.salary ? parseFloat(String(data.salary)) : undefined,
        department_id: data.department_id || undefined,
        position_id: data.position_id || undefined,
      }
      await onSubmit(submitData)
      reset()
      onClose()
    } catch (error) {
      console.error('[v0] Form submission error:', error)
    } finally {
      setLocalLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg border border-border p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {initialData ? 'Edit Employee' : 'Add Employee'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Employee Code *
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
                Full Name *
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
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Birth Date
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
            <label className="block text-sm font-medium mb-1">Address</label>
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
              <label className="block text-sm font-medium mb-1">Department</label>
              <select
                {...register('department_id')}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={localLoading}
              >
                <option value="">Select department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <select
                {...register('position_id')}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={localLoading}
              >
                <option value="">Select position</option>
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
                Start Date *
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
              <label className="block text-sm font-medium mb-1">Salary</label>
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
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
              Cancel
            </Button>
            <Button type="submit" disabled={localLoading}>
              {localLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
