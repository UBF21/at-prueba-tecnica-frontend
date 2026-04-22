import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDeleteProductMutation } from './useProductMutations';
import { useIsAdmin } from './useAuth';
import type { ColumnDef } from '@tanstack/react-table';
import type { Product } from '../types';

/**
 * Custom hook that generates dynamic columns for Products table
 * with sorting, custom rendering, and action buttons
 */
export function useProductColumns(onDeleteClick?: (productId: string) => void) {
  const deleteProductMutation = useDeleteProductMutation();
  const isAdmin = useIsAdmin();

  const columns: ColumnDef<Product>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
        cell: (info) => (
          <span className="font-medium text-text-primary">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Descripción',
        cell: (info) => (
          <span className="text-sm text-text-secondary max-w-xs truncate">
            {(info.getValue() as string) || 'N/A'}
          </span>
        ),
      },
      {
        accessorKey: 'unitPrice',
        header: 'Precio',
        cell: (info) => (
          <span className="font-semibold text-gold-primary">
            ${((info.getValue() as number) || 0).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: (info) => {
          const stock = info.getValue() as number;
          const isInStock = stock > 0;
          const bgColor = isInStock
            ? 'rgba(34, 197, 94, 0.15)'
            : 'rgba(239, 68, 68, 0.15)';
          const borderColor = isInStock
            ? 'border-semantic-success/50'
            : 'border-semantic-danger/50';
          const textColor = isInStock
            ? 'text-semantic-success'
            : 'text-semantic-danger';
          return (
            <span
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${textColor} ${borderColor}`}
              style={{ backgroundColor: bgColor }}
            >
              {stock} unidades
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
          const product = info.row.original;
          if (!isAdmin) return <span className="text-xs text-text-muted">Solo lectura</span>;
          return (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDeleteClick?.(product.id)}
              disabled={deleteProductMutation.isPending}
              className="p-2 text-semantic-danger/70 hover:text-semantic-danger hover:bg-semantic-danger/10 rounded transition disabled:cursor-not-allowed disabled:opacity-50"
              title="Eliminar producto"
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
    [deleteProductMutation, isAdmin]
  );

  return columns;
}
