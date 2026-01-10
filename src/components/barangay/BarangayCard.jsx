import { MapPin, Building2, Map } from 'lucide-react';
import { motion } from 'framer-motion';

const BarangayCard = ({ barangay, onRequestJoin, hasExistingRequest, isRequesting }) => {
  const {
    barangay_id,
    barangay_name,
    municipality,
    province,
    region,
  } = barangay;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {barangay_name}
          </h3>
        </div>

        {/* Location Details */}
        <div className="space-y-3 mb-6 flex-grow">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Municipality</p>
              <p className="text-sm text-gray-600">{municipality}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Province</p>
              <p className="text-sm text-gray-600">{province}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Map className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Region</p>
              <p className="text-sm text-gray-600">{region}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <button
            onClick={() => onRequestJoin(barangay_id)}
            disabled={hasExistingRequest || isRequesting}
            className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 ${
              hasExistingRequest
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            } ${isRequesting ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isRequesting
              ? 'Submitting...'
              : hasExistingRequest
              ? 'Unavailable'
              : 'Request to Join'}
          </button>
          {hasExistingRequest && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Cancel your pending request first
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BarangayCard;
