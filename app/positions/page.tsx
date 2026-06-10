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

  useEffect(() => {
    fetchPositions()
  }, [])

  const fetchPositions = async () => {
    try {
      setError(null)
      const { data, err } = await supabase
        .from('positions')
        .select('*')

      if (err) throw err
      setPositions(data || [])
    } catch (err: any) {
      const msg = err?.message || 'Failed to fetch positions'
      console.error('[v0] Error fetching positions:', err)
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
    if (!confirm('Are you sure?')) return

    try {
      setError(null)
      const { error } = await supabase.from('positions').delete().eq('id', id)
      if (error) throw error
      setPositions(positions.filter(p => p.id !== id))
      alert('Position deleted successfully')
    } catch (err: any) {
      const msg = err?.message || 'Failed to delete position'
      console.error('[v0] Error deleting position:', err)
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
        alert('Position updated successfully')
      } else {
        const { error } = await supabase.from('positions').insert([data])
        if (error) throw error
        alert('Position created successfully')
      }
      await fetchPositions()
      setIsDialogOpen(false)
    } catch (err: any) {
      const msg = err?.message || 'Failed to save position'
      console.error('[v0] Error saving position:', err)
      setError(msg)
      alert('Error: ' + msg)
    } finally {
      setDialogLoading(false)
    }
  }

  const columns = [
    { key: 'name' as const, label: 'Position Name', sortable: true },
    { key: 'description' as const, label: 'Description' },
    {
      key: 'allowance' as const,
      label: 'Allowance',
      render: (value: number) => value ? `$${value.toLocaleString()}` : '-',
    },
    {
      key: 'id' as const,
      label: 'Actions',
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
              <h3 className="font-semibold text-red-800 dark:text-red-400">Error</h3>
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
            <h1 className="text-3xl font-bold text-foreground">Positions</h1>
            <p className="text-muted-foreground mt-1">Manage job positions and roles</p>
          </div>
          <Button onClick={handleAddPos} className="flex items-center gap-2">
            <Plus size={20} />
            Add Position
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={positions}
            searchPlaceholder="Search positions..."
            searchableFields={['name']}
          />
        )}

        {/* Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedPos ? 'Edit Position' : 'Add Position'}
                </h2>
                <button onClick={() => setIsDialogOpen(false)} className="p-1 hover:bg-accent rounded">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(handleSubmitPos)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Position Name *</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                    disabled={dialogLoading}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{String(errors.name.message)}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                    disabled={dialogLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Allowance</label>
                  <input
                    type="number"
                    {...register('allowance', { valueAsNumber: true })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                    disabled={dialogLoading}
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={dialogLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={dialogLoading}>
                    {dialogLoading ? 'Saving...' : selectedPos ? 'Update' : 'Create'}
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
