import { apiFetch } from './client';
import type { LoginRequest, LoginResponse, ApiResponse } from '../types';

const TOKEN_KEY = 'token';

/**
 * Login with email and password.
 * Backend returns ApiResponse<LoginResponseDto> with token.
 */
export async function login(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const response = await apiFetch<ApiResponse<LoginResponse>>(
    '/api/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(credentials),
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Login failed');
  }

  return response.data;
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    const expiryTime = (payload.exp || 0) * 1000;
    return Date.now() >= expiryTime;
  } catch {
    return true;
  }
}

export function isAuthenticated(): boolean {
  const token = getToken();
  return !!(token && !isTokenExpired(token));
}
