import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import { OfficialOnly } from "../../components/PermissionGate";

import StatsGrid from "../../components/admin-dashboard/StatsGrid";
import QuickActions from "../../components/admin-dashboard/QuickActions";
import RequestsChart from "../../components/admin-dashboard/RequestsChart";
import RecentActivity from "../../components/admin-dashboard/RecentActivity";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "../../components/ui/card.component";
import {
  FileTextIcon,
  UsersIcon,
  CheckCircleIcon,
  ActivityIcon,
  LogOutIcon,
  ClipboardIcon,
  UserCogIcon,
  BarChartIcon,
} from "../../components/ui/icons";

// Dummy chart data
const chartData = [
  { name: "Mon", requests: 300 },
  { name: "Tue", requests: 1500 },
  { name: "Wed", requests: 8 },
  { name: "Thu", requests: 200 },
  { name: "Fri", requests: 18 },
  { name: "Sat", requests: 600 },
  { name: "Sun", requests: 900 },
];

// Stats cards
const stats = [
  {
    title: "Pending Requests",
    value: "12",
    icon: FileTextIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Total Residents",
    value: "456",
    icon: UsersIcon,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Completed Today",
    value: "8",
    icon: CheckCircleIcon,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Activity Logs",
    value: "24",
    icon: ActivityIcon,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

// Quick actions
const quickActions = [
  {
    label: "View All Requests",
    icon: ClipboardIcon,
    path: "/requests",
    variant: "default",
  },
  {
    label: "Manage Residents",
    icon: UserCogIcon,
    path: "/residents",
    variant: "secondary",
  },
  {
    label: "Generate Reports",
    icon: BarChartIcon,
    path: "/reports",
    variant: "outline",
  },
];

// Recent activity
const activityData = [
  {
    action: "New resident registration",
    time: "2 minutes ago",
    user: "Maria Santos",
  },
  {
    action: "Document request approved",
    time: "1 hour ago",
    user: "Juan Dela Cruz",
  },
  { action: "Report generated", time: "3 hours ago", user: "System" },
];

function AdminDashboard() {
  const { user, signOut } = useAuth();
  const { roleName } = usePermissions();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
      {/* Top Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
                <ActivityIcon />
              </div>
              <h1 className="text-xl font-semibold text-slate-900">
                Admin Portal
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">
                  {user?.fullName || "Admin"}
                </p>
                <p className="text-xs text-slate-500">{roleName}</p>
              </div>

              <button
                onClick={signOut}
                className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-white px-3 py-2 text-sm font-medium text-red-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <LogOutIcon className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        <OfficialOnly>
          {/* Stats */}
          <StatsGrid stats={stats} />

          {/* Chart */}
          <RequestsChart className="mb-4" data={chartData} />

          {/* Quick Actions */}
          <QuickActions actions={quickActions} />

          {/* Recent Activity */}
          <RecentActivity activities={activityData} />
        </OfficialOnly>
      </main>
    </div>
  );
}

export default AdminDashboard;
