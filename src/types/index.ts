// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

// Order types (renamed from Pedido)
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  id: number;
  code: string;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt: string;
}

export interface Order {
  id: number;
  code: string;
  orderNumber: string;
  total: number;
  status: OrderStatus;
  customerId: number;
  items?: OrderItem[];
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted: boolean;
}

export interface CreateOrderRequest {
  orderNumber: string;
  customerId: number;
}

export interface UpdateOrderRequest {
  orderNumber?: string;
  status?: OrderStatus;
}

export interface AddOrderItemRequest {
  productId: number;
  quantity: number;
}

export interface GetOrdersParams {
  page?: number;
  pageSize?: number;
  status?: string;
}

// Product types
export interface Product {
  id: number;
  code: string;
  name: string;
  description?: string;
  unitPrice: number;
  stock: number;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted: boolean;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  unitPrice: number;
  stock: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  unitPrice?: number;
  stock?: number;
}

export interface GetProductsParams {
  page?: number;
  pageSize?: number;
}

// API Response wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  message?: string;
  errors?: string[];
}

export interface ListResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
  errors?: string[];
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  errors?: string[];
}

export type ApiError = ApiErrorResponse;

// Backward compatibility aliases
export type EstadoPedido = OrderStatus;
export type Pedido = Order;
