import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Clock,
  XCircle as XCircleIcon,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useOfficialVerifications } from '../../hooks/useOfficialVerifications';
import { useBarangayRequests } from '../../hooks/useBarangayRequests';
import { supabase } from '../../services/supabaseClient';

const RequestOfficialVerificationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    userVerification,
    loading,
    error,
    fetchUserVerification,
    submitVerification,
    cancelVerification,
  } = useOfficialVerifications();

  const { barangays, fetchBarangays } = useBarangayRequests();

  const [selectedBarangay, setSelectedBarangay] = useState('');
  const [proofDocument, setProofDocument] = useState(null);
  const [proofDocumentPreview, setProofDocumentPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [cancellingRequest, setCancellingRequest] = useState(false);

  useEffect(() => {
    fetchUserVerification();
    fetchBarangays();
  }, []);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image (JPEG, PNG) or PDF file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setProofDocument(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofDocumentPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setProofDocumentPreview(null);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setProofDocument(null);
    setProofDocumentPreview(null);
  };

  // Upload document to Supabase Storage
  const uploadDocument = async () => {
    if (!proofDocument) {
      throw new Error('No document selected');
    }

    setUploading(true);

    try {
      const fileExt = proofDocument.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `verification-proofs/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, proofDocument);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Error uploading document:', err);
      throw new Error('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBarangay) {
      alert('Please select a barangay');
      return;
    }

    if (!proofDocument) {
      alert('Please upload a proof document');
      return;
    }

    try {
      setSubmitting(true);

      // Upload document first
      const documentUrl = await uploadDocument();

      // Submit verification request
      await submitVerification(selectedBarangay, documentUrl);

      setSuccessMessage('Verification request submitted successfully!');
      setSelectedBarangay('');
      setProofDocument(null);
      setProofDocumentPreview(null);

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('Error submitting verification:', err);
      alert(err.message || 'Failed to submit verification request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel request
  const handleCancelRequest = async () => {
    if (!userVerification?.verification_id) return;

    if (!window.confirm('Are you sure you want to cancel your verification request?')) {
      return;
    }

    try {
      setCancellingRequest(true);
      await cancelVerification(userVerification.verification_id);
      setSuccessMessage('Verification request cancelled successfully.');

      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('Error cancelling request:', err);
      alert('Failed to cancel request. Please try again.');
    } finally {
      setCancellingRequest(false);
    }
  };

  const hasPendingVerification =
    userVerification?.verification_status === 'Pending';
  const hasApprovedVerification =
    userVerification?.verification_status === 'Approved';
  const hasRejectedVerification =
    userVerification?.verification_status === 'Rejected';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Request Official Verification
            </h1>
          </div>
          <p className="text-gray-600">
            Submit your credentials to become a verified barangay official.
          </p>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">{successMessage}</p>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </motion.div>
        )}

        {/* Already Approved Notice */}
        {hasApprovedVerification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Verification Approved
                </h3>
                <p className="text-green-800 mb-4">
                  Your official verification has been approved! You now have access to official features.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pending Request Notice */}
        {hasPendingVerification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6"
          >
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="grow">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                  Verification Pending
                </h3>
                <p className="text-amber-800 mb-2">
                  Your verification request is currently under review.
                </p>
                <p className="text-sm text-amber-700 mb-4">
                  Submitted on:{' '}
                  {new Date(userVerification.requested_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <button
                  onClick={handleCancelRequest}
                  disabled={cancellingRequest}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {cancellingRequest ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-4 h-4" />
                      Cancel Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Rejected Request Notice */}
        {hasRejectedVerification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6"
          >
            <div className="flex items-start gap-3">
              <XCircleIcon className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Verification Rejected
                </h3>
                <p className="text-red-800 mb-2">
                  Your verification request was rejected.
                </p>
                {userVerification.rejection_reason && (
                  <div className="bg-white rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                    <p className="text-sm text-gray-900">
                      {userVerification.rejection_reason}
                    </p>
                  </div>
                )}
                <p className="text-sm text-red-700">
                  You can submit a new verification request with updated documents.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Verification Form */}
        {(!userVerification || hasRejectedVerification) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Barangay Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Barangay <span className="text-red-600">*</span>
                </label>
                <select
                  value={selectedBarangay}
                  onChange={(e) => setSelectedBarangay(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a barangay...</option>
                  {barangays.map((barangay) => (
                    <option key={barangay.barangay_id} value={barangay.barangay_id}>
                      {barangay.barangay_name} - {barangay.municipality},{' '}
                      {barangay.province}
                    </option>
                  ))}
                </select>
              </div>

              {/* Proof Document Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Proof Document <span className="text-red-600">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Upload a valid government-issued ID or official appointment letter (Max 5MB, JPEG/PNG/PDF)
                </p>

                {!proofDocument ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="mb-2 text-sm text-gray-600">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">JPEG, PNG, or PDF (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={handleFileSelect}
                    />
                  </label>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {proofDocument.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(proofDocument.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Image Preview */}
                    {proofDocumentPreview && (
                      <img
                        src={proofDocumentPreview}
                        alt="Document preview"
                        className="w-full h-48 object-contain rounded-lg bg-gray-50"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-2">
                      Important Information
                    </p>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>Your request will be reviewed by barangay administrators</li>
                      <li>Ensure your proof document is clear and valid</li>
                      <li>You will be notified once your request is processed</li>
                      <li>Approval grants you access to official features</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || uploading || loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting || uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {uploading ? 'Uploading Document...' : 'Submitting Request...'}
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Submit Verification Request
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RequestOfficialVerificationPage;
