import React, { useState, useEffect } from 'react';
import { FileText, Phone, Mail, MapPin, Calendar, AlertCircle, Send, CheckCircle, Loader } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

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

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [requestId, setRequestId] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

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

  // --- GET LOGGED-IN USER ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Auth error:', error);
          setSubmitError('Authentication error. Please log in again.');
          setLoadingUser(false);
          return;
        }

        if (!currentUser) {
          setSubmitError('You must be logged in to submit a request.');
          setLoadingUser(false);
          return;
        }

        setUser(currentUser);
        
        // Pre-fill email if available
        if (currentUser.email) {
          setFormData(prev => ({ ...prev, email: currentUser.email }));
        }
        
        setLoadingUser(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        setSubmitError('Failed to verify authentication.');
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const generateRequestId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `REQ-${timestamp}-${random}`;
  };

  // Validation helpers
  const validatePhoneNumber = (phone) => {
    // Philippine mobile format: 09XX-XXX-XXXX or 09XXXXXXXXX
    const phoneRegex = /^(09|\+639)\d{9}$/;
    const cleaned = phone.replace(/[-\s]/g, '');
    return phoneRegex.test(cleaned);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateBirthdate = (birthdate) => {
    if (!birthdate) return false;
    const date = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();

    // Must be at least 1 year old and not more than 150 years old
    return age >= 1 && age <= 150 && date <= today;
  };

  const sanitizeInput = (input) => {
    // Basic XSS prevention
    if (!input) return input;
    return input.replace(/[<>]/g, '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSubmitError(null);
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'address', 'contact', 'email', 'birthdate', 'placeOfBirth', 'civilStatus', 'documentType', 'purpose', 'validId'];
    for (const field of required) {
      if (!formData[field]) {
        setSubmitError(`Please fill in all required fields (${field})`);
        return false;
      }
    }

    // Validate phone number format
    if (!validatePhoneNumber(formData.contact)) {
      setSubmitError('Please enter a valid Philippine mobile number (e.g., 09171234567)');
      return false;
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      setSubmitError('Please enter a valid email address');
      return false;
    }

    // Validate birthdate
    if (!validateBirthdate(formData.birthdate)) {
      setSubmitError('Please enter a valid birthdate (must be at least 1 year old and not a future date)');
      return false;
    }

    if (!termsAccepted) {
      setSubmitError('Please accept the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user || !user.id) {
      setSubmitError('You must be logged in to submit a request. Please refresh the page and try again.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Check for duplicate pending requests
      const { data: existingRequests, error: checkError } = await supabase
        .from('document_requests')
        .select('request_id, document_type')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .eq('document_type', documentTypes.find(doc => doc.value === formData.documentType)?.label);

      if (checkError) {
        console.error('Error checking for duplicates:', checkError);
      }

      if (existingRequests && existingRequests.length > 0) {
        setSubmitError(`You already have a pending request for this document type (Request ID: ${existingRequests[0].request_id}). Please wait for it to be processed.`);
        setSubmitting(false);
        return;
      }

      const newRequestId = generateRequestId();
      const selectedDoc = documentTypes.find(doc => doc.value === formData.documentType);

      const estimatedRelease = new Date();
      estimatedRelease.setDate(estimatedRelease.getDate() + 5);

      // Sanitize all text inputs to prevent XSS
      const requestData = {
        request_id: newRequestId,
        user_id: user.id,
        first_name: sanitizeInput(formData.firstName),
        middle_name: sanitizeInput(formData.middleName) || null,
        last_name: sanitizeInput(formData.lastName),
        address: sanitizeInput(formData.address),
        contact_number: formData.contact.replace(/[-\s]/g, ''), // Store clean phone number
        email: formData.email.toLowerCase().trim(),
        birthdate: formData.birthdate,
        place_of_birth: sanitizeInput(formData.placeOfBirth),
        civil_status: formData.civilStatus,
        occupation: sanitizeInput(formData.occupation) || null,
        document_type: selectedDoc?.label || formData.documentType,
        purpose: formData.purpose,
        valid_id_type: formData.validId,
        ctc_number: sanitizeInput(formData.ctcNumber) || null,
        status: 'pending',
        date_requested: new Date().toISOString(),
        estimated_release: estimatedRelease.toISOString(),
        claim_date: null,
        rejection_reason: null
      };

      console.log('Submitting request:', requestData);

      const { data, error } = await supabase
        .from('document_requests')
        .insert([requestData])
        .select();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Request submitted successfully:', data);

      setRequestId(newRequestId);
      setSubmitSuccess(true);

      // Reset form
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        address: '',
        contact: '',
        email: user.email || '',
        documentType: '',
        purpose: '',
        validId: '',
        ctcNumber: '',
        birthdate: '',
        placeOfBirth: '',
        civilStatus: '',
        occupation: ''
      });
      setTermsAccepted(false);

    } catch (err) {
      console.error('Error submitting request:', err);
      setSubmitError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state while checking authentication
  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="font-semibold text-red-800">Authentication Required</h3>
          </div>
          <p className="text-sm text-red-700">
            You must be logged in to submit a document request. Please log in and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Submitted Successfully!</h2>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Your Request ID:</p>
            <p className="text-2xl font-mono font-bold text-blue-600">{requestId}</p>
          </div>
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              ✓ Confirmation sent via email and SMS
            </p>
            <p className="text-sm text-gray-700">
              ✓ Processing time: 3-5 business days
            </p>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Please save your Request ID for tracking. You can check the status of your request in the "My Requests" section.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">Error</p>
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
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
                placeholder="e.g., Roxas, Isabela"
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
              placeholder="House/Block/Lot No., Street, Barangay Kurong Kurong"
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
              placeholder="CTC-2025-XXXXX"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">If not available, you can provide this when claiming</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                id="terms" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1" 
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I hereby certify that the information provided above is true and correct to the best of my knowledge. I understand that any false information may result in the rejection of my request.
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Submitting Request...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Request
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default NewRequestPage;