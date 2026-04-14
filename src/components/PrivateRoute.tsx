import { Navigate } from 'react-router-dom';
import { useIsAuthenticated, useAuthGuard } from '../hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = useIsAuthenticated();
  useAuthGuard();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
