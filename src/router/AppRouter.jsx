// src/router/AppRouter.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";
import { ProtectedRoute, PublicRoute } from "../components/ProtectedRoute";
import { ROLES } from "../config/rbac";

// Pages
import SignIn from "../pages/SignIn";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/residents/Dashboard";
import AdminDashboard from "../pages/officials/AdminDashboard";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />

          {/* Resident Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.RESIDENT]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Official Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={[ROLES.OFFICIAL]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Add more protected routes here as needed */}
          {/* Example:
          <Route 
            path="/requests" 
            element={
              <ProtectedRoute allowedRoles={[ROLES.RESIDENT, ROLES.OFFICIAL]}>
                <RequestsPage />
              </ProtectedRoute>
            } 
          />
          */}

          {/* Root redirect based on authentication */}
          <Route path="/" element={<Navigate to="/signin" replace />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
