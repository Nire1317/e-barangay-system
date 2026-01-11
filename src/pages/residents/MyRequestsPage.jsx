import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, AlertCircle, MapPin, X } from "lucide-react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { useBarangayRequests } from "../../hooks/useBarangayRequests";
import RequestStatusBadge from "../../components/barangay/RequestStatusBadge";

// Initialize Supabase client
const supabase = createClient(
  "https://ubektynslrflctveqiut.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZWt0eW5zbHJmbGN0dmVxaXV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUzMjI0MSwiZXhwIjoyMDc3MTA4MjQxfQ.aS4H698N6x-K4BQ-1JRecWZ2Bh3l9MDZtmN_GghJnTw"
);

// --- Request Details Modal ---
const RequestDetailsModal = ({ isOpen, onClose, request }) => {
  if (!isOpen || !request) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "approved":
        return <CheckCircle className="w-5 h-5" />;
      case "rejected":
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Request Details</h2>
          </div>

          <p className="text-blue-100 font-mono text-sm">
            Request ID: {request.request_id}
          </p>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="mb-6">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                request.status
              )}`}
            >
              {getStatusIcon(request.status)}
              Status: {request.status.toUpperCase()}
            </span>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Document Information
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Document Type
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {request.document_type}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Purpose
                  </p>
                  <p className="text-gray-900">{request.purpose}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Number of Copies
                </p>
                <p className="text-gray-900">
                  {request.copies || 1}{" "}
                  {request.copies > 1 ? "copies" : "copy"}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Date Requested
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(request.submitted_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {request.estimated_release && (
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-100 rounded-full p-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Estimated Release
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {new Date(request.estimated_release).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {request.claim_date && (
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Claim Date
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {new Date(request.claim_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Barangay Request Details Modal ---
const BarangayRequestDetailsModal = ({ isOpen, onClose, request, onCancel }) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Barangay Request Details</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <RequestStatusBadge status={request.status} size="lg" />
          </div>

          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Barangay Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Barangay Name
                </p>
                <p className="text-gray-900 font-semibold text-lg">
                  {request.barangays?.barangay_name || 'N/A'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Municipality
                  </p>
                  <p className="text-gray-900">
                    {request.barangays?.municipality || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Province
                  </p>
                  <p className="text-gray-900">
                    {request.barangays?.province || 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Region
                </p>
                <p className="text-gray-900">
                  {request.barangays?.region || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Requested On
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(request.requested_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {request.reviewed_at && (
                <div className="flex items-start gap-3">
                  <div className={`rounded-full p-2 ${
                    request.status === 'Approved' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {request.status === 'Approved' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Reviewed On
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {new Date(request.reviewed_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rejection Reason */}
          {request.status === 'Rejected' && request.rejection_reason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
              <h3 className="text-lg font-bold text-red-800 mb-2">
                Rejection Reason
              </h3>
              <p className="text-red-700">{request.rejection_reason}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex gap-3">
          {request.status === 'Pending' && (
            <button
              onClick={() => onCancel(request.request_id)}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Cancel Request
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const MyRequestsPage = () => {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBarangayRequest, setSelectedBarangayRequest] = useState(null);
  const [isBarangayModalOpen, setIsBarangayModalOpen] = useState(false);

  // Use barangay requests hook
  const {
    requests: barangayRequests,
    loading: barangayLoading,
    error: barangayError,
    fetchUserRequests,
    cancelRequest,
  } = useBarangayRequests();

  // --- GET LOGGED-IN USER ---
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      setUserId(user.id);
      fetchRequests(user.id);
      fetchUserRequests(); // Fetch barangay requests
    };

    fetchUser();
  }, []);

  // --- FETCH DOCUMENT REQUESTS ---
  const fetchRequests = async (uid) => {
    try {
      setLoading(true);
      setError(null);

      // First, get the resident_id for this user
      const { data: residentData, error: residentError } = await supabase
        .from('residents')
        .select('resident_id')
        .eq('user_id', uid)
        .single();

      if (residentError) {
        // If no resident record exists, just set empty array
        if (residentError.code === 'PGRST116') {
          setMyRequests([]);
          return;
        }
        throw residentError;
      }

      if (!residentData) {
        setMyRequests([]);
        return;
      }

      // Then, get the requests for this resident with type information
      const { data, error } = await supabase
        .from("requests")
        .select(`
          *,
          request_types!inner (
            type_name
          )
        `)
        .eq("resident_id", residentData.resident_id)
        .order("submitted_at", { ascending: false });

      if (error) throw error;

      // Transform data to include document_type for backward compatibility
      const transformedData = (data || []).map(request => ({
        ...request,
        document_type: request.request_types?.type_name || 'Unknown',
      }));

      setMyRequests(transformedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // --- MODAL HANDLERS ---
  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const openBarangayModal = (request) => {
    setSelectedBarangayRequest(request);
    setIsBarangayModalOpen(true);
  };
  const closeBarangayModal = () => {
    setIsBarangayModalOpen(false);
    setSelectedBarangayRequest(null);
  };

  // Handle cancel barangay request
  const handleCancelBarangayRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this barangay request?')) {
      return;
    }

    try {
      await cancelRequest(requestId);
      closeBarangayModal();
    } catch (err) {
      console.error('Error cancelling request:', err);
    }
  };

  // --- STATUS BADGES ---
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "denied":
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "denied":
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // --- LOADING & ERROR ---
  if (loading || barangayLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your requests...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="font-semibold text-red-800">Error Loading Requests</h3>
          </div>
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => userId && fetchRequests(userId)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  // --- MAIN UI ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* --- BARANGAY REQUESTS SECTION --- */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                My Barangay Requests
              </h2>
            </div>
            <p className="text-gray-600 mt-1">
              Track your barangay membership requests
            </p>
          </div>

          {barangayError && (
            <div className="p-4 bg-red-50 border-b border-red-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-700">{barangayError}</p>
              </div>
            </div>
          )}

          {barangayRequests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <MapPin className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Barangay Requests Yet
              </h3>
              <p className="text-gray-600 mb-4">
                You haven't submitted any barangay membership requests.
              </p>
              <a
                href="/join-barangay"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Join a Barangay
              </a>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {barangayRequests.map((request) => (
                <div
                  key={request.request_id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <RequestStatusBadge status={request.status} />
                      </div>

                      <h3 className="font-semibold text-lg text-gray-800 mb-1">
                        {request.barangays?.barangay_name || 'Unknown Barangay'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {request.barangays?.municipality}, {request.barangays?.province}
                      </p>
                      <p className="text-sm text-gray-500">
                        Requested on:{" "}
                        {new Date(request.requested_at).toLocaleDateString()}
                      </p>

                      {request.status === 'Rejected' && request.rejection_reason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">
                            <span className="font-semibold">Reason: </span>
                            {request.rejection_reason}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => openBarangayModal(request)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm hover:underline whitespace-nowrap"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- MY REQUESTS LIST --- */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              My Document Requests
            </h2>
            <p className="text-gray-600 mt-1">
              Track the status of your submitted requests
            </p>
          </div>

          {myRequests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Clock className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Requests Yet
              </h3>
              <p className="text-gray-600">
                You haven't submitted any document requests.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {myRequests.map((request) => {
                const isCompleted = request.status?.toLowerCase() === 'completed';
                const isApproved = request.status?.toLowerCase() === 'approved';

                return (
                  <div
                    key={request.request_id}
                    className={`p-6 transition-colors ${
                      isCompleted
                        ? 'bg-green-50 hover:bg-green-100 border-l-4 border-green-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm font-bold text-gray-900">
                            {request.request_id}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {getStatusIcon(request.status)}
                            {request.status?.toUpperCase()}
                          </span>
                        </div>

                        <h3 className="font-semibold text-lg text-gray-800 mb-1">
                          {request.document_type}
                        </h3>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Purpose:</span> {request.purpose}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          <span className="font-medium">Requested on:</span>{" "}
                          {new Date(request.submitted_at).toLocaleDateString()}
                        </p>

                        {/* Ready for Pickup Alert */}
                        {isCompleted && (
                          <div className="mt-3 flex items-start gap-2 p-3 bg-green-100 border border-green-300 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-bold text-green-900">
                                Ready for Pickup!
                              </p>
                              <p className="text-xs text-green-800 mt-1">
                                Your document is ready. Please bring a valid ID when claiming.
                              </p>
                              {request.estimated_release && (
                                <p className="text-xs text-green-700 mt-1">
                                  <span className="font-semibold">Claim by:</span>{" "}
                                  {new Date(request.estimated_release).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Processing Alert */}
                        {isApproved && (
                          <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-blue-900">
                                Being Processed
                              </p>
                              <p className="text-xs text-blue-800 mt-1">
                                Your request has been approved and is currently being processed.
                              </p>
                              {request.estimated_release && (
                                <p className="text-xs text-blue-700 mt-1">
                                  <span className="font-semibold">Estimated release:</span>{" "}
                                  {new Date(request.estimated_release).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Remarks */}
                        {request.remarks && (
                          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-xs font-semibold text-gray-700 mb-1">
                              Remarks:
                            </p>
                            <p className="text-sm text-gray-600">{request.remarks}</p>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => openModal(request)}
                        className={`text-sm font-semibold hover:underline whitespace-nowrap px-4 py-2 rounded-lg transition-colors ${
                          isCompleted
                            ? 'text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200'
                            : 'text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100'
                        }`}
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* --- REQUEST DETAILS MODAL --- */}
      <RequestDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        request={selectedRequest}
      />

      {/* --- BARANGAY REQUEST DETAILS MODAL --- */}
      <BarangayRequestDetailsModal
        isOpen={isBarangayModalOpen}
        onClose={closeBarangayModal}
        request={selectedBarangayRequest}
        onCancel={handleCancelBarangayRequest}
      />
    </div>
  );
};

export default MyRequestsPage;
