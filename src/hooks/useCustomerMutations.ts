import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../api/customers';
import type {
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from '../types';

/**
 * Hook to create a new customer.
 * Shows toast notifications for success/error and invalidates customers list.
 */
export function useCreateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerRequest) => createCustomer(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Cliente creado exitosamente');
      return response;
    },
    onError: (error: any) => {
      const message = error.message || 'Error al crear el cliente';
      toast.error(message);
    },
  });
}

/**
 * Hook to update a customer.
 * Shows toast notifications for success/error and invalidates queries.
 */
export function useUpdateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCustomerRequest;
    }) => updateCustomer(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Cliente actualizado exitosamente');
    },
    onError: (error: any) => {
      const message = error.message || 'Error al actualizar el cliente';
      toast.error(message);
    },
  });
}

/**
 * Hook to delete a customer.
 * Shows toast notifications for success/error and invalidates customers list.
 */
export function useDeleteCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Cliente eliminado exitosamente');
    },
    onError: (error: any) => {
      const message = error.message || 'Error al eliminar el cliente';
      toast.error(message);
    },
  });
}
