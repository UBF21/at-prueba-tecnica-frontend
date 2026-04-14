import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getOrders,
  getOrderById,
} from '../api/orders';
import type { GetOrdersParams } from '../types';

/**
 * Hook to fetch orders with pagination and optional status filtering.
 * Automatically extracts data from PaginatedResponse.
 */
export function useOrders(params?: GetOrdersParams) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      const response = await getOrders(params);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch orders');
      }
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single order by ID.
 * Automatically extracts data from ApiResponse.
 */
export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const response = await getOrderById(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch order');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Helper to get the query client for manual invalidation.
 * Used after mutations to refresh data.
 */
export function useOrdersQueryClient() {
  return useQueryClient();
}

/**
 * Helper to invalidate orders queries after mutations.
 */
export function useInvalidateOrders() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  };
}
