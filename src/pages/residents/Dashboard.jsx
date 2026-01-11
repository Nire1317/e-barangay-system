import React, { useState, useEffect } from 'react';
import { FileText, Home, Clock, User, Settings, LogOut, Menu, X, Bell, ChevronDown } from 'lucide-react';

// Import your page components
import NewRequestPage from './NewRequestPage';
import MyRequestsPage from './MyRequestsPage';
import SettingsPage from './SettingPage';
import UsersPage from './UserPages';


//Note: This is just a experimental thats why the supabase init is here.
// i dont know how to do it properly with the current project structure.
// Please refactor this part later.
const SUPABASE_URL = 'https://ubektynslrflctveqiut.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZWt0eW5zbHJmbGN0dmVxaXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MzIyNDEsImV4cCI6MjA3NzEwODI0MX0.VMPxOfxSICFJLqcxBbTHFhCr4TyxIbDrBih6GuvdRrM';

let supabase = null;

const initSupabase = async () => {
  if (!supabase) {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabase;
};

const Dashboard = () => {
  const [activeView, setActiveView] = useState('new-request');
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState({
    pendingRequests: 0,
    approvedRequests: 0,
    totalRequests: 0
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const client = await initSupabase();
        const { data: { user: currentUser }, error } = await client.auth.getUser();

        if (error) {
          console.error('Auth error:', error);
          setLoading(false);
          return;
        }

        if (currentUser) {
          setUser(currentUser);
          await fetchUserStats(currentUser.id);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchUserStats = async (userId) => {
    try {
      const client = await initSupabase();

      // First, get the resident_id for this user
      const { data: residentData, error: residentError } = await client
        .from('residents')
        .select('resident_id')
        .eq('user_id', userId)
        .single();

      if (residentError) {
        // If no resident record exists, set stats to 0
        if (residentError.code === 'PGRST116') {
          setUserStats({
            totalRequests: 0,
            pendingRequests: 0,
            approvedRequests: 0
          });
          return;
        }
        throw residentError;
      }

      if (!residentData) {
        console.log('No resident record found for user');
        setUserStats({
          totalRequests: 0,
          pendingRequests: 0,
          approvedRequests: 0
        });
        return;
      }

      // Then, get the requests for this resident
      const { data, error } = await client
        .from('requests')
        .select('status')
        .eq('resident_id', residentData.resident_id);

      if (error) throw error;

      const stats = {
        totalRequests: data?.length || 0,
        pendingRequests: data?.filter(req => req.status === 'Pending').length || 0,
        approvedRequests: data?.filter(req => req.status === 'Approved').length || 0
      };

      setUserStats(stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      const client = await initSupabase();
      await client.auth.signOut();
      window.location.href = '/'; 
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  // Navigation items
  const navItems = [
    { id: 'new-request', label: 'New Request', icon: FileText },
    { id: 'my-requests', label: 'My Requests', icon: Clock },
    { id: 'user-page', label: 'My Account', icon: User },
    { id: 'setting-page', label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Home className="w-6 h-6 md:w-10 md:h-10 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold">Barangay Kurong Kurong</h1>
                <p className="text-xs md:text-sm text-blue-100 mt-1">Online Services System (BOSS)</p>
              </div>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden lg:flex items-center gap-6">
              {/* <div className="text-right">
                <p className="text-xs text-blue-100">Office Hours</p>
                <p className="text-sm font-semibold">Mon-Fri: 8:00 AM - 5:00 PM</p>
              </div> */}

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 transition-colors"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">{user?.email || 'User'}</p>
                    <p className="text-xs text-blue-100">{userStats.totalRequests} requests</p>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl overflow-hidden z-50">
                    <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-4 text-white">
                      <p className="font-semibold">{user?.email}</p>
                      <p className="text-xs text-blue-100 mt-1">User ID: {user?.id?.slice(0, 8)}...</p>
                    </div>
                    <div className="p-2">
                      <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg mb-2">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{userStats.pendingRequests}</p>
                          <p className="text-xs text-gray-600">Pending</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{userStats.approvedRequests}</p>
                          <p className="text-xs text-gray-600">Approved</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveView('user-page');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-gray-700"
                      >
                        <User className="w-4 h-4" />
                        My Account
                      </button>
                      <button
                        onClick={() => {
                          setActiveView('setting-page');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-gray-700"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 rounded-lg flex items-center gap-2 text-red-600 font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg">
          <div className="px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user?.email || 'User'}</p>
                <p className="text-xs text-gray-600">{userStats.totalRequests} total requests</p>
              </div>
            </div>
          </div>
          <div className="p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 mb-1 ${
                    activeView === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
            <hr className="my-2" />
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs - Desktop */}
      <div className="hidden lg:block bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {navItems.slice(0, 2).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`px-6 py-4 font-semibold transition-all ${
                    activeView === item.id
                      ? 'bg-blue-600 text-white border-b-4 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      {user && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-gray-800">{userStats.totalRequests}</p>
                <p className="text-xs md:text-sm text-gray-600">Total Requests</p>
              </div>
              <div className="text-center border-l border-r border-gray-200">
                <p className="text-2xl md:text-3xl font-bold text-yellow-600">{userStats.pendingRequests}</p>
                <p className="text-xs md:text-sm text-gray-600">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-green-600">{userStats.approvedRequests}</p>
                <p className="text-xs md:text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'new-request' && <NewRequestPage />}
        {activeView === 'my-requests' && <MyRequestsPage />}
        {activeView === 'user-page' && <UsersPage />}
        {activeView === 'setting-page' && <SettingsPage />}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Contact Information
              </h3>
              <p className="text-gray-300 text-sm">Barangay Hall, Kurong Kurong</p>
              <p className="text-gray-300 text-sm">Roxas, Isabela, Philippines</p>
              <p className="text-gray-300 text-sm mt-2">📞 Tel: (078) 652-1234</p>
              <p className="text-gray-300 text-sm">📱 Mobile: 0917-123-4567</p>
              <p className="text-gray-300 text-sm">✉️ Email: brgy.kurongkurong@roxas.gov.ph</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Office Hours
              </h3>
              <p className="text-gray-300 text-sm font-semibold">Monday - Friday</p>
              <p className="text-gray-300 text-sm">8:00 AM - 12:00 PM (Morning)</p>
              <p className="text-gray-300 text-sm">1:00 PM - 5:00 PM (Afternoon)</p>
              <p className="text-red-300 text-sm mt-2">⚠️ Closed on weekends and holidays</p>
              <p className="text-gray-300 text-sm mt-2">For urgent concerns, please call our hotline.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Follow Us</h3>
              <p className="text-gray-300 text-sm">📘 Facebook: @BarangayKurongKurongRX</p>
              <p className="text-gray-300 text-sm mt-2">Stay updated with announcements and events</p>
              <div className="mt-4">
                <h4 className="font-semibold text-sm mb-2">Quick Links</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Barangay Services</li>
                  <li>• Document Requirements</li>
                  <li>• Community Programs</li>
                  <li>• Emergency Hotlines</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Barangay Kurong Kurong, Roxas, Isabela. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Powered by Barangay Online Services System (BOSS)
            </p>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {userDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;