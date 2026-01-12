import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import StatsGrid from "../../components/admin-dashboard/StatsGrid";
import QuickActions from "../../components/admin-dashboard/QuickActions";
import RequestsChart from "../../components/admin-dashboard/RequestsChart";
import RecentActivity from "../../components/admin-dashboard/RecentActivity";
import {
  FileTextIcon,
  UsersIcon,
  ClipboardIcon,
  UserCogIcon,
  BarChartIcon,
} from "../../components/ui/icons";
import { MapPin, Shield, Building2, Globe } from "lucide-react";
import AppSideBar from "../../components/ui/side-bar";
import {
  getDashboardStats,
  getWeeklyRequestsData,
  getRecentActivities,
  getStatsTrends,
} from "../../services/dashboardService";

// Constants - Super Admin Quick Actions
const SUPER_ADMIN_QUICK_ACTIONS = [
  {
    label: "All Verifications",
    icon: Shield,
    path: "/super-admin-verifications",
    variant: "primary",
    description: "System-wide verification management",
  },
  {
    label: "Barangay Requests",
    icon: MapPin,
    path: "/barangay-requests",
    variant: "primary",
    description: "Review membership requests",
  },
  {
    label: "Official Verifications",
    icon: Shield,
    path: "/official-verifications",
    variant: "default",
    description: "Review verification requests",
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

// Helper functions
const getStatsConfig = (data, barangayStats, verificationStats, trends) => [
  {
    title: "System-wide Verifications",
    value: verificationStats?.total?.toString() || "0",
    icon: Globe,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    trend: `${verificationStats?.pending || 0} pending across all barangays`,
  },
  {
    title: "Pending Barangay Requests",
    value: barangayStats?.pending?.toString() || "0",
    icon: MapPin,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    trend: `${barangayStats?.total || 0} total requests`,
  },
  {
    title: "Pending Verifications",
    value: verificationStats?.pending?.toString() || "0",
    icon: Shield,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    trend: `${verificationStats?.approved || 0} approved`,
  },
  {
    title: "Total System Users",
    value: data?.totalResidents?.toString() || "0",
    icon: UsersIcon,
    color: "text-green-600",
    bgColor: "bg-green-50",
    trend: trends?.newResidentsThisMonth
      ? `+${trends.newResidentsThisMonth} this month`
      : "No new users",
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
          <Shield className="w-6 h-6 text-purple-600" />
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Super Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">
              {user?.fullName || "Admin"}
            </p>
            <p className="text-xs text-slate-600 font-medium leading-tight mt-0.5">
              {roleName || "System Administrator"}
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
    <div className="flex items-center gap-3 mb-2">
      <Globe className="w-10 h-10 text-purple-600" />
      <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">
        System Overview
      </h2>
    </div>
    <p className="text-base text-slate-600 mt-2 font-medium">
      Comprehensive system-wide dashboard with cross-barangay insights and management.
    </p>
  </div>
);

// Admin notice component
const AdminNotice = () => (
  <div className="mt-8 mb-6 p-6 bg-purple-50 border border-purple-200 rounded-lg">
    <div className="flex items-start gap-3">
      <Shield className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm text-purple-900 leading-relaxed">
          <strong className="font-semibold">Super Admin Access:</strong> You have
          full system access across all barangays. Use this privilege responsibly
          and maintain audit trails for all administrative actions.
        </p>
      </div>
    </div>
  </div>
);

// Dashboard content component
const DashboardContent = ({ stats, chartData, activities, isLoading }) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <StatsGrid stats={stats} className="mb-6" />
      <RequestsChart
        className="mb-6"
        data={chartData}
        title="Weekly Activity Overview"
      />
      <QuickActions actions={SUPER_ADMIN_QUICK_ACTIONS} className="mb-6" />
      <RecentActivity
        activities={activities}
        title="Recent System Activity"
        viewAllLink="/activity"
      />
    </>
  );
};

function SuperAdminDashboard() {
  const { user } = useAuth();
  const { roleName, isAdmin } = usePermissions();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [trends, setTrends] = useState(null);
  const [barangayStats, setBarangayStats] = useState({ pending: 0, total: 0 });
  const [verificationStats, setVerificationStats] = useState({
    pending: 0,
    approved: 0,
    total: 0,
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch all dashboard data in parallel
      const [stats, weeklyData, recentActivities, statsTrends] =
        await Promise.all([
          getDashboardStats(user?.barangayId),
          getWeeklyRequestsData(),
          getRecentActivities(10),
          getStatsTrends(user?.barangayId),
        ]);

      // TODO: Fetch system-wide stats for super admin
      // For now, using same data as regular admin
      setBarangayStats({ pending: 0, total: 0 });
      setVerificationStats({ pending: 0, approved: 0, total: 0 });

      setDashboardData(stats);
      setChartData(weeklyData);
      setActivities(recentActivities);
      setTrends(statsTrends);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set empty data on error to prevent crashes
      setDashboardData({
        pendingRequests: 0,
        totalResidents: 0,
        completedToday: 0,
        activityLogs: 0,
      });
      setChartData([]);
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.barangayId]);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, isAdmin]);

  const stats = useMemo(
    () =>
      getStatsConfig(dashboardData, barangayStats, verificationStats, trends),
    [dashboardData, barangayStats, verificationStats, trends]
  );

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <AppSideBar>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md p-6 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-lg font-semibold text-red-900 mb-2">
              Access Denied
            </h2>
            <p className="text-red-800">
              You do not have permission to access the Super Admin Dashboard.
              This page is restricted to system administrators only.
            </p>
          </div>
        </div>
      </AppSideBar>
    );
  }

  return (
    <AppSideBar>
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
        <NavigationHeader user={user} roleName={roleName} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader />
          <AdminNotice />

          <DashboardContent
            stats={stats}
            chartData={chartData}
            activities={activities}
            isLoading={isLoading}
          />
        </main>
      </div>
    </AppSideBar>
  );
}

export default SuperAdminDashboard;
