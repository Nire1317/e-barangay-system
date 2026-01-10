// src/router/AppRouter.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";
import { ProtectedRoute, PublicRoute } from "../components/ProtectedRoute";
import { ROLES } from "../config/rbac";

// Public Pages
import Landing from "../pages/Landing";
import SignIn from "../pages/SignIn";
import NotFound from "../pages/NotFound";
// Resident Pages
import Dashboard from "../pages/residents/Dashboard";
import JoinBarangayPage from "../pages/residents/JoinBarangayPage";
import MyRequestsPage from "../pages/residents/MyRequestsPage";

// Official Pages
import AdminDashboard from "../pages/officials/AdminDashboard";
import ManageRequests from "../pages/officials/ManageRequest";
import Residents from "../pages/officials/Residents";
import ReportsAdminPage from "../pages/officials/ReportsAdminPage";
import AdminPanelPage from "../pages/officials/AdminPanelPage";
import Settings from "../pages/officials/SettingsAdminPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            }
          />

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
          <Route
            path="/join-barangay"
            element={
              <ProtectedRoute allowedRoles={[ROLES.RESIDENT]}>
                <JoinBarangayPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute allowedRoles={[ROLES.RESIDENT]}>
                <MyRequestsPage />
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
          <Route
            path="/manage-requests"
            element={
              <ProtectedRoute allowedRoles={[ROLES.OFFICIAL]}>
                <ManageRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/residents"
            element={
              <ProtectedRoute allowedRoles={[ROLES.OFFICIAL]}>
                <Residents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={[ROLES.OFFICIAL]}>
                <ReportsAdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/official-panel"
            element={
              <ProtectedRoute allowedRoles={[ROLES.OFFICIAL]}>
                <AdminPanelPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={[ROLES.OFFICIAL]}>
                <Settings />
              </ProtectedRoute>
            }
          />
          {/* Add more protected routes here as needed */}
          {/*
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
