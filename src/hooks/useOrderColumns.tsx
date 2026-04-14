import { useMemo } from 'react';
import { useDeleteOrderMutation } from './useOrderMutations';
import type { ColumnDef } from '@tanstack/react-table';
import type { Order, OrderStatus } from '../types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: 'bg-slate-600',
  Processing: 'bg-yellow-600',
  Shipped: 'bg-blue-600',
  Delivered: 'bg-green-600',
  Cancelled: 'bg-red-600',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  Pending: 'Pendiente',
  Processing: 'Procesando',
  Shipped: 'Enviado',
  Delivered: 'Entregado',
  Cancelled: 'Cancelado',
};

/**
 * Custom hook that generates dynamic columns for Orders table
 * with sorting, custom rendering, and action buttons
 */
export function useOrderColumns() {
  const deleteOrderMutation = useDeleteOrderMutation();

  const columns: ColumnDef<Order>[] = useMemo(
    () => [
      {
        accessorKey: 'orderNumber',
        header: 'Número de Orden',
        cell: (info) => (
          <span className="font-medium">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: (info) => (
          <span className="font-semibold text-green-400">
            ${((info.getValue() as number) || 0).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: (info) => {
          const status = info.getValue() as OrderStatus;
          return (
            <span
              className={`px-3 py-1 rounded text-xs font-semibold text-white ${
                STATUS_COLORS[status]
              }`}
            >
              {STATUS_LABELS[status]}
            </span>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Creado',
        cell: (info) => (
          <span className="text-sm text-slate-300">
            {new Date(info.getValue() as string).toLocaleDateString('es-ES')}
          </span>
        ),
      },
      {
        accessorKey: 'customerId',
        header: 'ID Cliente',
        cell: (info) => <span className="text-slate-400">#{info.getValue() as number}</span>,
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: (info) => {
          const order = info.row.original;
          return (
            <button
              onClick={() => {
                if (
                  confirm(
                    '¿Estás seguro de que deseas eliminar esta orden?'
                  )
                ) {
                  deleteOrderMutation.mutate(order.id);
                }
              }}
              disabled={deleteOrderMutation.isPending}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded text-xs font-medium transition disabled:cursor-not-allowed"
            >
              {deleteOrderMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </button>
          );
        },
      },
    ],
    [deleteOrderMutation]
  );

  return columns;
}
