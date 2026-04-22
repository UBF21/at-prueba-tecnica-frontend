import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDeleteOrderMutation } from './useOrderMutations';
import { useIsAdmin } from './useAuth';
import type { ColumnDef } from '@tanstack/react-table';
import type { Order, OrderStatus } from '../types';

const STATUS_STYLES: Record<OrderStatus, { bg: string; border: string; text: string }> = {
  Pending: {
    bg: 'rgba(107, 114, 128, 0.15)',
    border: 'border-semantic-neutral/50',
    text: 'text-semantic-neutral',
  },
  Processing: {
    bg: 'rgba(234, 179, 8, 0.15)',
    border: 'border-semantic-warning/50',
    text: 'text-semantic-warning',
  },
  Shipped: {
    bg: 'rgba(59, 130, 246, 0.15)',
    border: 'border-semantic-info/50',
    text: 'text-semantic-info',
  },
  Delivered: {
    bg: 'rgba(34, 197, 94, 0.15)',
    border: 'border-semantic-success/50',
    text: 'text-semantic-success',
  },
  Cancelled: {
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'border-semantic-danger/50',
    text: 'text-semantic-danger',
  },
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
export function useOrderColumns(onDeleteClick?: (orderId: string) => void) {
  const deleteOrderMutation = useDeleteOrderMutation();
  const isAdmin = useIsAdmin();

  const columns: ColumnDef<Order>[] = useMemo(
    () => [
      {
        accessorKey: 'orderNumber',
        header: 'Número de Orden',
        cell: (info) => (
          <span className="font-medium text-text-primary">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: (info) => (
          <span className="font-semibold text-gold-primary">
            ${((info.getValue() as number) || 0).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: (info) => {
          const status = info.getValue() as OrderStatus;
          const style = STATUS_STYLES[status];
          return (
            <span
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${style.text} ${style.border}`}
              style={{ backgroundColor: style.bg }}
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
          <span className="text-sm text-text-secondary">
            {new Date(info.getValue() as string).toLocaleDateString('es-ES')}
          </span>
        ),
      },
      {
        accessorKey: 'customerName',
        header: 'Cliente',
        cell: (info) => <span className="text-text-primary font-medium">{info.getValue() as string}</span>,
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: (info) => {
          const order = info.row.original;
          if (!isAdmin) return <span className="text-xs text-text-muted">Solo lectura</span>;
          return (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDeleteClick?.(order.id)}
              disabled={deleteOrderMutation.isPending}
              className="p-2 text-semantic-danger/70 hover:text-semantic-danger hover:bg-semantic-danger/10 rounded transition disabled:cursor-not-allowed disabled:opacity-50"
              title="Eliminar orden"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </motion.button>
          );
        },
      },
    ],
    [deleteOrderMutation, isAdmin]
  );

  return columns;
}
