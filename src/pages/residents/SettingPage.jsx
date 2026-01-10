import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, Globe, Shield, Database, Mail, Phone, MapPin, Building, Save, Camera } from 'lucide-react';

const SettingsPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');

  // Populate initial profile from Supabase user object
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    fullName: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    newRequestAlert: true,
    statusUpdateAlert: true,
    systemUpdates: false,
    weeklyReport: true
  });

  useEffect(() => {
    if (user) {
      // Split full name if exists
      const [firstName = '', lastName = ''] = user.user_metadata.full_name
        ? user.user_metadata.full_name.split(' ')
        : ['', ''];
      setProfileData({
        firstName,
        lastName,
        email: user.email,
        phone: user.phone || '',
        fullName: user.user_metadata.full_name || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = () => alert('Profile updated successfully!');
  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };
  const handleSaveNotifications = () => alert('Notification settings saved!');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Database }
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-2 ${
                      activeTab === tab.id
                        ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  placeholder="First Name"
                  className="border rounded-lg p-2"
                />
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  placeholder="Last Name"
                  className="border rounded-lg p-2"
                />
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  placeholder="Email"
                  className="border rounded-lg p-2"
                  disabled
                />
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  placeholder="Phone"
                  className="border rounded-lg p-2"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
              >
                Save Profile
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Change Password</h3>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Current Password"
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm New Password"
                className="border rounded-lg p-2 w-full"
              />
              <button
                onClick={handleChangePassword}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
              >
                Change Password
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Notification Settings</h3>
              {Object.keys(notificationSettings).map(key => (
                <div key={key} className="flex items-center justify-between">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <input
                    type="checkbox"
                    checked={notificationSettings[key]}
                    onChange={() => handleNotificationToggle(key)}
                  />
                </div>
              ))}
              <button
                onClick={handleSaveNotifications}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
              >
                Save Notifications
              </button>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">System Information</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">System Version</p>
                  <p className="text-lg font-semibold text-gray-800">BOSS v2.1.0</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Last Sign-In</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(user.last_sign_in_at).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Email Verified</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {user.user_metadata.email_verified ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Phone Verified</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {user.user_metadata.phone_verified ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
