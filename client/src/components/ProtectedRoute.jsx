import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthEnabled } from '../config/features';
import { useGlobal } from '../context/GlobalContext';

/**
 * ProtectedRoute Component
 * 
 * Handles route protection based on feature flags and authentication state.
 * 
 * Behavior:
 * - If auth is disabled (feature flag): Redirect to /waiting
 * - If auth is enabled but user not authenticated: Redirect to /login with return URL
 * - If auth is enabled and user authenticated: Render children
 * 
 * @param {React.ReactNode} children - The component to render if access is allowed
 * @param {boolean} requireAuth - Whether this route requires authentication (default: true)
 */
const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user, loading } = useGlobal();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If authentication is disabled via feature flag, redirect to waiting page
  if (!isAuthEnabled()) {
    return <Navigate to="/waiting" replace />;
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    // Preserve the intended destination for redirect after login
    const redirectPath = location.pathname + location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
  }

  // If we reach here, user has access to the route
  return children;
};

export default ProtectedRoute;