import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCustomers,
  getCustomerById,
} from '../api/customers';
import type { GetCustomersParams } from '../types';

/**
 * Hook to fetch customers with pagination.
 * Automatically extracts data from PaginatedResponse.
 */
export function useCustomers(params?: GetCustomersParams) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      const response = await getCustomers(params);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch customers');
      }
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single customer by ID.
 * Automatically extracts data from ApiResponse.
 */
export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: async () => {
      const response = await getCustomerById(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch customer');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Helper to invalidate customers queries after mutations.
 */
export function useInvalidateCustomers() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['customers'] });
  };
}
