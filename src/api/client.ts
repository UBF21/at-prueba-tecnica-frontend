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

  const data = await response.json();

  // Check if response has a success field and it's false (Vali-Validation Result<T> pattern)
  if (data && typeof data === 'object' && 'success' in data && !data.success) {
    // Vali-Validation returns errors as a dictionary: { "Email": ["error1", "error2"], ... }
    let message = data.message || 'Request failed';

    // If errors is a dictionary/object, extract the first error message from the first field
    if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
      const firstErrorField = Object.keys(data.errors)[0];
      if (firstErrorField && Array.isArray(data.errors[firstErrorField])) {
        message = data.errors[firstErrorField][0] || message;
      }
    }

    const error: ApiError = {
      status: 400,
      message,
      errors: data.errors,
    };
    throw error;
  }

  return data;
}
