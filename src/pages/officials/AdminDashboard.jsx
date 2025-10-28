// src/pages/officials/AdminDashboard.jsx
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import { OfficialOnly } from "../../components/PermissionGate";
import { PERMISSIONS } from "../../config/rbac";

function AdminDashboard() {
  const { user, signOut } = useAuth();
  const { roleName } = usePermissions();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">Admin Portal</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm">
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
        <h2 className="text-2xl font-bold mb-6">Official Dashboard</h2>

        <OfficialOnly>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Pending Requests</h3>
              <p className="text-3xl font-bold text-blue-600">12</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Total Residents</h3>
              <p className="text-3xl font-bold text-green-600">456</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Completed Today</h3>
              <p className="text-3xl font-bold text-purple-600">8</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Activity Logs</h3>
              <p className="text-3xl font-bold text-orange-600">24</p>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">
                View All Requests
              </button>
              <button className="px-4 py-3 bg-green-500 text-white rounded hover:bg-green-600">
                Manage Residents
              </button>
              <button className="px-4 py-3 bg-purple-500 text-white rounded hover:bg-purple-600">
                Generate Reports
              </button>
            </div>
          </div>
        </OfficialOnly>
      </main>
    </div>
  );
}

export default AdminDashboard;
