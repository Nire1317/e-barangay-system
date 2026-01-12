import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import AppSideBar from "../../components/ui/side-bar";
import { useResidents } from "../../hooks/useResidents";
import { useAuth } from "../../hooks/useAuth";

// Components
const NavigationHeader = ({ user }) => (
  <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-14.5 items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Residents Management
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">
              {user?.full_name || "User"}
            </p>
            <p className="text-xs text-slate-600 font-medium leading-tight mt-0.5">
              {user?.role === "official" ? "Official" : "Administrator"}
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

const PageHeader = () => (
  <div className="mb-8">
    <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">
      Residents
    </h2>
    <p className="text-base text-slate-600 mt-2 font-medium">
      Manage resident information and registrations
    </p>
  </div>
);

const StatsCard = ({ title, value, icon: Icon, color, bgColor, trend }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
          <p className="text-xs text-slate-500 font-medium">{trend}</p>
        </div>
        <div className={`${bgColor} ${color} p-3 rounded-lg`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon: Icon, label, variant = "default", onClick }) => {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline: "border-2 border-slate-300 text-slate-700 hover:bg-slate-50",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${variants[variant]}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    verified: {
      label: "Verified",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    pending: {
      label: "Pending",
      className: "bg-orange-100 text-orange-700 border-orange-200",
    },
    inactive: {
      label: "Inactive",
      className: "bg-red-100 text-red-700 border-red-200",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
      {config.label}
    </span>
  );
};

const ResidentRow = ({ resident, onViewDetails, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
            {resident.name?.charAt(0) || "?"}
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-slate-900">
              {resident.name}
            </div>
            <div className="text-xs text-slate-500">{resident.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-slate-900">{resident.phone}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-slate-900 max-w-xs truncate">
          {resident.address}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={resident.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {formatDate(resident.registeredDate)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <MoreVertical size={18} />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
              <button
                onClick={() => {
                  setShowActions(false);
                  onViewDetails?.(resident);
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Eye size={16} />
                View Details
              </button>
              <button
                onClick={() => {
                  setShowActions(false);
                  onEdit?.(resident);
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => {
                  setShowActions(false);
                  onDelete?.(resident);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default function ResidentsPage() {
  const { user } = useAuth();
  const {
    residents,
    stats,
    loading,
    error,
    fetchResidents,
    fetchResidentStats,
    deleteResident,
  } = useResidents();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Load initial data
  useEffect(() => {
    if (user?.barangayId) {
      fetchResidents();
      fetchResidentStats();
    }
  }, [user?.barangayId]);

  // Apply filters when search or status changes
  useEffect(() => {
    if (user?.barangayId) {
      fetchResidents({
        search: searchTerm,
        status: filterStatus,
      });
    }
  }, [searchTerm, filterStatus]);

  // Calculate dynamic stats
  const totalResidents = stats.total || 0;
  const verifiedCount = stats.verified || 0;
  const pendingCount = stats.pending || 0;
  const inactiveCount = stats.inactive || 0;
  const verifiedPercentage = totalResidents > 0
    ? Math.round((verifiedCount / totalResidents) * 100)
    : 0;
  const inactivePercentage = totalResidents > 0
    ? Math.round((inactiveCount / totalResidents) * 100)
    : 0;

  // Handle actions
  const handleViewDetails = (resident) => {
    // TODO: Implement view details modal
    console.log("View details:", resident);
  };

  const handleEdit = (resident) => {
    // TODO: Implement edit modal
    console.log("Edit resident:", resident);
  };

  const handleDelete = async (resident) => {
    if (window.confirm(`Are you sure you want to delete ${resident.name}?`)) {
      try {
        await deleteResident(resident.resident_id);
        alert("Resident deleted successfully");
      } catch (err) {
        alert("Failed to delete resident");
      }
    }
  };

  // Check if user has barangay assigned
  if (!user?.barangayId) {
    return (
      <AppSideBar>
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                  No Barangay Assigned
                </h3>
                <p className="text-amber-800">
                  You must be assigned to a barangay to view residents.
                  Please contact your system administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppSideBar>
    );
  }

  return (
    <AppSideBar>
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
        <NavigationHeader user={user} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader />

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Residents"
              value={totalResidents.toString()}
              icon={Users}
              color="text-blue-600"
              bgColor="bg-blue-50"
              trend={`${totalResidents} total`}
            />
            <StatsCard
              title="Verified"
              value={verifiedCount.toString()}
              icon={CheckCircle}
              color="text-green-600"
              bgColor="bg-green-50"
              trend={`${verifiedPercentage}% of total`}
            />
            <StatsCard
              title="Pending"
              value={pendingCount.toString()}
              icon={Clock}
              color="text-orange-600"
              bgColor="bg-orange-50"
              trend={pendingCount > 0 ? "Needs review" : "All clear"}
            />
            <StatsCard
              title="Inactive"
              value={inactiveCount.toString()}
              icon={XCircle}
              color="text-red-600"
              bgColor="bg-red-50"
              trend={`${inactivePercentage}% of total`}
            />
          </div>

          {/* Actions Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
                <div className="relative flex-1 max-w-md">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search residents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-2">
                <ActionButton icon={Upload} label="Import" variant="outline" />
                <ActionButton
                  icon={Download}
                  label="Export"
                  variant="secondary"
                />
                <ActionButton icon={UserPlus} label="Add Resident" />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}

          {/* Residents Table */}
          {!loading && residents.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Resident
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {residents.map((resident) => (
                      <ResidentRow
                        key={resident.resident_id}
                        resident={resident}
                        onViewDetails={handleViewDetails}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Showing <span className="font-semibold">1-{residents.length}</span> of{" "}
                  <span className="font-semibold">{totalResidents}</span> residents
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                    1
                  </button>
                  <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && residents.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No residents found
              </h3>
              <p className="text-slate-600">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filters."
                  : "There are no residents in your barangay yet."}
              </p>
            </div>
          )}
        </main>
      </div>
    </AppSideBar>
  );
}
