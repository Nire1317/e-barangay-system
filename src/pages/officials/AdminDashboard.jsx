import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import { OfficialOnly } from "../../components/PermissionGate";
import StatsGrid from "../../components/admin-dashboard/StatsGrid";
import QuickActions from "../../components/admin-dashboard/QuickActions";
import RequestsChart from "../../components/admin-dashboard/RequestsChart";
import RecentActivity from "../../components/admin-dashboard/RecentActivity";
import {
  FileTextIcon,
  UsersIcon,
  CheckCircleIcon,
  ActivityIcon,
  ClipboardIcon,
  UserCogIcon,
  BarChartIcon,
} from "../../components/ui/icons";
import AppSideBar from "../../components/ui/side-bar";

// Constants
const CHART_DATA = [
  { name: "Mon", requests: 45 },
  { name: "Tue", requests: 52 },
  { name: "Wed", requests: 38 },
  { name: "Thu", requests: 61 },
  { name: "Fri", requests: 48 },
  { name: "Sat", requests: 35 },
  { name: "Sun", requests: 42 },
];

const QUICK_ACTIONS = [
  {
    label: "View All Requests",
    icon: ClipboardIcon,
    path: "/manage-requests",
    variant: "default",
    description: "Manage document requests",
  },
  {
    label: "Manage Residents",
    icon: UserCogIcon,
    path: "/residents",
    variant: "secondary",
    description: "Update resident information",
  },
  {
    label: "Generate Reports",
    icon: BarChartIcon,
    path: "/reports",
    variant: "outline",
    description: "Export analytics data",
  },
];

const ACTIVITY_DATA = [
  {
    id: 1,
    action: "New resident registration",
    time: "2 minutes ago",
    user: "Maria Santos",
    type: "registration",
  },
  {
    id: 2,
    action: "Document request approved",
    time: "1 hour ago",
    user: "Juan Dela Cruz",
    type: "approval",
  },
  {
    id: 3,
    action: "Report generated",
    time: "3 hours ago",
    user: "System",
    type: "system",
  },
  {
    id: 4,
    action: "Bulk update completed",
    time: "5 hours ago",
    user: "Admin",
    type: "system",
  },
];

// Helper functions
const getStatsConfig = (data) => [
  {
    title: "Pending Requests",
    value: data?.pendingRequests || "12",
    icon: FileTextIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    trend: "+3 from yesterday",
  },
  {
    title: "Total Residents",
    value: data?.totalResidents || "456",
    icon: UsersIcon,
    color: "text-green-600",
    bgColor: "bg-green-50",
    trend: "+12 this month",
  },
  {
    title: "Completed Today",
    value: data?.completedToday || "8",
    icon: CheckCircleIcon,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    trend: "On track",
  },
  {
    title: "Activity Logs",
    value: data?.activityLogs || "24",
    icon: ActivityIcon,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    trend: "Last hour",
  },
];

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-white rounded-lg animate-pulse" />
      ))}
    </div>
    <div className="h-96 bg-white rounded-lg animate-pulse" />
  </div>
);

// Navigation header component
const NavigationHeader = ({ user, roleName }) => (
  <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-14.5 items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Official Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">
              {user?.fullName || "Admin"}
            </p>
            <p className="text-xs text-slate-600 font-medium leading-tight mt-0.5">
              {roleName || "Administrator"}
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
      Dashboard
    </h2>
    <p className="text-base text-slate-600 mt-2 font-medium">
      Welcome back! Here's what's happening today.
    </p>
  </div>
);

// Permission notice component
const PermissionNotice = () => (
  <div className="mt-8 mb-6 p-6 bg-amber-50 border border-amber-200 rounded-lg">
    <p className="text-sm text-amber-900 leading-relaxed">
      <strong className="font-semibold">Note:</strong> Some dashboard features
      require official permissions. Contact your administrator if you need
      access.
    </p>
  </div>
);

// Dashboard content component
const DashboardContent = ({ stats, isLoading }) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <StatsGrid stats={stats} className="mb-6" />
      <RequestsChart
        className="mb-6"
        data={CHART_DATA}
        title="Weekly Requests Overview"
      />
      <QuickActions actions={QUICK_ACTIONS} className="mb-6" />
      <RecentActivity
        activities={ACTIVITY_DATA}
        title="Recent Activity"
        viewAllLink="/activity"
      />
    </>
  );
};

function AdminDashboard() {
  const { user } = useAuth();
  const { roleName } = usePermissions();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setDashboardData({
        pendingRequests: "12",
        totalResidents: "456",
        completedToday: "8",
        activityLogs: "24",
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = useMemo(() => getStatsConfig(dashboardData), [dashboardData]);

  return (
    <AppSideBar>
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
        <NavigationHeader user={user} roleName={roleName} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader />
          <PermissionNotice />

          <OfficialOnly>
            <DashboardContent stats={stats} isLoading={isLoading} />
          </OfficialOnly>
        </main>
      </div>
    </AppSideBar>
  );
}

export default AdminDashboard;
