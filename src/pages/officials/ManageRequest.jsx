import React, { useState, useMemo, useCallback, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import { useRequests } from "../../hooks/useRequests";
import { OfficialOnly } from "../../components/PermissionGate";

import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Printer,
  Upload,
} from "lucide-react";

import AppSideBar from "../../components/ui/side-bar";
// import {
//   CertificateTemplates,
//   getCertificateTemplate,
// } from "../../components/certificates/CertificateTemplates";

import { getCertificateTemplate } from "../../components/ui/certificateTemplate";
import "./CertificatePrint.css";

// Constants
const STATUS_OPTIONS = ["All", "Pending", "Approved", "Denied", "Completed"];

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Approved: "bg-blue-100 text-blue-800 border-blue-200",
  Denied: "bg-red-100 text-red-800 border-red-200",
  Completed: "bg-green-100 text-green-800 border-green-200",
};

// Helpers
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Pending":
      return Clock;
    case "Approved":
      return CheckCircle;
    case "Denied":
      return XCircle;
    case "Completed":
      return CheckCircle;
    default:
      return FileText;
  }
};

// const getOrdinalSuffix = (day) => {
//   if (day > 3 && day < 21) return "th";
//   switch (day % 10) {
//     case 1:
//       return "st";
//     case 2:
//       return "nd";
//     case 3:
//       return "rd";
//     default:
//       return "th";
//   }
// };

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-20 bg-white rounded-lg animate-pulse" />
    ))}
  </div>
);

function CertificateViewer({ data, user, type }) {
  const Template = getCertificateTemplate(type);

  return (
    <div className="certificate-container">
      <Template data={data} user={user} />
    </div>
  );
}

// Navigation header
const NavigationHeader = ({ user, roleName }) => (
  <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-14.5 items-center">
        <h1 className="text-xl font-semibold text-slate-900">
          Manage Requests
        </h1>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold">{user?.fullName || "Admin"}</p>
          <p className="text-xs text-slate-600">{roleName}</p>
        </div>
      </div>
    </div>
  </nav>
);

// Page header
const PageHeader = ({ totalRequests, pendingCount }) => (
  <div className="mb-8">
    <h2 className="text-4xl font-bold">Document Requests</h2>
    <p className="text-base text-slate-600 mt-2">
      Managing {totalRequests} total requests • {pendingCount} pending review
    </p>
  </div>
);

// Stats cards
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
              <p className="text-sm text-slate-600">{stat.title}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
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

// Filters bar
const FiltersBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search requests..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-slate-400" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

