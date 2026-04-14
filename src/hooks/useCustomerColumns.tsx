import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDeleteCustomerMutation } from './useCustomerMutations';
import type { ColumnDef } from '@tanstack/react-table';
import type { Customer } from '../types';

/**
 * Custom hook that generates dynamic columns for Customers table
 * with sorting, custom rendering, and action buttons
 */
export function useCustomerColumns(onDeleteClick?: (customerId: string) => void) {
  const deleteCustomerMutation = useDeleteCustomerMutation();

  const columns: ColumnDef<Customer>[] = useMemo(
    () => [
      {
        accessorKey: 'code',
        header: 'Código',
        cell: (info) => (
          <span className="font-semibold text-gold-primary">#{info.getValue() as number}</span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Nombre',
        cell: (info) => (
          <span className="font-medium text-text-primary">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => (
          <span className="text-sm text-text-secondary">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Teléfono',
        cell: (info) => {
          const phone = info.getValue() as string | undefined;
          return (
            <span className="text-sm text-text-secondary">
              {phone || '-'}
            </span>
          );
        },
      },
      {
        accessorKey: 'address',
        header: 'Dirección',
        cell: (info) => {
          const address = info.getValue() as string | undefined;
          return (
            <span className="text-sm text-text-secondary truncate max-w-xs">
              {address || '-'}
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
        id: 'actions',
        header: 'Acciones',
        cell: (info) => {
          const customer = info.row.original;
          return (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDeleteClick?.(customer.id)}
              disabled={deleteCustomerMutation.isPending}
              className="p-2 text-semantic-danger/70 hover:text-semantic-danger hover:bg-semantic-danger/10 rounded transition disabled:cursor-not-allowed disabled:opacity-50"
              title="Eliminar cliente"
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
    [deleteCustomerMutation]
  );

  return columns;
}
