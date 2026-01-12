import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Calendar,
  MapPin,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabaseClient';
import VerificationReviewModal from '../../components/verification/VerificationReviewModal';
import AppSideBar from '../../components/ui/side-bar';

const SuperAdminVerificationsPage = () => {
  const { user } = useAuth();
  const [verifications, setVerifications] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
    byBarangay: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [barangayFilter, setBarangayFilter] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [processingRequest, setProcessingRequest] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch all barangays
  const fetchBarangays = async () => {
    try {
      const { data, error } = await supabase
        .from('barangays')
        .select('*')
        .order('barangay_name');

      if (error) throw error;
      setBarangays(data || []);
    } catch (err) {
      console.error('Error fetching barangays:', err);
    }
  };

  // Fetch all verifications (super admin view)
  const fetchAllVerifications = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('official_verifications')
        .select(`
          *,
          users (
            user_id,
            email,
            full_name,
            created_at
          ),
          barangays (
            barangay_id,
            barangay_name,
            municipality,
            province,
            region
          )
        `)
        .order('requested_at', { ascending: false });

      // Apply filters
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('verification_status', statusFilter);
      }

      if (barangayFilter && barangayFilter !== 'all') {
        query = query.eq('barangay_id', barangayFilter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setVerifications(data || []);
      calculateStats(data || []);
    } catch (err) {
      console.error('Error fetching verifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (data) => {
    const stats = {
      pending: data.filter((v) => v.verification_status === 'Pending').length,
      approved: data.filter((v) => v.verification_status === 'Approved').length,
      rejected: data.filter((v) => v.verification_status === 'Rejected').length,
      total: data.length,
      byBarangay: {},
    };

    // Calculate stats by barangay
    data.forEach((verification) => {
      const barangayId = verification.barangay_id;
      if (!stats.byBarangay[barangayId]) {
        stats.byBarangay[barangayId] = {
          name: verification.barangays?.barangay_name,
          pending: 0,
          approved: 0,
          rejected: 0,
          total: 0,
        };
      }
      stats.byBarangay[barangayId].total++;
      if (verification.verification_status === 'Pending') {
        stats.byBarangay[barangayId].pending++;
      } else if (verification.verification_status === 'Approved') {
        stats.byBarangay[barangayId].approved++;
      } else if (verification.verification_status === 'Rejected') {
        stats.byBarangay[barangayId].rejected++;
      }
    });

    setStats(stats);
  };

  // Load initial data
  useEffect(() => {
    fetchBarangays();
    fetchAllVerifications();
  }, []);

  // Reload when filters change
  useEffect(() => {
    fetchAllVerifications();
  }, [statusFilter, barangayFilter]);

  // Filter verifications based on search
  const filteredVerifications = verifications.filter((verification) => {
    const matchesSearch =
      searchTerm === '' ||
      verification.users?.full_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      verification.users?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.barangays?.barangay_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Handle view verification
  const handleViewVerification = (verification) => {
    setSelectedVerification(verification);
    setShowReviewModal(true);
  };

  // Handle approve verification
  const handleApproveVerification = async (verificationId) => {
    try {
      setProcessingRequest(true);

      // Get verification details
      const { data: verification, error: fetchError } = await supabase
        .from('official_verifications')
        .select('*, users(user_id, email, full_name)')
        .eq('verification_id', verificationId)
        .eq('verification_status', 'Pending')
        .single();

      if (fetchError) throw fetchError;
      if (!verification) throw new Error('Verification not found or already processed');

      // Update verification status
      const { error: updateError } = await supabase
        .from('official_verifications')
        .update({
          verification_status: 'Approved',
          reviewed_at: new Date().toISOString(),
        })
        .eq('verification_id', verificationId);

      if (updateError) throw updateError;

      // Update user role to official
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          role: 'official',
          is_verified: true,
        })
        .eq('user_id', verification.user_id);

      if (userUpdateError) throw userUpdateError;

      // Log activity
      await supabase.from('activity_logs').insert([
        {
          user_id: user.id,
          action: 'official_verification_approved',
          details: `Super Admin approved official verification ${verificationId} for user ${verification.users?.full_name || verification.user_id}`,
        },
      ]);

      setSuccessMessage(
        'Verification approved successfully! User has been granted official access.'
      );

      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

      setShowReviewModal(false);
      setSelectedVerification(null);
      fetchAllVerifications();
    } catch (err) {
      console.error('Error approving verification:', err);
      alert('Failed to approve verification. Please try again.');
    } finally {
      setProcessingRequest(false);
    }
  };

  // Handle reject verification
  const handleRejectVerification = async (verificationId, reason) => {
    try {
      setProcessingRequest(true);

      // Get verification details
      const { data: verification, error: fetchError } = await supabase
        .from('official_verifications')
        .select('*, users(user_id, email, full_name)')
        .eq('verification_id', verificationId)
        .eq('verification_status', 'Pending')
        .single();

      if (fetchError) throw fetchError;
      if (!verification) throw new Error('Verification not found or already processed');

      // Update verification status
      const { error: updateError } = await supabase
        .from('official_verifications')
        .update({
          verification_status: 'Rejected',
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason,
        })
        .eq('verification_id', verificationId);

      if (updateError) throw updateError;

      // Log activity
      await supabase.from('activity_logs').insert([
        {
          user_id: user.id,
          action: 'official_verification_rejected',
          details: `Super Admin rejected official verification ${verificationId} for user ${verification.users?.full_name || verification.user_id}. Reason: ${reason}`,
        },
      ]);

      setSuccessMessage('Verification rejected successfully.');

      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

      setShowReviewModal(false);
      setSelectedVerification(null);
      fetchAllVerifications();
    } catch (err) {
      console.error('Error rejecting verification:', err);
      alert('Failed to reject verification. Please try again.');
    } finally {
      setProcessingRequest(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get top barangays by pending verifications
  const topBarangays = Object.entries(stats.byBarangay)
    .sort((a, b) => b[1].pending - a[1].pending)
    .slice(0, 5);

  return (
    <AppSideBar>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Super Admin Verification Dashboard
              </h1>
            </div>
            <p className="text-gray-600">
              Manage all official verification requests across all barangays.
            </p>
          </motion.div>

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
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
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </motion.div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Verifications
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">
                    {stats.pending}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {stats.approved}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {stats.rejected}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Top Barangays Widget */}
          {topBarangays.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6 mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Top Barangays by Pending Verifications
                </h3>
              </div>
              <div className="space-y-3">
                {topBarangays.map(([barangayId, data]) => (
                  <div key={barangayId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {data.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-600">
                        Total: {data.total}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                        {data.pending} pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or barangay..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <select
                  value={barangayFilter}
                  onChange={(e) => setBarangayFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Barangays</option>
                  {barangays.map((barangay) => (
                    <option key={barangay.barangay_id} value={barangay.barangay_id}>
                      {barangay.barangay_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && !processingRequest && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}

          {/* Verifications Table */}
          {!loading && filteredVerifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Barangay
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requested On
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVerifications.map((verification) => (
                      <tr
                        key={verification.verification_id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {verification.users?.full_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {verification.users?.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {verification.barangays?.barangay_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {formatDate(verification.requested_at)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                              verification.verification_status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : verification.verification_status === 'Approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {verification.verification_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {verification.verification_status === 'Pending' ? (
                            <button
                              onClick={() => handleViewVerification(verification)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              Review
                            </button>
                          ) : (
                            <button
                              onClick={() => handleViewVerification(verification)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && filteredVerifications.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-lg shadow-md"
            >
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No verifications found
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || barangayFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'There are no official verification requests at the moment.'}
              </p>
            </motion.div>
          )}

          {/* Review Modal */}
          <VerificationReviewModal
            isOpen={showReviewModal}
            onClose={() => {
              setShowReviewModal(false);
              setSelectedVerification(null);
            }}
            verification={selectedVerification}
            onApprove={handleApproveVerification}
            onReject={handleRejectVerification}
            isLoading={processingRequest}
          />
        </div>
      </div>
    </AppSideBar>
  );
};

export default SuperAdminVerificationsPage;
