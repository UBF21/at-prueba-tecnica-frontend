import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight, Inbox } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  pageSize?: number;
  onRowClick?: (row: TData) => void;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (pageIndex: number) => void;
  isLoading?: boolean;
}

/**
 * Generic DataTable component using TanStack Table
 * Supports:
 * - Dynamic columns with custom rendering
 * - Sorting with visual indicators
 * - Client-side pagination
 * - Filtering
 * - Row click handling with animations
 */
export function DataTable<TData>({
  columns,
  data,
  onRowClick,
  totalPages = 1,
  currentPage = 0,
  onPageChange,
  isLoading = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const { rows } = table.getRowModel();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="space-y-6">
      {/* Table Container */}
      <div className="overflow-hidden bg-surface-raised rounded-xl border border-border-default shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-surface-overlay to-surface-muted sticky top-0 z-10 border-b-2 border-gold-dim">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-xs font-bold text-gold-primary uppercase tracking-widest"
                    >
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        className={`flex items-center gap-2 ${
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none hover:text-gold-bright transition-colors'
                            : ''
                        }`}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="opacity-60">
                            {header.column.getIsSorted() === 'asc' && (
                              <ChevronUp size={16} />
                            )}
                            {header.column.getIsSorted() === 'desc' && (
                              <ChevronDown size={16} />
                            )}
                            {!header.column.getIsSorted() && (
                              <div className="flex gap-0.5 opacity-40">
                                <ChevronUp size={12} />
                                <ChevronDown size={12} />
                              </div>
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {isLoading ? (
                // Skeleton rows
                Array.from({ length: 7 }).map((_, skeletonIdx) => (
                  <tr
                    key={`skeleton-${skeletonIdx}`}
                    className={`border-t border-border-default ${
                      skeletonIdx % 2 === 0 ? 'bg-surface-raised' : 'bg-surface-overlay/30'
                    }`}
                  >
                    {columns.map((_, colIdx) => (
                      <td key={`skeleton-cell-${colIdx}`} className="px-6 py-4">
                        <div
                          className="h-4 rounded bg-surface-muted/60 animate-pulse"
                          style={{
                            width: colIdx === 0 ? '40px' : colIdx === columns.length - 1 ? '60px' : '100%',
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows.length > 0 ? (
                rows.map((row, idx) => (
                  <motion.tr
                    key={row.id}
                    variants={rowVariants}
                    onClick={() => onRowClick?.(row.original)}
                    whileHover={
                      onRowClick
                        ? {
                            backgroundColor: 'rgba(212, 175, 55, 0.08)',
                            x: 4,
                          }
                        : {}
                    }
                    className={`border-t border-border-default text-text-primary group transition-all duration-200 ${
                      onRowClick
                        ? 'hover:cursor-pointer hover:shadow-lg'
                        : ''
                    } ${
                      idx % 2 === 0 ? 'bg-surface-raised' : 'bg-surface-overlay/30'
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm group-hover:text-gold-bright transition-colors"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-16 text-center text-text-muted"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="p-4 rounded-full bg-gold-primary/10 border border-gold-dim/30">
                        <Inbox size={32} className="text-gold-primary opacity-60" />
                      </div>
                      <p className="text-sm text-text-muted">No hay datos disponibles</p>
                    </motion.div>
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-2"
        >
          <div className="text-sm text-text-secondary">
            Página <span className="text-gold-primary font-semibold">{currentPage + 1}</span> de{' '}
            <span className="text-gold-primary font-semibold">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange?.(0)}
              disabled={currentPage === 0}
              className="p-2 hover:bg-surface-overlay disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition text-text-secondary hover:text-gold-primary"
              title="Primera página"
            >
              <ChevronsLeft size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange?.(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 hover:bg-surface-overlay disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition text-sm font-medium text-text-secondary hover:text-gold-primary"
            >
              ← Anterior
            </motion.button>

            <div className="flex gap-1 mx-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageIndex = Math.max(
                  0,
                  Math.min(
                    currentPage - 2,
                    totalPages - 5
                  )
                );
                return pageIndex + i;
              }).map((page) => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange?.(page)}
                  className={`w-10 h-10 rounded-lg transition text-sm font-semibold ${
                    currentPage === page
                      ? 'bg-gold-primary text-surface-base shadow-lg'
                      : 'bg-surface-overlay text-text-secondary hover:bg-surface-muted hover:text-gold-primary border border-border-default hover:border-gold-dim'
                  }`}
                >
                  {page + 1}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange?.(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 hover:bg-surface-overlay disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition text-sm font-medium text-text-secondary hover:text-gold-primary"
            >
              Siguiente →
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange?.(totalPages - 1)}
              disabled={currentPage === totalPages - 1}
              className="p-2 hover:bg-surface-overlay disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition text-text-secondary hover:text-gold-primary"
              title="Última página"
            >
              <ChevronsRight size={18} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default DataTable;
