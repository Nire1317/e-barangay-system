import React, { useState } from "react";
import {
  Shield,
  Users,
  UserPlus,
  Settings,
  Key,
  Lock,
  Unlock,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Server,
  Activity,
  AlertTriangle,
  UserCog,
  Mail,
  Phone,
} from "lucide-react";
import AppSideBar from "../../components/ui/side-bar";

// Mock data
const ADMIN_STATS = [
  {
    title: "Total Users",
    value: "523",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    trend: "+18 this month",
  },
  {
    title: "Active Officials",
    value: "12",
    icon: Shield,
    color: "text-green-600",
    bgColor: "bg-green-50",
    trend: "All verified",
  },
  {
    title: "Pending Approvals",
    value: "8",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    trend: "Needs review",
  },
  {
    title: "System Health",
    value: "98%",
    icon: Activity,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    trend: "Excellent",
  },
];

const USERS_DATA = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    email: "juan.official@barangay.gov",
    role: "Barangay Captain",
    permissions: "Full Access",
    status: "active",
    lastActive: "2 minutes ago",
    phone: "+63 912 345 6789",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.secretary@barangay.gov",
    role: "Barangay Secretary",
    permissions: "Admin",
    status: "active",
    lastActive: "5 minutes ago",
    phone: "+63 923 456 7890",
  },
  {
    id: 3,
    name: "Pedro Garcia",
    email: "pedro.treasurer@barangay.gov",
    role: "Barangay Treasurer",
    permissions: "Finance Only",
    status: "active",
    lastActive: "1 hour ago",
    phone: "+63 934 567 8901",
  },
  {
    id: 4,
    name: "Ana Reyes",
    email: "ana.staff@barangay.gov",
    role: "Staff Member",
    permissions: "Limited",
    status: "pending",
    lastActive: "Never",
    phone: "+63 945 678 9012",
  },
  {
    id: 5,
    name: "Lisa Fernandez",
    email: "lisa.clerk@barangay.gov",
    role: "Records Clerk",
    permissions: "Records Only",
    status: "inactive",
    lastActive: "3 days ago",
    phone: "+63 956 789 0123",
  },
];

const SYSTEM_LOGS = [
  {
    id: 1,
    action: "User login",
    user: "Juan Dela Cruz",
    timestamp: "2 minutes ago",
    type: "info",
    details: "Successful authentication",
  },
  {
    id: 2,
    action: "Permission changed",
    user: "Maria Santos",
    timestamp: "15 minutes ago",
    type: "warning",
    details: "Updated user role permissions",
  },
  {
    id: 3,
    action: "Database backup",
    user: "System",
    timestamp: "1 hour ago",
    type: "success",
    details: "Automated backup completed",
  },
  {
    id: 4,
    action: "Failed login attempt",
    user: "Unknown",
    timestamp: "2 hours ago",
    type: "error",
    details: "Multiple failed attempts detected",
  },
];

// Components
const NavigationHeader = () => (
  <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-14.5 items-center">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-600" size={20} />
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Admin Panel
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">
              Super Admin
            </p>
            <p className="text-xs text-slate-600 font-medium leading-tight mt-0.5">
              System Administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

const PageHeader = () => (
  <div className="mb-8">
    <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">
      Admin Panel
    </h2>
    <p className="text-base text-slate-600 mt-2 font-medium">
      Manage system users, roles, and permissions
    </p>
  </div>
);

const StatsCard = ({ stat }) => {
  const Icon = stat.icon;
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">
            {stat.title}
          </p>
          <p className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</p>
          <p className="text-xs text-slate-500 font-medium">{stat.trend}</p>
        </div>
        <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: {
      label: "Active",
      className: "bg-green-100 text-green-700 border-green-200",
      icon: CheckCircle,
    },
    pending: {
      label: "Pending",
      className: "bg-orange-100 text-orange-700 border-orange-200",
      icon: Clock,
    },
    inactive: {
      label: "Inactive",
      className: "bg-red-100 text-red-700 border-red-200",
      icon: XCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
};

const UserRow = ({ user }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
            {user.name.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-slate-900">
              {user.name}
            </div>
            <div className="text-xs text-slate-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-slate-900">{user.role}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
          {user.permissions}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={user.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {user.lastActive}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <MoreVertical size={18} />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
              <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Eye size={16} />
                View Details
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Edit size={16} />
                Edit User
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Key size={16} />
                Reset Password
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Lock size={16} />
                Change Permissions
              </button>
              <div className="border-t border-slate-200 my-1"></div>
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                <Trash2 size={16} />
                Remove User
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

const SystemLogItem = ({ log }) => {
  const typeConfig = {
    info: { icon: Activity, color: "text-blue-600", bgColor: "bg-blue-50" },
    warning: {
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    success: {
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    error: { icon: XCircle, color: "text-red-600", bgColor: "bg-red-50" },
  };

  const config = typeConfig[log.type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-lg transition-colors">
      <div className={`${config.bgColor} ${config.color} p-2 rounded-lg`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">{log.action}</p>
            <p className="text-xs text-slate-600 mt-1">{log.details}</p>
          </div>
          <span className="text-xs text-slate-500 whitespace-nowrap">
            {log.timestamp}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">by {log.user}</p>
      </div>
    </div>
  );
};

const QuickActionsPanel = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <UserPlus size={20} />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900">Add New User</p>
            <p className="text-xs text-slate-600">Create official account</p>
          </div>
        </button>
        <button className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group">
          <div className="bg-green-100 text-green-600 p-3 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
            <UserCog size={20} />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900">Manage Roles</p>
            <p className="text-xs text-slate-600">Edit permissions</p>
          </div>
        </button>
        <button className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group">
          <div className="bg-purple-100 text-purple-600 p-3 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Database size={20} />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900">
              System Backup
            </p>
            <p className="text-xs text-slate-600">Create backup now</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default function AdminPanelPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [activeTab, setActiveTab] = useState("users");

  return (
    <AppSideBar>
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
        <NavigationHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader />

          {/* Security Warning */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <Shield className="text-red-600 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-semibold text-red-900">
                Restricted Area
              </p>
              <p className="text-sm text-red-800 mt-1">
                This panel contains sensitive system controls. All actions are
                logged and monitored.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {ADMIN_STATS.map((stat, index) => (
              <StatsCard key={index} stat={stat} />
            ))}
          </div>

          {/* Quick Actions */}
          <QuickActionsPanel />

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-slate-200">
              <nav className="flex gap-6">
                <button
                  onClick={() => setActiveTab("users")}
                  className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "users"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Users & Permissions
                </button>
                <button
                  onClick={() => setActiveTab("logs")}
                  className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "logs"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  System Logs
                </button>
              </nav>
            </div>
          </div>

          {/* Users Tab */}
          {activeTab === "users" && (
            <>
              {/* Search and Filter Bar */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
                    <div className="relative flex-1 max-w-md">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                      <option value="all">All Roles</option>
                      <option value="captain">Barangay Captain</option>
                      <option value="secretary">Secretary</option>
                      <option value="treasurer">Treasurer</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    <UserPlus size={18} />
                    Add New User
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Permissions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Last Active
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {USERS_DATA.map((user) => (
                        <UserRow key={user.id} user={user} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Logs Tab */}
          {activeTab === "logs" && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Recent System Logs
                </h3>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                  <Filter size={16} />
                  Filter Logs
                </button>
              </div>
              <div className="space-y-2">
                {SYSTEM_LOGS.map((log) => (
                  <SystemLogItem key={log.id} log={log} />
                ))}
              </div>
              <div className="mt-6 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All Logs →
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </AppSideBar>
  );
}
