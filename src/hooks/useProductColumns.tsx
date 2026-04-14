import { useMemo } from 'react';
import { useDeleteProductMutation } from './useProductMutations';
import type { ColumnDef } from '@tanstack/react-table';
import type { Product } from '../types';

/**
 * Custom hook that generates dynamic columns for Products table
 * with sorting, custom rendering, and action buttons
 */
export function useProductColumns() {
  const deleteProductMutation = useDeleteProductMutation();

  const columns: ColumnDef<Product>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
        cell: (info) => (
          <span className="font-medium">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Descripción',
        cell: (info) => (
          <span className="text-sm text-slate-300 max-w-xs truncate">
            {(info.getValue() as string) || 'N/A'}
          </span>
        ),
      },
      {
        accessorKey: 'unitPrice',
        header: 'Precio',
        cell: (info) => (
          <span className="font-semibold text-green-400">
            ${((info.getValue() as number) || 0).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: (info) => {
          const stock = info.getValue() as number;
          return (
            <span
              className={`px-3 py-1 rounded text-xs font-semibold ${
                stock > 0
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
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
          <span className="text-sm text-slate-300">
            {new Date(info.getValue() as string).toLocaleDateString('es-ES')}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: (info) => {
          const product = info.row.original;
          return (
            <button
              onClick={() => {
                if (
                  confirm(
                    '¿Estás seguro de que deseas eliminar este producto?'
                  )
                ) {
                  deleteProductMutation.mutate(product.id);
                }
              }}
              disabled={deleteProductMutation.isPending}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded text-xs font-medium transition disabled:cursor-not-allowed"
            >
              {deleteProductMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </button>
          );
        },
      },
    ],
    [deleteProductMutation]
  );

  return columns;
}
