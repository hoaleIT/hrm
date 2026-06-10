'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (row: T) => void
  searchPlaceholder?: string
  searchableFields?: (keyof T)[]
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  onRowClick,
  searchPlaceholder = 'Search...',
  searchableFields = [],
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T
    direction: 'asc' | 'desc'
  } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter data based on search
  const filteredData = data.filter(row => {
    if (!searchTerm) return true
    return searchableFields.some(field => {
      const value = String(row[field]).toLowerCase()
      return value.includes(searchTerm.toLowerCase())
    })
  })

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue === bValue) return 0
    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    if (typeof aValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(String(bValue))
        : String(bValue).localeCompare(aValue)
    }

    return sortConfig.direction === 'asc'
      ? (aValue as any) - (bValue as any)
      : (bValue as any) - (aValue as any)
  })

  const handleSort = (key: keyof T) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        }
      }
      return { key, direction: 'asc' }
    })
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {searchableFields.length > 0 && (
        <div className="flex items-center gap-2 bg-accent rounded-lg px-4 py-2">
          <Search size={18} className="text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-sm text-foreground placeholder-muted-foreground flex-1"
          />
        </div>
      )}

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-accent border-b border-border">
                {columns.map(column => (
                  <th key={String(column.key)} className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {column.label}
                      </span>
                      {column.sortable && (
                        <button
                          onClick={() => handleSort(column.key)}
                          className="p-1 hover:bg-background rounded transition-colors"
                        >
                          {sortConfig?.key === column.key ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )
                          ) : (
                            <ChevronUp size={16} className="text-muted-foreground opacity-50" />
                          )}
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center">
                    <p className="text-muted-foreground">No data found</p>
                  </td>
                </tr>
              ) : (
                sortedData.map(row => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row)}
                    className={`border-b border-border hover:bg-accent transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                  >
                    {columns.map(column => (
                      <td key={String(column.key)} className="px-6 py-4 text-sm text-foreground">
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Info */}
      {sortedData.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing {sortedData.length} of {data.length} results
          </p>
        </div>
      )}
    </div>
  )
}
