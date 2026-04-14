import { apiFetch } from './client';
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  GetProductsParams,
  PaginatedResponse,
  ApiResponse,
} from '../types';

/**
 * Fetch products with pagination.
 * Returns PaginatedResponse with data, page, pageSize, total, totalPages.
 */
export async function getProducts(
  params?: GetProductsParams
): Promise<PaginatedResponse<Product>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', String(params.page));
  if (params?.pageSize) searchParams.append('pageSize', String(params.pageSize));

  const query = searchParams.toString();
  const url = `/api/products${query ? `?${query}` : ''}`;

  return apiFetch<PaginatedResponse<Product>>(url);
}

/**
 * Fetch a single product by ID.
 * Returns ApiResponse with product data.
 */
export async function getProductById(id: string): Promise<ApiResponse<Product>> {
  return apiFetch<ApiResponse<Product>>(`/api/products/${id}`);
}

/**
 * Create a new product.
 * Returns ApiResponse with created product data.
 */
export async function createProduct(
  data: CreateProductRequest
): Promise<ApiResponse<Product>> {
  return apiFetch<ApiResponse<Product>>('/api/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing product.
 * Returns ApiResponse with updated product data.
 */
export async function updateProduct(
  id: string,
  data: UpdateProductRequest
): Promise<ApiResponse<Product>> {
  return apiFetch<ApiResponse<Product>>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a product (soft delete).
 * Returns ApiResponse with boolean result.
 */
export async function deleteProduct(
  id: string
): Promise<ApiResponse<boolean>> {
  return apiFetch<ApiResponse<boolean>>(`/api/products/${id}`, {
    method: 'DELETE',
  });
}
