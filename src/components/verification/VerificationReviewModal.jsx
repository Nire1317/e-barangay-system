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
  Shield,
  FileText,
  ExternalLink,
} from 'lucide-react';

const VerificationReviewModal = ({
  isOpen,
  onClose,
  verification,
  onApprove,
  onReject,
  isLoading,
}) => {
  const [action, setAction] = useState(null); // 'approve' or 'reject'
  const [rejectionReason, setRejectionReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!verification) return null;

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
      await onApprove(verification.verification_id);
    } else if (action === 'reject') {
      await onReject(verification.verification_id, rejectionReason);
    }
    handleClose();
  };

  const handleClose = () => {
    setAction(null);
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
              className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Review Official Verification
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
                        ? 'Approve This Verification?'
                        : 'Reject This Verification?'}
                    </h3>
                    <p className="text-gray-600">
                      {action === 'approve'
                        ? `You are about to approve ${verification.users?.full_name}'s verification request. They will be granted official access and permissions.`
                        : `You are about to reject ${verification.users?.full_name}'s verification request with the following reason: "${rejectionReason}"`}
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
                  {/* Verification Details */}
                  <div className="p-6 space-y-6">
                    {/* Applicant Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Applicant Information
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <User className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Full Name
                            </p>
                            <p className="text-sm text-gray-900">
                              {verification.users?.full_name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Email</p>
                            <p className="text-sm text-gray-900">
                              {verification.users?.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Account Created
                            </p>
                            <p className="text-sm text-gray-900">
                              {formatDate(verification.users?.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verification Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Verification Information
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Requested Barangay
                          </p>
                          <p className="text-sm text-gray-900">
                            {verification.barangays?.barangay_name}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {verification.barangays?.municipality},{' '}
                            {verification.barangays?.province}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Requested On
                          </p>
                          <p className="text-sm text-gray-900">
                            {formatDate(verification.requested_at)}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700">Status</p>
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full mt-1 ${
                              verification.verification_status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : verification.verification_status === 'Approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {verification.verification_status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Proof Document */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Proof Document
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <p className="text-sm font-medium text-gray-700">
                            Uploaded Document
                          </p>
                        </div>

                        {verification.proof_document_url ? (
                          <div className="space-y-3">
                            {/* Image Preview */}
                            {verification.proof_document_url.match(/\.(jpg|jpeg|png|gif)$/i) && (
                              <img
                                src={verification.proof_document_url}
                                alt="Proof document"
                                className="w-full max-h-96 object-contain rounded-lg bg-white border border-gray-200"
                              />
                            )}

                            {/* View Document Button */}
                            <a
                              href={verification.proof_document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View Full Document
                            </a>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">No document uploaded</p>
                        )}
                      </div>
                    </div>

                    {/* Rejection Reason (Required for Rejection) - Only show for pending */}
                    {verification.verification_status === 'Pending' && (
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
                    )}

                    {/* Show review details for approved/rejected */}
                    {verification.verification_status !== 'Pending' && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Review Details
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          {verification.reviewed_at && (
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Reviewed On
                              </p>
                              <p className="text-sm text-gray-900">
                                {formatDate(verification.reviewed_at)}
                              </p>
                            </div>
                          )}
                          {verification.rejection_reason && (
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Rejection Reason
                              </p>
                              <p className="text-sm text-gray-900">
                                {verification.rejection_reason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions - Only show for pending */}
                  {verification.verification_status === 'Pending' && (
                    <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
                      <button
                        onClick={handleReject}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject Verification
                      </button>
                      <button
                        onClick={handleApprove}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve Verification
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VerificationReviewModal;
