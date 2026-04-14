import { apiFetch } from './client';
import type {
  Pedido,
  CreatePedidoRequest,
  UpdatePedidoRequest,
  GetPedidosParams,
} from '../types';

export async function getPedidos(params?: GetPedidosParams): Promise<Pedido[]> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', String(params.page));
  if (params?.pageSize) searchParams.append('pageSize', String(params.pageSize));
  if (params?.estado) searchParams.append('estado', params.estado);

  const query = searchParams.toString();
  const url = `/api/pedidos${query ? `?${query}` : ''}`;

  return apiFetch<Pedido[]>(url);
}

export async function getPedidoById(id: number): Promise<Pedido> {
  return apiFetch<Pedido>(`/api/pedidos/${id}`);
}

export async function createPedido(data: CreatePedidoRequest): Promise<Pedido> {
  return apiFetch<Pedido>('/api/pedidos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePedido(
  id: number,
  data: UpdatePedidoRequest
): Promise<Pedido> {
  return apiFetch<Pedido>(`/api/pedidos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePedido(id: number): Promise<boolean> {
  await apiFetch<void>(`/api/pedidos/${id}`, {
    method: 'DELETE',
  });
  return true;
}
