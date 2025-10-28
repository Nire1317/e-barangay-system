// src/pages/residents/Dashboard.jsx
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import { PermissionGate } from "../../components/PermissionGate";
import { PERMISSIONS } from "../../config/rbac";

function Dashboard() {
  const { user, signOut } = useAuth();
  const { roleName } = usePermissions();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">E-Barangay Portal</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.fullName} ({roleName})
              </span>
              <button
                onClick={signOut}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Resident Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">My Requests</h3>
            <p className="text-gray-600">
              View and track your document requests
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">New Request</h3>
            <p className="text-gray-600">Submit a new document request</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Profile</h3>
            <p className="text-gray-600">Update your information</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
