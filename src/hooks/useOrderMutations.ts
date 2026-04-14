import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createOrder,
  updateOrder,
  deleteOrder,
  addOrderItem,
} from '../api/orders';
import type {
  CreateOrderRequest,
  UpdateOrderRequest,
  AddOrderItemRequest,
} from '../types';

/**
 * Hook to create a new order.
 * Automatically invalidates orders list on success.
 */
export function useCreateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

/**
 * Hook to update an order.
 * Automatically invalidates orders list and specific order on success.
 */
export function useUpdateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateOrderRequest;
    }) => updateOrder(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

/**
 * Hook to delete an order.
 * Automatically invalidates orders list on success.
 */
export function useDeleteOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

/**
 * Hook to add an item to an order.
 * Automatically invalidates order and products on success.
 */
export function useAddOrderItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      request,
    }: {
      orderId: number;
      request: AddOrderItemRequest;
    }) => addOrderItem(orderId, request),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
