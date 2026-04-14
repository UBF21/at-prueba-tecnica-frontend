import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '../api/products';
import type {
  CreateProductRequest,
  UpdateProductRequest,
} from '../types';

/**
 * Hook to create a new product.
 * Automatically invalidates products list on success.
 */
export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

/**
 * Hook to update a product.
 * Automatically invalidates products list and specific product on success.
 */
export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateProductRequest;
    }) => updateProduct(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

/**
 * Hook to delete a product.
 * Automatically invalidates products list on success.
 */
export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
