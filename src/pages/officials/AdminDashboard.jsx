import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import { OfficialOnly } from "../../components/PermissionGate";
import { useOfficialBarangayRequests } from "../../hooks/useOfficialBarangayRequests";
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
import { MapPin } from "lucide-react";
import AppSideBar from "../../components/ui/side-bar";
import {
  getDashboardStats,
  getWeeklyRequestsData,
  getRecentActivities,
  getStatsTrends,
} from "../../services/dashboardService";

// Constants
const QUICK_ACTIONS = [
  {
    label: "Barangay Requests",
    icon: MapPin,
    path: "/barangay-requests",
    variant: "primary",
    description: "Review membership requests",
  },
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

// Helper functions
const getStatsConfig = (data, barangayStats, trends) => [
  {
    title: "Pending Barangay Requests",
    value: barangayStats?.pending?.toString() || "0",
    icon: MapPin,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    trend: `${barangayStats?.total || 0} total requests`,
  },
  {
    title: "Pending Requests",
    value: data?.pendingRequests?.toString() || "0",
    icon: FileTextIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    trend: trends?.pendingFromYesterday
      ? `+${trends.pendingFromYesterday} from yesterday`
      : "No new requests",
  },
  {
    title: "Total Residents",
    value: data?.totalResidents?.toString() || "0",
    icon: UsersIcon,
    color: "text-green-600",
    bgColor: "bg-green-50",
    trend: trends?.newResidentsThisMonth
      ? `+${trends.newResidentsThisMonth} this month`
      : "No new residents",
  },
  {
    title: "Completed Today",
    value: data?.completedToday?.toString() || "0",
    icon: CheckCircleIcon,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    trend: "On track",
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
        title="Weekly Requests Overview"
      />
      <QuickActions actions={QUICK_ACTIONS} className="mb-6" />
      <RecentActivity
        activities={activities}
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
  const [chartData, setChartData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [trends, setTrends] = useState(null);

  // Use barangay requests hook
  const { stats: barangayStats, fetchRequestStats } = useOfficialBarangayRequests();

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);

      if (user?.barangayId) {
        // Fetch all dashboard data in parallel
        const [stats, weeklyData, recentActivities, statsTrends] = await Promise.all([
          getDashboardStats(user.barangayId),
          getWeeklyRequestsData(),
          getRecentActivities(10),
          getStatsTrends(user.barangayId),
        ]);

        // Fetch barangay stats separately (this updates the hook's internal state)
        await fetchRequestStats();

        setDashboardData(stats);
        setChartData(weeklyData);
        setActivities(recentActivities);
        setTrends(statsTrends);
      }
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
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = useMemo(
    () => getStatsConfig(dashboardData, barangayStats, trends),
    [dashboardData, barangayStats, trends]
  );

  return (
    <AppSideBar>
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
        <NavigationHeader user={user} roleName={roleName} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader />
          <PermissionNotice />

          <OfficialOnly>
            <DashboardContent
              stats={stats}
              chartData={chartData}
              activities={activities}
              isLoading={isLoading}
            />
          </OfficialOnly>
        </main>
      </div>
    </AppSideBar>
  );
}

export default AdminDashboard;
