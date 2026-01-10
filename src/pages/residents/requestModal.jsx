import React from "react";  
import { X, Clock, CheckCircle, XCircle, Calendar, FileText, User, MapPin, Phone, Mail } from "lucide-react";

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
                <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-3 mb-2">
                <FileText className="w-8 h-8" />
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
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
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
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Timeline
                </h3>
                
                <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
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

export default RequestDetailsModal; 