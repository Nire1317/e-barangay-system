import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Calendar,
  Loader2,
} from 'lucide-react';

const RequestReviewModal = ({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
  isLoading,
}) => {
  const [action, setAction] = useState(null); // 'approve' or 'reject'
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!request) return null;

  const handleApprove = () => {
    setAction('approve');
    setShowConfirmation(true);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setAction('reject');
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (action === 'approve') {
      await onApprove(request.request_id, notes);
    } else if (action === 'reject') {
      await onReject(request.request_id, rejectionReason);
    }
    handleClose();
  };

  const handleClose = () => {
    setAction(null);
    setNotes('');
    setRejectionReason('');
    setShowConfirmation(false);
    onClose();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Review Barangay Request
                </h2>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Confirmation Dialog */}
              {showConfirmation ? (
                <div className="p-6">
                  <div className="text-center mb-6">
                    {action === 'approve' ? (
                      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    ) : (
                      <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {action === 'approve'
                        ? 'Approve This Request?'
                        : 'Reject This Request?'}
                    </h3>
                    <p className="text-gray-600">
                      {action === 'approve'
                        ? `You are about to approve ${request.users?.full_name}'s request to join your barangay. They will be granted resident access.`
                        : `You are about to reject ${request.users?.full_name}'s request with the following reason: "${rejectionReason}"`}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirmation(false)}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={isLoading}
                      className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                        action === 'approve'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Confirm {action === 'approve' ? 'Approval' : 'Rejection'}</>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Request Details */}
                  <div className="p-6 space-y-6">
                    {/* Applicant Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Applicant Information
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <User className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Full Name
                            </p>
                            <p className="text-sm text-gray-900">
                              {request.users?.full_name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Email</p>
                            <p className="text-sm text-gray-900">
                              {request.users?.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Account Created
                            </p>
                            <p className="text-sm text-gray-900">
                              {formatDate(request.users?.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Request Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Request Information
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Requested Barangay
                          </p>
                          <p className="text-sm text-gray-900">
                            {request.barangays?.barangay_name}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {request.barangays?.municipality},{' '}
                            {request.barangays?.province}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Requested On
                          </p>
                          <p className="text-sm text-gray-900">
                            {formatDate(request.requested_at)}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700">Status</p>
                          <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full mt-1">
                            Pending Review
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Approval Notes (Optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any notes about this approval..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Rejection Reason (Required for Rejection) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason{' '}
                        <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide a clear reason for rejection..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This reason will be visible to the applicant
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
                    <button
                      onClick={handleReject}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Request
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve Request
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RequestReviewModal;
