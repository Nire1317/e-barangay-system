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
import RequestOfficialVerificationPage from "../pages/residents/RequestOfficialVerificationPage";
import BarangayClearance from "../components/ui/brgyClearance";

// Official Pages
import AdminDashboard from "../pages/officials/AdminDashboard";
import BarangayRequestsPage from "../pages/officials/BarangayRequestsPage";
import OfficialVerificationsPage from "../pages/officials/OfficialVerificationsPage";
import ManageRequests from "../pages/officials/ManageRequest";
import Residents from "../pages/officials/Residents";
import ReportsAdminPage from "../pages/officials/ReportsAdminPage";
import AdminPanelPage from "../pages/officials/AdminPanelPage";
import Settings from "../pages/officials/SettingsAdminPage";

// Super Admin Pages
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import SuperAdminVerificationsPage from "../pages/superadmin/SuperAdminVerificationsPage";

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
            path="/BarangayClearance"
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
          <Route
            path="/request-verification"
            element={
              <ProtectedRoute allowedRoles={[ROLES.RESIDENT]}>
                <RequestOfficialVerificationPage />
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

          {/* Super Admin Routes */}
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/barangay-requests"
            element={
              <ProtectedRoute allowedRoles={[ROLES.OFFICIAL, ROLES.ADMIN]}>
                <BarangayRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/official-verifications"
            element={
              <ProtectedRoute allowedRoles={[ROLES.OFFICIAL, ROLES.ADMIN]}>
                <OfficialVerificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin-verifications"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <SuperAdminVerificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-requests"
            element={
              <ProtectedRoute allowedRoles={[ROLES.OFFICIAL, ROLES.ADMIN]}>
                <ManageRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/residents"
            element={
              <ProtectedRoute allowedRoles={[ROLES.OFFICIAL, ROLES.ADMIN]}>
                <Residents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={[ROLES.OFFICIAL, ROLES.ADMIN]}>
                <ReportsAdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/official-panel"
            element={
              <ProtectedRoute allowedRoles={[ROLES.OFFICIAL, ROLES.ADMIN]}>
                <AdminPanelPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={[ROLES.OFFICIAL, ROLES.ADMIN]}>
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
