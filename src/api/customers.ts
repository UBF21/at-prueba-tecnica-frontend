import { apiFetch } from './client';
import type {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  GetCustomersParams,
  PaginatedResponse,
  ApiResponse,
  ListResponse,
  ComboBoxOption,
} from '../types';

/**
 * Fetch customers with pagination.
 * Returns PaginatedResponse with data, page, pageSize, total, totalPages.
 */
export async function getCustomers(
  params?: GetCustomersParams
): Promise<PaginatedResponse<Customer>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', String(params.page));
  if (params?.pageSize) searchParams.append('pageSize', String(params.pageSize));

  const query = searchParams.toString();
  const url = `/api/customers${query ? `?${query}` : ''}`;

  return apiFetch<PaginatedResponse<Customer>>(url);
}

/**
 * Fetch a single customer by ID.
 * Returns ApiResponse with customer data.
 */
export async function getCustomerById(id: string): Promise<ApiResponse<Customer>> {
  return apiFetch<ApiResponse<Customer>>(`/api/customers/${id}`);
}

/**
 * Create a new customer.
 * Returns ApiResponse with created customer data.
 */
export async function createCustomer(
  data: CreateCustomerRequest
): Promise<ApiResponse<Customer>> {
  return apiFetch<ApiResponse<Customer>>('/api/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing customer.
 * Returns ApiResponse with updated customer data.
 */
export async function updateCustomer(
  id: string,
  data: UpdateCustomerRequest
): Promise<ApiResponse<Customer>> {
  return apiFetch<ApiResponse<Customer>>(`/api/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a customer (soft delete).
 * Returns ApiResponse with boolean result.
 */
export async function deleteCustomer(
  id: string
): Promise<ApiResponse<boolean>> {
  return apiFetch<ApiResponse<boolean>>(`/api/customers/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Fetch customers as combobox list.
 * Returns ListResponse with customer options for dropdowns.
 */
export async function getCustomersComboBox(): Promise<ListResponse<ComboBoxOption>> {
  return apiFetch<ListResponse<ComboBoxOption>>('/api/customers/combobox/list');
}
