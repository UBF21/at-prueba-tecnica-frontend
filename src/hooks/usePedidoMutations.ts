import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPedido,
  updatePedido,
  deletePedido,
} from '../api/pedidos';
import type {
  CreatePedidoRequest,
  UpdatePedidoRequest,
} from '../types';

export function useCreatePedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePedidoRequest) => createPedido(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
}

export function useUpdatePedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePedidoRequest }) =>
      updatePedido(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['pedidos', variables.id] });
    },
  });
}

export function useDeletePedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePedido(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
}
