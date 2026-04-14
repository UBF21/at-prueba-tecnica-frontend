import { useQuery } from '@tanstack/react-query';
import { getPedidos, getPedidoById } from '../api/pedidos';
import type { GetPedidosParams } from '../types';

export function usePedidos(params?: GetPedidosParams) {
  return useQuery({
    queryKey: ['pedidos', params],
    queryFn: () => getPedidos(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePedido(id: number) {
  return useQuery({
    queryKey: ['pedidos', id],
    queryFn: () => getPedidoById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
