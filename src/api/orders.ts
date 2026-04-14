import { apiFetch } from './client';
import type {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  GetOrdersParams,
  PaginatedResponse,
  ApiResponse,
  AddOrderItemRequest,
} from '../types';

/**
 * Fetch orders with pagination and optional status filtering.
 * Returns PaginatedResponse with data, page, pageSize, total, totalPages.
 */
export async function getOrders(
  params?: GetOrdersParams
): Promise<PaginatedResponse<Order>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', String(params.page));
  if (params?.pageSize) searchParams.append('pageSize', String(params.pageSize));
  if (params?.status) searchParams.append('status', params.status);

  const query = searchParams.toString();
  const url = `/api/orders${query ? `?${query}` : ''}`;

  return apiFetch<PaginatedResponse<Order>>(url);
}

/**
 * Fetch a single order by ID.
 * Returns ApiResponse with order data.
 */
export async function getOrderById(id: number): Promise<ApiResponse<Order>> {
  return apiFetch<ApiResponse<Order>>(`/api/orders/${id}`);
}

/**
 * Create a new order.
 * Returns ApiResponse with created order data.
 */
export async function createOrder(
  data: CreateOrderRequest
): Promise<ApiResponse<Order>> {
  return apiFetch<ApiResponse<Order>>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing order.
 * Returns ApiResponse with updated order data.
 */
export async function updateOrder(
  id: number,
  data: UpdateOrderRequest
): Promise<ApiResponse<Order>> {
  return apiFetch<ApiResponse<Order>>(`/api/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete an order (soft delete).
 * Returns ApiResponse with boolean result.
 */
export async function deleteOrder(
  id: number
): Promise<ApiResponse<boolean>> {
  return apiFetch<ApiResponse<boolean>>(`/api/orders/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Add an item to an order.
 * Returns ApiResponse with updated order data including items.
 */
export async function addOrderItem(
  orderId: number,
  request: AddOrderItemRequest
): Promise<ApiResponse<Order>> {
  return apiFetch<ApiResponse<Order>>(`/api/orders/${orderId}/items`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
