import type { ApiError } from '../types';

const API_BASE_URL = 'http://localhost:5001';

export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: ApiError = {
      status: response.status,
      message: errorData.message || response.statusText,
      errors: errorData.errors,
    };
    throw error;
  }

  return response.json();
}