// Requests Table Component
const RequestsTable = ({
  requests,
  onViewDetails,
  onApprove,
  onDeny,
  onPrintCertificate,
  isLoading,
}) => {
  if (isLoading) return <LoadingSkeleton />;

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center">
        <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No requests found
        </h3>
        <p className="text-slate-600">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Resident
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Document Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Purpose
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {requests.map((request) => {
              const StatusIcon = getStatusIcon(request.status);
              return (
                <tr
                  key={request.request_id}
                  className="hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {request.resident_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">
                      {request.type_name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600 max-w-xs truncate">
                      {request.purpose || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-600">
                      {formatDate(request.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[request.status] || "bg-slate-100 text-slate-800"}`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails(request)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {request.status === "Pending" && (
                        <>
                          <button
                            onClick={() => onApprove(request.request_id)}
                            className="text-green-600 hover:text-green-800"
                            title="Approve"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => onDeny(request.request_id)}
                            className="text-red-600 hover:text-red-800"
                            title="Deny"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {(request.status === "Approved" ||
                        request.status === "Completed") && (
                        <button
                          onClick={() => onPrintCertificate(request)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Print Certificate"
                        >
                          <Printer className="w-5 h-5" />
                        </button>
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

// Request Details Modal (kept same as before)
const RequestDetailsModal = ({
  request,
  onClose,
  onApprove,
  onDeny,
  onComplete,
}) => {
  if (!request) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Request Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Resident Name
            </label>
            <p className="text-slate-900 mt-1">{request.resident_name}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Document Type
            </label>
            <p className="text-slate-900 mt-1">{request.type_name}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Purpose
            </label>
            <p className="text-slate-900 mt-1">{request.purpose || "N/A"}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Address
            </label>
            <p className="text-slate-900 mt-1">{request.address || "N/A"}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Date Requested
            </label>
            <p className="text-slate-900 mt-1">
              {formatDate(request.created_at)}
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Status
            </label>
            <p className="text-slate-900 mt-1">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[request.status]}`}
              >
                {request.status}
              </span>
            </p>
          </div>
        </div>
        <div className="sticky bottom-0 bg-slate-50 border-t px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            Close
          </button>
          {request.status === "Pending" && (
            <>
              <button
                onClick={() => {
                  onDeny(request.request_id);
                  onClose();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Deny
              </button>
              <button
                onClick={() => {
                  onApprove(request.request_id);
                  onClose();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve
              </button>
            </>
          )}
          {request.status === "Approved" && (
            <button
              onClick={() => {
                onComplete(request.request_id);
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Mark as Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Certificate Modal with Legal Size Paper
const CertificateModal = ({ certificateData, onClose, user }) => {
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const fileInputRef = useRef();

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const printCertificate = () => {
    window.print();
  };

  const updatedData = {
    ...certificateData.data,
    photoUrl: uploadedPhoto || certificateData.data.photoUrl,
    barangayName: user?.barangayName || "Luna",
  };

  const CertificateComponent = getCertificateTemplate(certificateData.typeName);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print:hidden">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Certificate Preview - {certificateData.typeName}
            </h2>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <Upload className="w-4 h-4" /> Upload Photo
              </button>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-8 bg-gray-50">
            <div
              className="bg-white shadow-lg"
              style={{
                width: "8.5in",
                minHeight: "13in",
                margin: "0 auto",
                padding: "0.75in",
              }}
            >
              <CertificateComponent data={updatedData} user={user} />

              {/* Signatories Footer */}
              <div className="mt-16 pt-8 border-t-2 border-gray-300">
                <div className="grid grid-cols-2 gap-12">
                  <div className="text-center">
                    <div className="border-b-2 border-black mb-2 h-16"></div>
                    <p className="font-bold uppercase text-sm">
                      HON. ROMAR V. CALAMASA
                    </p>
                    <p className="text-xs">
                      Sangguniang Barangay / Officer of the Day
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="border-b-2 border-black mb-2 h-16"></div>
                    <p className="font-bold uppercase text-sm">
                      HON. JUANITO V. RAMOS
                    </p>
                    <p className="text-xs">Punong Barangay</p>
                  </div>
                </div>
                <p className="text-center text-xs mt-12 font-semibold">
                  Not valid without Dry Seal
                </p>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-slate-50 border-t px-6 py-4 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={printCertificate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Printer className="w-4 h-4" /> Print Certificate
            </button>
          </div>
        </div>
      </div>

      {/* Printable version - Legal Size */}
      <div className="hidden print:block">
        <div style={{ width: "8.5in", minHeight: "13in", padding: "0.75in" }}>
          <CertificateComponent data={updatedData} user={user} />
          <div className="mt-16 pt-8 border-t-2 border-gray-300">
            <div className="grid grid-cols-2 gap-12">
              <div className="text-center">
                <div className="border-b-2 border-black mb-2 h-16"></div>
                <p className="font-bold uppercase text-sm">
                  HON. ROMAR V. CALAMASA
                </p>
                <p className="text-xs">
                  Sangguniang Barangay / Officer of the Day
                </p>
              </div>
              <div className="text-center">
                <div className="border-b-2 border-black mb-2 h-16"></div>
                <p className="font-bold uppercase text-sm">
                  HON. JUANITO V. RAMOS
                </p>
                <p className="text-xs">Punong Barangay</p>
              </div>
            </div>
            <p className="text-center text-xs mt-12 font-semibold">
              Not valid without Dry Seal
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: legal; margin: 0; }
          body * { visibility: hidden; }
          .print\\:block, .print\\:block * { visibility: visible; }
          .print\\:block { position: absolute; left: 0; top: 0; }
        }
      `}</style>
    </>
  );
};

// Main Component
function ManageRequests() {
  const { user } = useAuth();
  const { roleName } = usePermissions();
  const {
    requests,
    isLoading,
    approveRequest,
    denyRequest,
    updateRequestStatus,
    getStats,
  } = useRequests();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateData, setCertificateData] = useState(null);

  const handlePrintCertificate = (request) => {
    const data = {
      fullName: request.resident_name,
      address: request.address || "N/A",
      purpose: request.purpose || "General Purpose",
      ctcNumber: request.ctc_number,
      validIdType: request.valid_id_type,
    };

    setCertificateData({
      typeName: request.type_name,
      data: data,
      request,
    });

    setShowCertificateModal(true);
  };

  const handleApprove = useCallback(
    (id) => approveRequest(id),
    [approveRequest],
  );
  const handleDeny = useCallback((id) => denyRequest(id), [denyRequest]);
  const handleComplete = useCallback(
    (id) => updateRequestStatus(id, "Completed", "Document completed"),
    [updateRequestStatus],
  );

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchSearch =
        request.resident_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.type_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.purpose || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchStatus =
        statusFilter === "All" || request.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  const statsData = useMemo(() => {
    const stats = getStats();
    return [
      {
        title: "Pending",
        value: stats.pending,
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        trend: "Awaiting review",
      },
      {
        title: "Approved",
        value: stats.approved,
        icon: CheckCircle,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        trend: "This week",
      },
      {
        title: "Completed",
        value: stats.completed,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        trend: "Total",
      },
      {
        title: "Denied",
        value: stats.denied,
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        trend: "Total",
      },
    ];
  }, [getStats]);

  return (
    <AppSideBar>
      <div className="min-h-screen bg-slate-100">
        <NavigationHeader user={user} roleName={roleName} />
        <main className="max-w-7xl mx-auto px-4 py-8">
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
              onViewDetails={setSelectedRequest}
              onApprove={handleApprove}
              onDeny={handleDeny}
              onPrintCertificate={handlePrintCertificate}
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
            onComplete={handleComplete}
          />
        )}
        {showCertificateModal && certificateData && (
          <CertificateModal
            certificateData={certificateData}
            onClose={() => setShowCertificateModal(false)}
            user={user}
          />
        )}
      </div>
    </AppSideBar>
  );
}

export default ManageRequests;
