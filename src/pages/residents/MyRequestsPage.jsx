import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const MyRequestsPage = () => {
  const [myRequests] = useState([
    {
      id: 'BRC-2024-089',
      documentType: 'Barangay Clearance',
      purpose: 'Employment',
      dateRequested: '2024-11-01',
      status: 'approved',
      claimDate: '2024-11-05'
    },
    {
      id: 'IND-2024-045',
      documentType: 'Indigency Certificate',
      purpose: 'Medical Assistance',
      dateRequested: '2024-10-28',
      status: 'pending',
      estimatedRelease: '2024-11-08'
    },
    {
      id: 'BRC-2024-067',
      documentType: 'Barangay Clearance',
      purpose: 'Business Permit',
      dateRequested: '2024-10-20',
      status: 'rejected',
      rejectionReason: 'Incomplete requirements - Missing cedula'
    }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">My Document Requests</h2>
          <p className="text-gray-600 mt-1">Track the status of your submitted requests</p>
        </div>

        <div className="divide-y divide-gray-200">
          {myRequests.map((request) => (
            <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-bold text-gray-900">{request.id}</span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">{request.documentType}</h3>
                  <p className="text-sm text-gray-600">Purpose: {request.purpose}</p>
                  <p className="text-sm text-gray-500 mt-2">Requested on: {request.dateRequested}</p>
                  
                  {request.status === 'approved' && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-green-800">
                        ✓ Ready for claiming on {request.claimDate}
                      </p>
                      <p className="text-xs text-green-700 mt-1">Please bring valid ID and original documents</p>
                    </div>
                  )}
                  
                  {request.status === 'pending' && (
                    <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-yellow-800">
                        ⏳ Estimated release: {request.estimatedRelease}
                      </p>
                    </div>
                  )}
                  
                  {request.status === 'rejected' && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-red-800">Reason:</p>
                      <p className="text-sm text-red-700">{request.rejectionReason}</p>
                    </div>
                  )}
                </div>
                
                <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm hover:underline whitespace-nowrap">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyRequestsPage;