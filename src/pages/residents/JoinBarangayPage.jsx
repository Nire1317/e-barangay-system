import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useBarangayRequests } from '../../hooks/useBarangayRequests';
import { useAuth } from '../../hooks/useAuth';
import BarangayCard from '../../components/barangay/BarangayCard';

const JoinBarangayPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    barangays,
    requests,
    loading,
    error,
    fetchBarangays,
    fetchUserRequests,
    submitRequest,
    cancelRequest,
    searchBarangays,
    filterBarangays,
    getFilterOptions,
  } = useBarangayRequests();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    provinces: [],
    municipalities: [],
  });
  const [selectedFilters, setSelectedFilters] = useState({
    region: '',
    province: '',
    municipality: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [requestingBarangayId, setRequestingBarangayId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [cancellingRequestId, setCancellingRequestId] = useState(null);

  // Check if user already has an approved barangay
  const userHasBarangay = user?.barangayId;

  // Check if user has any pending request
  const hasPendingRequest = requests.some(req => req.status === 'Pending');

  // Load initial data
  useEffect(() => {
    fetchBarangays();
    fetchUserRequests();
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    const options = await getFilterOptions();
    setFilterOptions(options);
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounce search
    const timeoutId = setTimeout(() => {
      searchBarangays(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterType]: value,
    };
    setSelectedFilters(newFilters);

    // Apply filters
    if (value || selectedFilters.region || selectedFilters.province || selectedFilters.municipality) {
      filterBarangays(newFilters);
    } else {
      fetchBarangays();
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters({
      region: '',
      province: '',
      municipality: '',
    });
    setSearchTerm('');
    fetchBarangays();
  };

  // Handle request submission
  const handleRequestJoin = async (barangayId) => {
    // Check if user already has a pending request
    if (hasPendingRequest) {
      setSuccessMessage('');
      alert('You already have a pending barangay request. Please wait for it to be reviewed or cancel it first.');
      return;
    }

    try {
      setRequestingBarangayId(barangayId);
      setSuccessMessage('');

      await submitRequest(barangayId);

      setSuccessMessage('Request submitted successfully! You will be notified once reviewed.');

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('Error submitting request:', err);
      // Error is handled by the hook
    } finally {
      setRequestingBarangayId(null);
    }
  };

  // Handle cancel request
  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this barangay request?')) {
      return;
    }

    try {
      setCancellingRequestId(requestId);
      await cancelRequest(requestId);
      setSuccessMessage('Request cancelled successfully.');

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('Error cancelling request:', err);
      alert('Failed to cancel request. Please try again.');
    } finally {
      setCancellingRequestId(null);
    }
  };

  // Check if user has existing request for a barangay
  const hasExistingRequest = (barangayId) => {
    return requests.some(
      (req) =>
        req.barangay_id === barangayId &&
        (req.status === 'Pending' || req.status === 'Approved')
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Join a Barangay</h1>
          </div>
          <p className="text-gray-600">
            Browse available barangays and submit a request to join your community.
          </p>
        </motion.div>

        {/* User Already Has Barangay Warning */}
        {userHasBarangay && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                You are already a member of a barangay
              </p>
              <p className="text-sm text-blue-700 mt-1">
                You can view your requests in the{' '}
                <button
                  onClick={() => navigate('/requests')}
                  className="underline font-medium hover:text-blue-800"
                >
                  My Requests
                </button>{' '}
                page.
              </p>
            </div>
          </motion.div>
        )}

        {/* Pending Request Alert */}
        {hasPendingRequest && !userHasBarangay && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4"
          >
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="grow">
                <p className="text-sm font-medium text-amber-900">
                  You have a pending barangay request
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  You can only have one pending request at a time. Please wait for it to be reviewed or cancel it to submit a new one.
                </p>
              </div>
            </div>

            {/* Display pending request details */}
            {requests.filter(req => req.status === 'Pending').map((request) => (
              <div key={request.request_id} className="bg-white rounded-lg p-4 border border-amber-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="grow">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {request.barangays?.barangay_name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {request.barangays?.municipality}, {request.barangays?.province}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Requested on {new Date(request.requested_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancelRequest(request.request_id)}
                    disabled={cancellingRequestId === request.request_id}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancellingRequestId === request.request_id ? 'Cancelling...' : 'Cancel Request'}
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
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

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by barangay, municipality, province, or region..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {/* Region Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <select
                  value={selectedFilters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Regions</option>
                  {filterOptions.regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Province Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Province
                </label>
                <select
                  value={selectedFilters.province}
                  onChange={(e) => handleFilterChange('province', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Provinces</option>
                  {filterOptions.provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              {/* Municipality Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Municipality
                </label>
                <select
                  value={selectedFilters.municipality}
                  onChange={(e) =>
                    handleFilterChange('municipality', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Municipalities</option>
                  {filterOptions.municipalities.map((municipality) => (
                    <option key={municipality} value={municipality}>
                      {municipality}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              <div className="sm:col-span-3 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && !requestingBarangayId && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Barangay Grid */}
        {!loading && barangays.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {barangays.map((barangay) => (
              <BarangayCard
                key={barangay.barangay_id}
                barangay={barangay}
                onRequestJoin={handleRequestJoin}
                hasExistingRequest={hasExistingRequest(barangay.barangay_id) || hasPendingRequest}
                isRequesting={requestingBarangayId === barangay.barangay_id}
              />
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && barangays.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No barangays found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters to find barangays.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JoinBarangayPage;
