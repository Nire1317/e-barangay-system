import React, { useState, useMemo, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import { useRequests } from "../../hooks/useRequests";
import { OfficialOnly } from "../../components/PermissionGate";
import {
  FileTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
  CheckIcon,
  XIcon,
} from "../../components/ui/icons";
import AppSideBar from "../../components/ui/side-bar";

// Constants
const STATUS_OPTIONS = ["All", "Pending", "Approved", "Denied", "Completed"];

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Approved: "bg-blue-100 text-blue-800 border-blue-200",
  Denied: "bg-red-100 text-red-800 border-red-200",
  Completed: "bg-green-100 text-green-800 border-green-200",
};

// Helper functions
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Pending":
      return ClockIcon;
    case "Approved":
      return CheckCircleIcon;
    case "Denied":
      return XCircleIcon;
    case "Completed":
      return CheckCircleIcon;
    default:
      return FileTextIcon;
  }
};

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-20 bg-white rounded-lg animate-pulse" />
    ))}
  </div>
);

// Navigation header component
const NavigationHeader = ({ user, roleName }) => (
  <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-14.5 items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Manage Requests
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">
              {user?.fullName || "Admin"}
            </p>
            <p className="text-xs text-slate-600 font-medium leading-tight mt-0.5">
              {roleName || "Administrator"}
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

// Page header component
const PageHeader = ({ totalRequests, pendingCount }) => (
  <div className="mb-8">
    <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">
      Document Requests
    </h2>
    <p className="text-base text-slate-600 mt-2 font-medium">
      Managing {totalRequests} total requests • {pendingCount} pending review
    </p>
  </div>
);

// Stats cards component
const StatsCards = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
    {stats.map((stat, index) => {
      const Icon = stat.icon;
      return (
        <div
          key={index}
          className="bg-white rounded-lg p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{stat.title}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {stat.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">{stat.trend}</p>
            </div>
            <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

// Filters component
const FiltersBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 mb-6">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by resident name, request type, or purpose..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="flex items-center gap-2">
        <FilterIcon className="w-5 h-5 text-slate-400" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status === "All" ? "All Status" : status}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

// Request table component
const RequestsTable = ({
  requests,
  onViewDetails,
  onApprove,
  onDeny,
  isLoading,
}) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 shadow-sm border border-slate-200 text-center">
        <FileTextIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No requests found
        </h3>
        <p className="text-slate-600">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Resident
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Request Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Purpose
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {requests.map((request) => {
              const StatusIcon = getStatusIcon(request.status);
              return (
                <tr
                  key={request.request_id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {request.resident_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {request.contact_number}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">
                      {request.type_name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 max-w-xs truncate">
                      {request.purpose || "N/A"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                        STATUS_COLORS[request.status]
                      }`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">
                      {formatDate(request.submitted_at)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewDetails(request)}
                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      {request.status === "Pending" && (
                        <>
                          <button
                            onClick={() => onApprove(request.request_id)}
                            className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeny(request.request_id)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Deny"
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Request details modal component
const RequestDetailsModal = ({ request, onClose, onApprove, onDeny }) => {
  if (!request) return null;

  const StatusIcon = getStatusIcon(request.status);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">
            Request Details
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${
                STATUS_COLORS[request.status]
              }`}
            >
              <StatusIcon className="w-4 h-4" />
              {request.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Resident Name
              </label>
              <p className="text-sm font-medium text-slate-900 mt-1">
                {request.resident_name}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Contact Number
              </label>
              <p className="text-sm font-medium text-slate-900 mt-1">
                {request.contact_number || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Request Type
              </label>
              <p className="text-sm font-medium text-slate-900 mt-1">
                {request.type_name}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Submitted Date
              </label>
              <p className="text-sm font-medium text-slate-900 mt-1">
                {formatDate(request.submitted_at)}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Purpose
            </label>
            <p className="text-sm text-slate-900 mt-1 bg-slate-50 p-4 rounded-lg">
              {request.purpose || "No purpose provided"}
            </p>
          </div>

          {request.remarks && (
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Remarks
              </label>
              <p className="text-sm text-slate-900 mt-1 bg-slate-50 p-4 rounded-lg">
                {request.remarks}
              </p>
            </div>
          )}

          {request.reviewed_by && (
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Reviewed By
                </label>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {request.reviewer_name}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Reviewed Date
                </label>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {formatDate(request.reviewed_at)}
                </p>
              </div>
            </div>
          )}
        </div>

        {request.status === "Pending" && (
          <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onDeny(request.request_id);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Deny Request
            </button>
            <button
              onClick={() => {
                onApprove(request.request_id);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              Approve Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main component
function ManageRequests() {
  const { user } = useAuth();
  const { roleName } = usePermissions();
  const { requests, isLoading, approveRequest, denyRequest, getStats } =
    useRequests();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleApprove = useCallback(
    async (requestId) => {
      const result = await approveRequest(requestId);
      if (result.success) {
        console.log("Request approved successfully");
      } else {
        console.error("Failed to approve request:", result.error);
      }
    },
    [approveRequest]
  );

  const handleDeny = useCallback(
    async (requestId) => {
      const result = await denyRequest(requestId);
      if (result.success) {
        console.log("Request denied successfully");
      } else {
        console.error("Failed to deny request:", result.error);
      }
    },
    [denyRequest]
  );

  const handleViewDetails = useCallback((request) => {
    setSelectedRequest(request);
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.resident_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.purpose &&
          request.purpose.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "All" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  const statsData = useMemo(() => {
    const stats = getStats();

    return [
      {
        title: "Pending",
        value: stats.pending,
        icon: ClockIcon,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        trend: "Awaiting review",
      },
      {
        title: "Approved",
        value: stats.approved,
        icon: CheckCircleIcon,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        trend: "This week",
      },
      {
        title: "Completed",
        value: stats.completed,
        icon: CheckCircleIcon,
        color: "text-green-600",
        bgColor: "bg-green-50",
        trend: "Total",
      },
      {
        title: "Denied",
        value: stats.denied,
        icon: XCircleIcon,
        color: "text-red-600",
        bgColor: "bg-red-50",
        trend: "Total",
      },
    ];
  }, [getStats]);

  return (
    <AppSideBar>
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
        <NavigationHeader user={user} roleName={roleName} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <OfficialOnly>
            <PageHeader
              totalRequests={requests.length}
              pendingCount={getStats().pending}
            />

            <StatsCards stats={statsData} />

            <FiltersBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            <RequestsTable
              requests={filteredRequests}
              onViewDetails={handleViewDetails}
              onApprove={handleApprove}
              onDeny={handleDeny}
              isLoading={isLoading}
            />
          </OfficialOnly>
        </main>

        {selectedRequest && (
          <RequestDetailsModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onApprove={handleApprove}
            onDeny={handleDeny}
          />
        )}
      </div>
    </AppSideBar>
  );
}

export default ManageRequests;
