import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import { PermissionGate } from "../../components/PermissionGate";
import { PERMISSIONS } from "../../config/rbac";
import AppSideBar from "../../components/ui/side-bar";

function Dashboard() {
  const { user, signOut } = useAuth();
  const { roleName } = usePermissions();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AppSideBar />

      <div className="flex-1">
    <nav className="bg-white shadow w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-blue-600">
              E-Barangay System
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user?.fullName} ({roleName})
              </span>
              <button
                onClick={signOut}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Resident Dashboard
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/requests"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="font-semibold mb-2 text-blue-600">My Requests</h3>
              <p className="text-gray-600">
                View and track your document requests.
              </p>
            </Link>

            <Link
              to="/new-request"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="font-semibold mb-2 text-blue-600">New Request</h3>
              <p className="text-gray-600">
                Submit a new document request easily.
              </p>
            </Link>

            <Link
              to="/profile"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="font-semibold mb-2 text-blue-600">Profile</h3>
              <p className="text-gray-600">
                View or update your personal information.
              </p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
