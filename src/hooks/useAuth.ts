import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, removeToken } from '../api/auth';

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
