import React, { useState } from 'react';
import { FileText, Home, Clock, CheckCircle, XCircle, Send, User, Phone, Mail, MapPin, Calendar, AlertCircle } from 'lucide-react';
import NavSidebar from '../../components/ui/signOut-btn';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('new-request');
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    address: '',
    contact: '',
    email: '',
    documentType: '',
    purpose: '',
    validId: '',
    ctcNumber: '',
    birthdate: '',
    placeOfBirth: '',
    civilStatus: '',
    occupation: ''
  });

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

  const documentTypes = [
    { value: 'barangay-clearance', label: 'Barangay Clearance', fee: '₱50.00' },
    { value: 'indigency', label: 'Certificate of Indigency', fee: 'FREE' },
    { value: 'residency', label: 'Certificate of Residency', fee: '₱30.00' },
    { value: 'business-clearance', label: 'Barangay Business Clearance', fee: '₱500.00' },
    { value: 'good-moral', label: 'Certificate of Good Moral Character', fee: '₱30.00' },
    { value: 'low-income', label: 'Certificate of Low Income', fee: 'FREE' }
  ];

  const validIdTypes = [
    'Philippine Passport',
    'Driver\'s License',
    'SSS ID',
    'GSIS ID',
    'UMID',
    'Postal ID',
    'Voter\'s ID',
    'National ID (PhilSys)',
    'PRC ID',
    'Senior Citizen ID',
    'PWD ID'
  ];

  const purposes = [
    'Employment (Local)',
    'Employment (Abroad)',
    'Business Permit Application',
    'Bank Requirement',
    'Loan Application',
    'School Requirement',
    'Medical Assistance',
    'Scholarship Application',
    'Police Clearance',
    'NBI Clearance',
    'Visa Application',
    'Government Transaction',
    'Court Requirement',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Request submitted successfully! You will receive a confirmation via SMS and email.');
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
  <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
    
    {/* Logo and Title */}
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
        <Home className="w-10 h-10 text-blue-600" />
      </div>
      <div>
        <h1 className="text-3xl font-bold">Barangay Kurong Kurong</h1>
        <p className="text-blue-100 mt-1">Barangay Online Services System (BOSS)</p>
      </div>
    </div>

    {/* Office Info */}
    <div className="text-right hidden md:block">
      <p className="text-sm text-blue-100">Office Hours</p>
      <p className="font-semibold">Mon-Fri: 8:00 AM - 5:00 PM</p>
      <p className="text-sm text-blue-100 mt-1">Contact: (02) 8123-4567</p>
    </div>

    {/* Sign Out / Nav */}
    <div className="flex items-center gap-4 w-32 justify-end">
      <NavSidebar isOpen={true} isMobile={false} />
    </div>

  </div>
</div>


      {/* Navigation Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveView('new-request')}
              className={`px-6 py-4 font-semibold transition-all ${
                activeView === 'new-request'
                  ? 'bg-blue-600 text-white border-b-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>New Request</span>
              </div>
            </button>
            <button
              onClick={() => setActiveView('my-requests')}
              className={`px-6 py-4 font-semibold transition-all ${
                activeView === 'my-requests'
                  ? 'bg-blue-600 text-white border-b-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>My Requests</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* New Request Form */}
        {activeView === 'new-request' && (
          <div>
            {/* Information Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Requirements for Document Request</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Valid ID (Any government-issued ID)</li>
                    <li>• Community Tax Certificate (Cedula) - if applicable</li>
                    <li>• Proof of residency (Barangay ID or any utility bill)</li>
                    <li>• Processing time: 3-5 business days</li>
                    <li>• Bring original documents when claiming</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Document Type Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Document Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTypes.map((doc) => (
                  <button
                    key={doc.value}
                    onClick={() => setFormData(prev => ({ ...prev, documentType: doc.value }))}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.documentType === doc.value
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <FileText className={`w-6 h-6 ${
                        formData.documentType === doc.value ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        doc.fee === 'FREE' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {doc.fee}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm">{doc.label}</h3>
                  </button>
                ))}
              </div>
            </div>

            {/* Request Form */}
            {formData.documentType && (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="birthdate"
                      value={formData.birthdate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Place of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={handleInputChange}
                      placeholder="e.g., Quezon City, Metro Manila"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Civil Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="civilStatus"
                      value={formData.civilStatus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Civil Status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="widowed">Widowed</option>
                      <option value="separated">Separated</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      placeholder="e.g., Teacher, Driver, Student"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Complete Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House/Block/Lot No., Street, Barangay"
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="09XX-XXX-XXXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-8">Document Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Purpose <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Purpose</option>
                      {purposes.map(purpose => (
                        <option key={purpose} value={purpose}>{purpose}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Valid ID Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="validId"
                      value={formData.validId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select ID Type</option>
                      {validIdTypes.map(id => (
                        <option key={id} value={id}>{id}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Community Tax Certificate (CTC) Number
                  </label>
                  <input
                    type="text"
                    name="ctcNumber"
                    value={formData.ctcNumber}
                    onChange={handleInputChange}
                    placeholder="CTC-2024-XXXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">If not available, you can provide this when claiming</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="terms" className="mt-1" required />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      I hereby certify that the information provided above is true and correct to the best of my knowledge. I understand that any false information may result in the rejection of my request.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Submit Request
                </button>
              </form>
            )}
          </div>
        )}

        {/* My Requests View */}
        {activeView === 'my-requests' && (
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
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white mt-12">
  <div className="max-w-6xl mx-auto px-6 py-4"> {/* reduced py from 8 to 4 */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* reduced gap from 8 to 4 */}
      <div>
        <h3 className="font-bold mb-2">Contact Information</h3> {/* mb-3 -> mb-2 */}
        <p className="text-gray-300 text-sm">Barangay Hall, Kurong Kurong</p>
        <p className="text-gray-300 text-sm">Roxas, Isabela</p>
        <p className="text-gray-300 text-sm mt-1">Tel: (02) 8123-4567</p> {/* mt-2 -> mt-1 */}
        <p className="text-gray-300 text-sm">Mobile: 0917-123-4567</p>
      </div>
      <div>
        <h3 className="font-bold mb-2">Office Hours</h3>
        <p className="text-gray-300 text-sm">Monday - Friday</p>
        <p className="text-gray-300 text-sm">8:00 AM - 5:00 PM</p>
        <p className="text-gray-300 text-sm mt-1">Closed on weekends and holidays</p>
      </div>
      <div>
        <h3 className="font-bold mb-2">Follow Us</h3>
        <p className="text-gray-300 text-sm">Facebook: @Barangaykurong-kurong, RX</p>
        <p className="text-gray-300 text-sm">Email: brgy.kurong-kurong@qc.gov.ph</p>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-400 text-sm"> {/* mt-8 -> mt-6, pt-6 -> pt-4 */}
      <p>© 2024 Barangay kurong-kurong. All rights reserved.</p>
    </div>
  </div>
</div>

    </div>
  );
};

export default  Dashboard;