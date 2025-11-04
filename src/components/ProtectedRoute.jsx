// src/components/ProtectedRoute.jsx

import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { canAccessRoute } from "../utils/permissions";
import { updateFaviconAndTitleByRole } from "../utils/favicon";

/**
 * ProtectedRoute - Restricts access based on authentication and role
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string[]} props.allowedRoles - Array of roles that can access this route
 * @param {string} props.redirectTo - Path to redirect unauthorized users (default: '/signin')
 */
export const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = "/signin",
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Update favicon and title based on user role
  useEffect(() => {
    if (user?.role) {
      updateFaviconAndTitleByRole(user.role);
    }
  }, [user?.role]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user's role is allowed to access this route
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    const defaultRedirect = user.role === "official" ? "/admin" : "/dashboard";
    return <Navigate to={defaultRedirect} replace />;
  }

  // User is authenticated and authorized
  return children;
};

/**
 * PublicRoute - Redirects authenticated users away from public pages (like sign in)
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components to render
 */
export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, redirect to their dashboard
  if (user) {
    const redirectTo = user.role === "official" ? "/admin" : "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};
