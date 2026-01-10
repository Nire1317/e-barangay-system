import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
//Note: This is just a experimental thats why the supabase init is here.
// i dont know how to do it properly with the current project structure.
// Please refactor this part later.
const supabase = createClient(
  "https://ubektynslrflctveqiut.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZWt0eW5zbHJmbGN0dmVxaXV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUzMjI0MSwiZXhwIjoyMDc3MTA4MjQxfQ.aS4H698N6x-K4BQ-1JRecWZ2Bh3l9MDZtmN_GghJnTw"
);

// Request Details Modal Component
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
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
          {/* Status Badge */}
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

          {/* Document Information */}
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
                  <p className="text-gray-900">
                    {request.purpose}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Number of Copies
                </p>
                <p className="text-gray-900">
                  {request.copies || 1} {request.copies > 1 ? 'copies' : 'copy'}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Timeline
            </h3>
            
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
                    {new Date(request.date_requested).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
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
                      {new Date(request.estimated_release).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
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
                      {new Date(request.claim_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status-specific Information */}
          {request.status === "approved" && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 mb-6">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Ready for Claiming
              </h3>
              <div className="space-y-2 text-sm text-green-700">
                <p className="font-semibold">What to bring:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Valid government-issued ID</li>
                  <li>Original documents (if required)</li>
                  <li>This request ID: <span className="font-mono font-bold">{request.request_id}</span></li>
                </ul>
                <p className="mt-3 text-xs text-green-600">
                  Please proceed to the Registrar's Office during office hours.
                </p>
              </div>
            </div>
          )}

          {request.status === "pending" && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5 mb-6">
              <h3 className="text-lg font-bold text-yellow-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Processing
              </h3>
              <p className="text-sm text-yellow-700">
                Your request is currently being processed. You will be notified once it's ready for claiming.
              </p>
            </div>
          )}

          {request.status === "rejected" && request.rejection_reason && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 mb-6">
              <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Request Rejected
              </h3>
              <p className="text-sm font-semibold text-red-700 mb-2">Reason:</p>
              <p className="text-sm text-red-600 bg-white rounded-lg p-3">
                {request.rejection_reason}
              </p>
              <p className="text-xs text-red-600 mt-3">
                Please contact the Registrar's Office for more information or to resubmit your request.
              </p>
            </div>
          )}

          {/* Additional Notes */}
          {request.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-blue-800 mb-2">
                Additional Notes
              </h3>
              <p className="text-sm text-blue-700">
                {request.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
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

// Main Component
const MyRequestsPage = () => {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- GET LOGGED-IN USER ---
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        setError("Authentication Error");
        setLoading(false);
        return;
      }

      if (!user) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      setUserId(user.id);
      fetchRequests(user.id);
    };

    fetchUser();
  }, []);

  // --- FETCH DOCUMENT REQUESTS ---
  const fetchRequests = async (uid) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("document_requests")
        .select("*")
        .eq("user_id", uid)
        .order("date_requested", { ascending: false });

      if (error) throw error;

      setMyRequests(data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
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

  // --- STATUS BADGES ---
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
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // --- LOADING ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your requests...</p>
        </div>
      </div>
    );
  }

  // --- ERROR ---
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="font-semibold text-red-800">
              Error Loading Requests
            </h3>
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
  }

  // --- MAIN UI ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
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
              {myRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono font-bold text-gray-900">
                          {request.request_id}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {getStatusIcon(request.status)}
                          {request.status.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="font-semibold text-lg text-gray-800 mb-1">
                        {request.document_type}
                      </h3>

                      <p className="text-sm text-gray-600">
                        Purpose: {request.purpose}
                      </p>

                      <p className="text-sm text-gray-500 mt-2">
                        Requested on:{" "}
                        {new Date(request.date_requested).toLocaleDateString()}
                      </p>

                      {/* APPROVED */}
                      {request.status === "approved" &&
                        request.claim_date && (
                          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-green-800">
                              ✓ Ready for claiming on{" "}
                              {new Date(
                                request.claim_date
                              ).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-green-700 mt-1">
                              Please bring valid ID and original documents
                            </p>
                          </div>
                        )}

                      {/* PENDING */}
                      {request.status === "pending" &&
                        request.estimated_release && (
                          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-yellow-800">
                              ⏳ Estimated release:{" "}
                              {new Date(
                                request.estimated_release
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                      {/* REJECTED */}
                      {request.status === "rejected" &&
                        request.rejection_reason && (
                          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-red-800">
                              Reason:
                            </p>
                            <p className="text-sm text-red-700">
                              {request.rejection_reason}
                            </p>
                          </div>
                        )}
                    </div>

                    <button 
                      onClick={() => openModal(request)}
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
      </div>

      {/* Modal */}
      <RequestDetailsModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        request={selectedRequest}
      />
    </div>
  );
};

export default MyRequestsPage;