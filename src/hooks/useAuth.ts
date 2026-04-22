import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, removeToken, getCurrentUser } from '../api/auth';

export function useAuthGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      removeToken();
      navigate('/login', { replace: true });
    }
  }, [navigate]);
}

export function useIsAuthenticated(): boolean {
  return isAuthenticated();
}

export function useIsAdmin(): boolean {
  return getCurrentUser()?.role === 'Admin';
}
