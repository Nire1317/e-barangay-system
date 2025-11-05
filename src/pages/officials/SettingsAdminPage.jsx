import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
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
  Camera,
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
  const { user } = useAuth();
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

  const handleSaveChanges = () => {
    console.log("Saving changes...");
    // Add save logic here
  };

  return (
    <AppSideBar>
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
        <NavigationHeader user={user} roleName={roleName} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader />

          <div className="space-y-6">
            {/* Profile Settings */}
            <SettingsSection
              title="Profile Information"
              description="Update your personal details and contact information"
              icon={User}
            >
              <div className="space-y-4">
                {/* Profile Picture */}
                <div className="flex items-center gap-6 pb-6 border-b border-slate-200">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {user?.fullName?.charAt(0) || "U"}
                    </div>
                    <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      Profile Photo
                    </h4>
                    <p className="text-sm text-slate-600 mt-0.5">
                      JPG, PNG or GIF. Max size of 2MB.
                    </p>
                  </div>
                </div>

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

            {/* Notification Settings */}
            <SettingsSection
              title="Notifications"
              description="Manage how you receive updates and alerts"
              icon={Bell}
            >
              <div className="space-y-2 divide-y divide-slate-200">
                <ToggleSwitch
                  label="Email Notifications"
                  description="Receive notifications via email"
                  checked={notifications.emailNotifications}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      emailNotifications: !notifications.emailNotifications,
                    })
                  }
                />
                <ToggleSwitch
                  label="Push Notifications"
                  description="Receive push notifications in your browser"
                  checked={notifications.pushNotifications}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      pushNotifications: !notifications.pushNotifications,
                    })
                  }
                />
                <ToggleSwitch
                  label="SMS Notifications"
                  description="Receive important updates via SMS"
                  checked={notifications.smsNotifications}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      smsNotifications: !notifications.smsNotifications,
                    })
                  }
                />
                <ToggleSwitch
                  label="Request Updates"
                  description="Get notified about your document request status"
                  checked={notifications.requestUpdates}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      requestUpdates: !notifications.requestUpdates,
                    })
                  }
                />
                <ToggleSwitch
                  label="System Alerts"
                  description="Receive important system announcements"
                  checked={notifications.systemAlerts}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      systemAlerts: !notifications.systemAlerts,
                    })
                  }
                />
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
                    />
                    <FormField
                      label="New Password"
                      type="password"
                      placeholder="Enter new password"
                    />
                    <FormField
                      label="Confirm New Password"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Update Password
                  </button>
                </div>
              </div>
            </SettingsSection>

            {/* Preferences */}
            <SettingsSection
              title="Preferences"
              description="Customize your experience"
              icon={Palette}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Language"
                  value={preferences.language}
                  onChange={(e) =>
                    setPreferences({ ...preferences, language: e.target.value })
                  }
                  options={[
                    { value: "en", label: "English" },
                    { value: "fil", label: "Filipino" },
                    { value: "es", label: "Spanish" },
                  ]}
                />
                <SelectField
                  label="Theme"
                  value={preferences.theme}
                  onChange={(e) =>
                    setPreferences({ ...preferences, theme: e.target.value })
                  }
                  options={[
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                    { value: "auto", label: "Auto" },
                  ]}
                />
                <SelectField
                  label="Timezone"
                  value={preferences.timezone}
                  onChange={(e) =>
                    setPreferences({ ...preferences, timezone: e.target.value })
                  }
                  options={[
                    { value: "Asia/Manila", label: "Manila (GMT+8)" },
                    { value: "UTC", label: "UTC" },
                    { value: "America/New_York", label: "New York (EST)" },
                  ]}
                />
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
                  <ActionButton icon={Trash2} label="Delete" variant="danger" />
                </div>
              </div>
            </SettingsSection>

            {/* Save Changes Button */}
            <div className="flex justify-end gap-3 pt-4">
              <button className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </AppSideBar>
  );
}

export default Settings;
