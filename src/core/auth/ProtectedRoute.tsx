import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { UserRole } from './types';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { token, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!token)
    return <Navigate to="/login" state={{ from: location }} replace />;

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    console.warn(
      `ProtectedRoute: User with role '${user?.role}' tried to access a route allowed only for roles: ${allowedRoles.join(', ')}`
    );
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
