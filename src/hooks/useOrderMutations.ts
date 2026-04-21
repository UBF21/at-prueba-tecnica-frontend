import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createOrder,
  updateOrder,
  deleteOrder,
  addOrderItem,
} from '../api/orders';
import type {
  ApiError,
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
      toast.success('Orden creada exitosamente');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Error al crear la orden');
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
      id: string;
      data: UpdateOrderRequest;
    }) => updateOrder(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Orden actualizada exitosamente');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Error al actualizar la orden');
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
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Orden eliminada exitosamente');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Error al eliminar la orden');
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
      orderId: string;
      request: AddOrderItemRequest;
    }) => addOrderItem(orderId, request),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
