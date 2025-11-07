import React, { useState } from 'react';
import { FileText, Phone, Mail, MapPin, Calendar, AlertCircle, Send } from 'lucide-react';

const NewRequestPage = () => {
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

  return (
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
  );
};

export default NewRequestPage;