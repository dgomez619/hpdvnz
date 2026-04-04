import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const ProtectedRoute = () => {
  const token = localStorage.getItem('adminToken');
  const location = useLocation();

  // If there is no token, redirect to the login page
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If the token exists, render the child routes (Dashboard, Calendar, etc.)
  return <Outlet />;
};