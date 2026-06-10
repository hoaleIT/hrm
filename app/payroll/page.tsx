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
  employee?: { full_name: string }
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

      const { data: payData } = await supabase
        .from('payrolls')
        .select(`
          *,
          employee:employee_id(full_name)
        `)
        .order('month', { ascending: false })

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
      const total = (data.base_salary || 0) + (data.allowance || 0) + (data.bonus || 0) - (data.deduction || 0)
      
      if (selectedPayroll) {
        const { error } = await supabase
          .from('payrolls')
          .update({ ...data, total_salary: total })
          .eq('id', selectedPayroll.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('payrolls')
          .insert([{ ...data, total_salary: total, status: 'draft' }])
        if (error) throw error
      }
      await fetchData()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving payroll:', error)
    }
  }

  const statusColors = {
    draft: 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
    processed: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    paid: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  }

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const columns = [
    {
      key: 'employee_id' as const,
      label: 'Employee',
      render: (value: string, row: Payroll) => row.employee?.full_name || '-',
      sortable: true,
    },
    {
      key: 'month' as const,
      label: 'Month',
      sortable: true,
    },
    {
      key: 'base_salary' as const,
      label: 'Base Salary',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'allowance' as const,
      label: 'Allowance',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'bonus' as const,
      label: 'Bonus',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'deduction' as const,
      label: 'Deduction',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'total_salary' as const,
      label: 'Total',
      render: (value: number) => (
        <span className="font-semibold">{formatCurrency(value)}</span>
      ),
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
            Edit
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payroll</h1>
            <p className="text-muted-foreground mt-1">Manage employee salaries and payments</p>
          </div>
          <Button onClick={handleAddPayroll} className="flex items-center gap-2">
            <Plus size={20} />
            Add Payroll
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={payrolls}
            searchPlaceholder="Search by employee..."
            searchableFields={['month']}
          />
        )}

        {/* Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedPayroll ? 'Edit Payroll' : 'Add Payroll'}
                </h2>
                <button onClick={() => setIsDialogOpen(false)} className="p-1 hover:bg-accent rounded">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(handleSubmitPayroll)} className="space-y-4">
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
                  <label className="block text-sm font-medium mb-1">Month *</label>
                  <input
                    type="month"
                    {...register('month', { required: true })}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Base Salary *</label>
                  <input
                    type="number"
                    {...register('base_salary', { valueAsNumber: true, required: true })}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Allowance</label>
                  <input
                    type="number"
                    {...register('allowance', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    step="0.01"
                    defaultValue="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bonus</label>
                  <input
                    type="number"
                    {...register('bonus', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    step="0.01"
                    defaultValue="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Deduction</label>
                  <input
                    type="number"
                    {...register('deduction', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    step="0.01"
                    defaultValue="0"
                  />
                </div>

                <div className="bg-accent rounded p-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Total Salary:</span>
                    <span className="font-bold text-primary">
                      ${(
                        (Number(watch('base_salary')) || 0) +
                        (Number(watch('allowance')) || 0) +
                        (Number(watch('bonus')) || 0) -
                        (Number(watch('deduction')) || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="draft">Draft</option>
                    <option value="processed">Processed</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{selectedPayroll ? 'Update' : 'Create'}</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
