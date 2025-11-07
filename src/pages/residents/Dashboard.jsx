import React, { useState } from 'react';
import { FileText, Home, Clock } from 'lucide-react';
import NavSidebar from '../../components/ui/signOut-btn';
import NewRequestPage from './NewRequestPage';
import MyRequestsPage from './MyRequestsPage';
import SettingsPage from './SettingPage';
import UsersPage from './UserPages';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('new-request');

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
              <button
              onClick={() => setActiveView('user-page')}
              className={`px-6 py-4 font-semibold transition-all ${
                activeView === 'user-page'
                  ? 'bg-blue-600 text-white border-b-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>My Account</span>
              </div>
            </button>
              <button
              onClick={() => setActiveView('setting-page')}
              className={`px-6 py-4 font-semibold transition-all ${
                activeView === 'setting-page'
                  ? 'bg-blue-600 text-white border-b-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Settings</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeView === 'new-request' && <NewRequestPage />}
        {activeView === 'my-requests' && <MyRequestsPage />}
        {activeView === 'user-page' && <UsersPage />}
        {activeView === 'setting-page' && <SettingsPage />}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white mt-12">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-bold mb-2">Contact Information</h3>
              <p className="text-gray-300 text-sm">Barangay Hall, Kurong Kurong</p>
              <p className="text-gray-300 text-sm">Roxas, Isabela</p>
              <p className="text-gray-300 text-sm mt-1">Tel: (02) 8123-4567</p>
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
          <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-400 text-sm">
            <p>© 2024 Barangay kurong-kurong. All rights reserved.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;