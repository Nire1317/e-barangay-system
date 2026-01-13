import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import { supabase } from "../../services/supabaseClient";
import AppSideBar from "../../components/ui/side-bar";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Lock,
  Smartphone,
  FileText,
  Download,
  Trash2,
  Save,
} from "lucide-react";

// Navigation header component
const NavigationHeader = ({ user, roleName }) => (
  <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-14.5 items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Settings
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">
              {user?.fullName || "User"}
            </p>
            <p className="text-xs text-slate-600 font-medium leading-tight mt-0.5">
              {roleName || "Resident"}
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

// Page header component
const PageHeader = () => (
  <div className="mb-8">
    <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">
      Settings
    </h2>
    <p className="text-base text-slate-600 mt-2 font-medium">
      Manage your account preferences and system settings.
    </p>
  </div>
);

// Settings section component
const SettingsSection = ({ title, description, icon: Icon, children }) => (
  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600 mt-0.5">{description}</p>
        </div>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// Form field component
const FormField = ({ label, type = "text", placeholder, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

// Toggle switch component
const ToggleSwitch = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex-1">
      <p className="text-sm font-medium text-slate-900">{label}</p>
      {description && (
        <p className="text-xs text-slate-600 mt-0.5">{description}</p>
      )}
    </div>
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

// Select field component
const SelectField = ({ label, options, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Action button component
const ActionButton = ({ icon: Icon, label, variant = "primary", onClick }) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-slate-200 hover:bg-slate-300 text-slate-900",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
};

function Settings() {
  const { user, refreshUser } = useAuth();
  const { roleName } = usePermissions();

  // State management
  const [profile, setProfile] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    requestUpdates: true,
    systemAlerts: true,
  });

  const [preferences, setPreferences] = useState({
    language: "en",
    theme: "light",
    timezone: "Asia/Manila",
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load user settings on mount
  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        await loadUserSettings();
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadUserSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setProfile({
          fullName: user?.fullName || "",
          email: user?.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });

        setNotifications({
          emailNotifications: data.email_notifications ?? true,
          pushNotifications: data.push_notifications ?? false,
          smsNotifications: data.sms_notifications ?? false,
          requestUpdates: data.request_updates ?? true,
          systemAlerts: data.system_alerts ?? true,
        });

        setPreferences({
          language: data.language || "en",
          theme: data.theme || "light",
          timezone: data.timezone || "Asia/Manila",
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      setErrorMessage("Failed to load settings");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // Update user profile (full_name, email)
      const { error: userError } = await supabase
        .from("users")
        .update({
          full_name: profile.fullName,
          email: profile.email,
        })
        .eq("user_id", user.id);

      if (userError) throw userError;

      // Update or insert user settings
      const { error: settingsError } = await supabase
        .from("user_settings")
        .upsert(
          {
            user_id: user.id,
            phone: profile.phone,
            address: profile.address,
            email_notifications: notifications.emailNotifications,
            push_notifications: notifications.pushNotifications,
            sms_notifications: notifications.smsNotifications,
            request_updates: notifications.requestUpdates,
            system_alerts: notifications.systemAlerts,
            language: preferences.language,
            theme: preferences.theme,
            timezone: preferences.timezone,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (settingsError) throw settingsError;

      // Refresh user data
      if (refreshUser) await refreshUser();

      setSuccessMessage("Settings saved successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setErrorMessage("Failed to save settings. Please try again.");
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // Validate passwords
      if (!passwordData.currentPassword || !passwordData.newPassword) {
        setErrorMessage("Please fill in all password fields");
        setTimeout(() => setErrorMessage(""), 5000);
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setErrorMessage("New passwords do not match");
        setTimeout(() => setErrorMessage(""), 5000);
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setErrorMessage("New password must be at least 6 characters");
        setTimeout(() => setErrorMessage(""), 5000);
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccessMessage("Password updated successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error updating password:", error);
      setErrorMessage(error.message || "Failed to update password");
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadData = async () => {
    try {
      setLoading(true);

      // Fetch all user data
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (userError) throw userError;

      const { data: settingsData, error: settingsError } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (settingsError && settingsError.code !== "PGRST116")
        throw settingsError;

      const { data: requestsData, error: requestsError } = await supabase
        .from("document_requests")
        .select("*")
        .eq("user_id", user.id);

      if (requestsError) throw requestsError;

      // Compile data
      const exportData = {
        user: userData,
        settings: settingsData,
        requests: requestsData,
        exportedAt: new Date().toISOString(),
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user-data-${user.id}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccessMessage("Data exported successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error exporting data:", error);
      setErrorMessage("Failed to export data");
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    const doubleConfirmed = window.confirm(
      "This will permanently delete all your data. Are you absolutely sure?"
    );

    if (!doubleConfirmed) return;

    try {
      setLoading(true);

      // Delete user data (cascade should handle related records)
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      // Sign out
      await supabase.auth.signOut();

      alert("Account deleted successfully");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      setErrorMessage("Failed to delete account. Please contact support.");
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppSideBar>
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
        <NavigationHeader user={user} roleName={roleName} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader />

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <div className="shrink-0">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-green-800">
                {successMessage}
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <div className="shrink-0">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-red-800">{errorMessage}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Profile Settings */}
            <SettingsSection
              title="Profile Information"
              description="Update your personal details and contact information"
              icon={User}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Full Name"
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                    placeholder="Enter your full name"
                  />
                  <FormField
                    label="Email Address"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    placeholder="your.email@example.com"
                  />
                  <FormField
                    label="Phone Number"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    placeholder="+63 912 345 6789"
                  />
                  <FormField
                    label="Address"
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                    placeholder="Your address"
                  />
                </div>
              </div>
            </SettingsSection>

            {/* Security Settings */}
            <SettingsSection
              title="Security & Privacy"
              description="Manage your account security and privacy settings"
              icon={Shield}
            >
              <div className="space-y-6">
                {/* <div className="space-y-2 divide-y divide-slate-200">
                  <ToggleSwitch
                    label="Two-Factor Authentication"
                    description="Add an extra layer of security to your account"
                    checked={security.twoFactorAuth}
                    onChange={() =>
                      setSecurity({
                        ...security,
                        twoFactorAuth: !security.twoFactorAuth,
                      })
                    }
                  />
                  <ToggleSwitch
                    label="Login Alerts"
                    description="Get notified when your account is accessed"
                    checked={security.loginAlerts}
                    onChange={() =>
                      setSecurity({
                        ...security,
                        loginAlerts: !security.loginAlerts,
                      })
                    }
                  />
                </div> */}

                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Change Password
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      label="Current Password"
                      type="password"
                      placeholder="Enter current password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                    <FormField
                      label="New Password"
                      type="password"
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    <FormField
                      label="Confirm New Password"
                      type="password"
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button
                    onClick={handlePasswordChange}
                    disabled={loading}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            </SettingsSection>

            {/* Data & Privacy */}
            <SettingsSection
              title="Data & Privacy"
              description="Manage your data and privacy options"
              icon={FileText}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Download Your Data
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Get a copy of your information
                    </p>
                  </div>
                  <ActionButton
                    icon={Download}
                    label="Download"
                    variant="secondary"
                    onClick={handleDownloadData}
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Delete Account
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Permanently delete your account and data
                    </p>
                  </div>
                  <ActionButton
                    icon={Trash2}
                    label="Delete"
                    variant="danger"
                    onClick={handleDeleteAccount}
                  />
                </div>
              </div>
            </SettingsSection>

            {/* Save Changes Button */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => window.location.reload()}
                disabled={loading}
                className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </AppSideBar>
  );
}

export default Settings;
