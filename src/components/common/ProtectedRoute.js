import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { currentUser, isAdmin, loading } = useAuth();
  const location = useLocation();

  // If loading, return loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-primary-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-medium">Caricamento...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!currentUser) {
    // Redirect to login page, but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin access is required, check if user is admin
  if (requireAdmin && !isAdmin) {
    // Redirect to home page if the user is not an admin
    return <Navigate to="/" replace />;
  }

  // If user is authenticated (and is admin if required), render the protected route
  return <Outlet />;
};

export default ProtectedRoute;