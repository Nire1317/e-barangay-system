import React, { useState } from 'react';
import { User, Lock, Bell, Globe, Shield, Database, Mail, Phone, MapPin, Building, Save, Camera } from 'lucide-react';

const SettingsPage = () => {
const [activeTab, setActiveTab] = useState('profile');
const [profileData, setProfileData] = useState({
firstName: 'Juan',
lastName: 'Dela Cruz',
email: '[admin@kurong-kurong.gov.ph](mailto:admin@kurong-kurong.gov.ph)',
phone: '0917-123-4567',
position: 'Barangay Administrator',
address: 'Barangay Hall, Kurong Kurong, Roxas, Isabela'
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

const [barangaySettings, setBarangaySettings] = useState({
barangayName: 'Barangay Kurong Kurong',
municipality: 'Roxas',
province: 'Isabela',
contactNumber: '(02) 8123-4567',
mobileNumber: '0917-123-4567',
emailAddress: '[brgy.kurong-kurong@qc.gov.ph](mailto:brgy.kurong-kurong@qc.gov.ph)',
officeHoursStart: '08:00',
officeHoursEnd: '17:00',
processingDays: '3-5'
});

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

const handleBarangayChange = (e) => {
const { name, value } = e.target;
setBarangaySettings(prev => ({ ...prev, [name]: value }));
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
const handleSaveBarangay = () => alert('Barangay information updated successfully!');

const tabs = [
{ id: 'profile', label: 'Profile', icon: User },
{ id: 'security', label: 'Security', icon: Lock },
{ id: 'notifications', label: 'Notifications', icon: Bell },
{ id: 'barangay', label: 'Barangay Info', icon: Building },
{ id: 'system', label: 'System', icon: Database }
];

return ( <div>
{/* Page Header */} <div className="bg-white rounded-xl shadow-lg p-6 mb-6"> <h2 className="text-2xl font-bold text-gray-800">Settings</h2> <p className="text-gray-600 mt-1">Manage your account and system preferences</p> </div>

```
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">  
    {/* Sidebar Navigation */}  
    <div className="lg:col-span-1">  
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">  
        <div className="p-4">  
          {tabs.map((tab) => {  
            const Icon = tab.icon;  
            return (  
              <button  
                key={tab.id}  
                onClick={() => setActiveTab(tab.id)}  
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-2 ${activeTab === tab.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}  
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
        <div className="bg-white rounded-xl shadow-lg p-6">  
          {/* …Profile content (unchanged) … */}  
        </div>  
      )}  

      {/* Security Tab */}  
      {activeTab === 'security' && (  
        <div className="bg-white rounded-xl shadow-lg p-6">  
          {/* …Security content (unchanged) … */}  
        </div>  
      )}  

      {/* Notifications Tab */}  
      {activeTab === 'notifications' && (  
        <div className="bg-white rounded-xl shadow-lg p-6">  
          {/* …Notifications content (unchanged) … */}  
        </div>  
      )}  

      {/* Barangay Info Tab */}  
      {activeTab === 'barangay' && (  
        <div className="bg-white rounded-xl shadow-lg p-6">  
          {/* …Barangay content (unchanged) … */}  
        </div>  
      )}  

      {/* System Tab */}  
      {activeTab === 'system' && (  
        <div className="bg-white rounded-xl shadow-lg p-6">  
          <h3 className="text-xl font-bold text-gray-800 mb-6">System Information</h3>  
          <div className="space-y-4">  
            <div className="bg-gray-50 rounded-lg p-4">  
              <div className="flex justify-between items-center">  
                <div>  
                  <p className="text-sm text-gray-600">System Version</p>  
                  <p className="text-lg font-semibold text-gray-800">BOSS v2.1.0</p>  
                </div>  
              </div>  
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
