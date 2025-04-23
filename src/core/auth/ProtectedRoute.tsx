import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading)
    return <div>Loading authentication state...</div>;

  if (!token)
    return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

export default ProtectedRoute;