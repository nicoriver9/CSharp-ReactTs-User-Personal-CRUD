import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const ProtectedRoute: React.FC = () => {
  const token = useAuthStore((state) => state.token);

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
