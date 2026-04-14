import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getProducts,
  getProductById,
} from '../api/products';
import type { GetProductsParams } from '../types';

/**
 * Hook to fetch products with pagination.
 * Automatically extracts data from PaginatedResponse.
 */
export function useProducts(params?: GetProductsParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await getProducts(params);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch products');
      }
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single product by ID.
 * Automatically extracts data from ApiResponse.
 */
export function useProduct(id: number) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const response = await getProductById(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch product');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Helper to invalidate products queries after mutations.
 */
export function useInvalidateProducts() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };
}
