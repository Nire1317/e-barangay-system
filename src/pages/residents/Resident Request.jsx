import React, { useState } from 'react';
import { FileText, Home, Send, Phone, Mail, MapPin, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

const BarangayRequestForm = () => {
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
    occupation: '',
    termsAccepted: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const documentTypes = [
    { value: 'barangay-clearance', label: 'Barangay Clearance', fee: '₱50.00', icon: '📄' },
    { value: 'indigency', label: 'Certificate of Indigency', fee: 'FREE', icon: '🏥' },
    { value: 'residency', label: 'Certificate of Residency', fee: '₱30.00', icon: '🏠' },
    { value: 'business-clearance', label: 'Barangay Business Clearance', fee: '₱500.00', icon: '💼' },
    { value: 'good-moral', label: 'Certificate of Good Moral Character', fee: '₱30.00', icon: '⭐' },
    { value: 'low-income', label: 'Certificate of Low Income', fee: 'FREE', icon: '📋' }
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.address || 
        !formData.contact || !formData.email || !formData.documentType || 
        !formData.purpose || !formData.validId || !formData.birthdate || 
        !formData.placeOfBirth || !formData.civilStatus || !formData.termsAccepted) {
      alert('Please fill in all required fields and accept the terms.');
      return;
    }
    
    const tracking = 'BRC-2024-' + String(Math.floor(Math.random() * 9000) + 1000);
    setTrackingNumber(tracking);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewRequest = () => {
    setSubmitted(false);
    setFormData({
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
      occupation: '',
      termsAccepted: false
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Request Submitted Successfully!</h1>
              <p className="text-green-100">Your document request has been received</p>
            </div>

            <div className="p-8">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
                <h2 className="font-bold text-blue-900 text-lg mb-3">Your Tracking Number</h2>
                <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                  <p className="text-3xl font-mono font-bold text-center text-blue-600">{trackingNumber}</p>
                </div>
                <p className="text-sm text-blue-800 mt-3 text-center">
                  Please save this number to track your request
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Processing</h3>
                    <p className="text-sm text-gray-600">Your request is being reviewed (3-5 business days)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Approval</h3>
                    <p className="text-sm text-gray-600">You will receive an SMS and email notification</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Claim Document</h3>
                    <p className="text-sm text-gray-600">Visit the barangay hall with valid ID and payment</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-yellow-900 mb-2">Important Reminders:</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Bring your valid ID when claiming</li>
                  <li>• Payment can be made at the barangay hall</li>
                  <li>• Processing time: 3-5 business days</li>
                  <li>• Office hours: Mon-Fri, 8:00 AM - 5:00 PM</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Contact Information:</h3>
                <p className="text-sm text-gray-600">Barangay San Isidro, Quezon City</p>
                <p className="text-sm text-gray-600">Phone: (02) 8123-4567</p>
                <p className="text-sm text-gray-600">Mobile: 0917-123-4567</p>
                <p className="text-sm text-gray-600">Email: brgy.sanisidro@qc.gov.ph</p>
              </div>

              <button
                onClick={handleNewRequest}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-t-xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Home className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Barangay San Isidro</h1>
              <p className="text-blue-100">Document Request Form</p>
            </div>
          </div>
          <div className="bg-blue-700 bg-opacity-50 rounded-lg p-4">
            <p className="text-sm text-blue-100">
              <strong>Office Hours:</strong> Mon-Fri: 8:00 AM - 5:00 PM | 
              <strong> Contact:</strong> (02) 8123-4567
            </p>
          </div>
        </div>

        {/* Information Banner */}
        <div className="bg-blue-50 border-x border-blue-200 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Requirements & Guidelines</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Valid ID (Any government-issued ID)</li>
                <li>• Community Tax Certificate (Cedula) - if applicable</li>
                <li>• Proof of residency (Barangay ID or utility bill)</li>
                <li>• Processing time: 3-5 business days</li>
                <li>• Bring original documents when claiming</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-b-xl shadow-xl border-x border-b p-8">
          {/* Document Type Selection */}
          <div className="mb-8">
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
                    <span className="text-2xl">{doc.icon}</span>
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

          {/* Personal Information Form */}
          {formData.documentType && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2">Personal Information</h2>
              
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
                    placeholder="Juan"
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
                    placeholder="Santos"
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
                    placeholder="Dela Cruz"
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
                    placeholder="Quezon City, Metro Manila"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    placeholder="Teacher, Driver, Student, etc."
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
                  placeholder="Block 5, Lot 12, Mabini Street, Barangay San Isidro"
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
                    placeholder="0917-123-4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    placeholder="juan.delacruz@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2">Document Details</h2>

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
                  placeholder="CTC-2024-12345 (Optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">If not available, you can provide this when claiming</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4" 
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I hereby certify that the information provided above is true and correct to the best of my knowledge. I understand that any false information may result in the rejection of my request.
                  </label>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Submit Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarangayRequestForm;