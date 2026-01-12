import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  Users,
  ClipboardCheck,
  BarChart3,
  PieChart,
  FileDown,
  Printer,
  Mail,
  Eye,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import AppSideBar from "../../components/ui/side-bar";
import { useReports } from "../../hooks/useReports";
import { useAuth } from "../../hooks/useAuth";

// Report stats will be dynamically generated from useReports hook

const REPORT_TYPES = [
  {
    id: 1,
    title: "Residents Summary Report",
    description: "Complete overview of all registered residents",
    icon: Users,
    category: "Demographics",
    lastGenerated: "2 hours ago",
    frequency: "Daily",
    status: "ready",
  },
  {
    id: 2,
    title: "Document Requests Report",
    description: "All document requests with status tracking",
    icon: ClipboardCheck,
    category: "Operations",
    lastGenerated: "5 hours ago",
    frequency: "Weekly",
    status: "ready",
  },
  {
    id: 3,
    title: "Monthly Analytics Report",
    description: "Detailed analytics and trends for the month",
    icon: BarChart3,
    category: "Analytics",
    lastGenerated: "1 day ago",
    frequency: "Monthly",
    status: "generating",
  },
  {
    id: 4,
    title: "Financial Summary",
    description: "Revenue and expenses breakdown",
    icon: PieChart,
    category: "Finance",
    lastGenerated: "3 hours ago",
    frequency: "Weekly",
    status: "ready",
  },
  {
    id: 5,
    title: "Activity Logs Report",
    description: "System activities and user actions",
    icon: FileText,
    category: "System",
    lastGenerated: "30 minutes ago",
    frequency: "Daily",
    status: "ready",
  },
  {
    id: 6,
    title: "Compliance Report",
    description: "Regulatory compliance and audit trail",
    icon: ClipboardCheck,
    category: "Compliance",
    lastGenerated: "2 days ago",
    frequency: "Monthly",
    status: "scheduled",
  },
];

// Components
const NavigationHeader = ({ user }) => (
  <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-14.5 items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Reports & Analytics
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">
              {user?.full_name || "User"}
            </p>
            <p className="text-xs text-slate-600 font-medium leading-tight mt-0.5">
              {user?.role === "official" ? "Official" : "Administrator"}
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
      Reports
    </h2>
    <p className="text-base text-slate-600 mt-2 font-medium">
      Generate and download comprehensive reports for your barangay
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
    ready: {
      label: "Ready",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    generating: {
      label: "Generating",
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
    scheduled: {
      label: "Scheduled",
      className: "bg-purple-100 text-purple-700 border-purple-200",
    },
  };

  const config = statusConfig[status] || statusConfig.ready;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
      {config.label}
    </span>
  );
};

const ReportCard = ({ report }) => {
  const Icon = report.icon;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="bg-linear-to-br from-blue-400 to-blue-600 p-3 rounded-lg text-white">
            <Icon size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {report.title}
            </h3>
            <p className="text-sm text-slate-600 mb-3">{report.description}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {report.lastGenerated}
              </span>
              <span className="px-2 py-1 bg-slate-100 rounded-full font-medium">
                {report.category}
              </span>
              <span className="font-medium">{report.frequency}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          <Download size={16} />
          Download
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
          <Eye size={16} />
          Preview
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
          <RefreshCw size={16} />
          Regenerate
        </button>
        <button className="ml-auto p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <Printer size={18} />
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <Mail size={18} />
        </button>
      </div>
    </div>
  );
};

const QuickGenerateSection = ({ onGenerate, loading }) => {
  const [dateRange, setDateRange] = useState("last-30-days");
  const [reportType, setReportType] = useState("residents");
  const [format, setFormat] = useState("csv");

  const handleGenerate = () => {
    onGenerate(reportType, dateRange, format);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Quick Generate Report
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={loading}
          >
            <option value="residents">Residents Summary</option>
            <option value="requests">Document Requests</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={loading}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={loading}
          >
            <option value="csv">CSV</option>
            <option value="pdf">PDF (Coming Soon)</option>
            <option value="excel">Excel (Coming Soon)</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileDown size={18} />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ReportsPage() {
  const { user } = useAuth();
  const {
    stats,
    loading,
    error,
    fetchReportStats,
    generateResidentsReport,
    generateRequestsReport,
    downloadReport,
  } = useReports();

  const [filterCategory, setFilterCategory] = useState("all");
  const [generating, setGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Load initial data
  useEffect(() => {
    if (user?.barangayId) {
      fetchReportStats();
    }
  }, [user?.barangayId]);

  // Generate report stats data
  const REPORT_STATS = [
    {
      title: "Total Reports",
      value: stats.totalReports.toString(),
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "Available types",
    },
    {
      title: "Generated Today",
      value: stats.generatedToday.toString(),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "Active reports",
    },
    {
      title: "Scheduled",
      value: stats.scheduled.toString(),
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "Automated",
    },
    {
      title: "Total Records",
      value: stats.downloads.toString(),
      icon: Download,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "Available data",
    },
  ];

  // Handle report generation
  const handleGenerateReport = async (reportType, dateRange, format) => {
    try {
      setGenerating(true);
      setSuccessMessage("");

      let reportData;
      if (reportType === "residents") {
        reportData = await generateResidentsReport(dateRange, format);
      } else if (reportType === "requests") {
        reportData = await generateRequestsReport(dateRange, format);
      }

      if (reportData) {
        downloadReport(reportData);
        setSuccessMessage(
          `${reportType === "residents" ? "Residents Summary" : "Document Requests"} report generated successfully!`
        );

        // Refresh stats
        await fetchReportStats();

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      }
    } catch (err) {
      console.error("Error generating report:", err);
      alert(`Failed to generate report: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  // Filter reports based on category
  const filteredReports =
    filterCategory === "all"
      ? REPORT_TYPES
      : REPORT_TYPES.filter(
          (report) => report.category.toLowerCase() === filterCategory
        );

  // Show warning if no barangay assigned
  if (!user?.barangayId) {
    return (
      <AppSideBar>
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                  No Barangay Assigned
                </h3>
                <p className="text-amber-800">
                  You must be assigned to a barangay to generate reports. Please
                  contact your system administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppSideBar>
    );
  }

  return (
    <AppSideBar>
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
        <NavigationHeader user={user} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader />

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="text-green-600" size={20} />
              <p className="text-sm text-green-800 font-medium">
                {successMessage}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && !generating && (
            <div className="mb-6 flex items-center justify-center gap-3 p-8">
              <Loader2 className="animate-spin text-blue-600" size={24} />
              <p className="text-slate-600">Loading report statistics...</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {REPORT_STATS.map((stat, index) => (
              <StatsCard key={index} stat={stat} />
            ))}
          </div>

          {/* Quick Generate Section */}
          <QuickGenerateSection
            onGenerate={handleGenerateReport}
            loading={generating}
          />

          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Filter size={18} className="text-slate-600" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="all">All Categories</option>
                <option value="demographics">Demographics</option>
                <option value="operations">Operations</option>
                <option value="system">System</option>
                <option value="compliance">Compliance</option>
              </select>
            </div>
            <div className="text-sm text-slate-600">
              <span className="font-semibold">{filteredReports.length}</span>{" "}
              available reports
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 gap-6">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>

          {/* Info Notice */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <FileText className="text-blue-600 mt-1" size={20} />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  Report Generation
                </h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Use the Quick Generate section above to create and download
                  reports in CSV format. PDF and Excel export options are coming
                  soon. All generated reports are automatically logged for
                  tracking purposes.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppSideBar>
  );
}
