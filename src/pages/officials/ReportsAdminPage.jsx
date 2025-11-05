import React, { useState } from "react";
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
} from "lucide-react";
import AppSideBar from "../../components/ui/side-bar";

// Mock data
const REPORT_STATS = [
  {
    title: "Total Reports",
    value: "48",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    trend: "+8 this month",
  },
  {
    title: "Generated Today",
    value: "5",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50",
    trend: "Active reports",
  },
  {
    title: "Scheduled",
    value: "12",
    icon: Calendar,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    trend: "Automated",
  },
  {
    title: "Downloads",
    value: "234",
    icon: Download,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    trend: "This week",
  },
];

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
const NavigationHeader = () => (
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
              Admin User
            </p>
            <p className="text-xs text-slate-600 font-medium leading-tight mt-0.5">
              Administrator
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

const QuickGenerateSection = () => {
  const [dateRange, setDateRange] = useState("last-30-days");
  const [reportType, setReportType] = useState("residents");
  const [format, setFormat] = useState("pdf");

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
          >
            <option value="residents">Residents Summary</option>
            <option value="requests">Document Requests</option>
            {/* <option value="analytics">Analytics Report</option>
            <option value="financial">Financial Summary</option> */}
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
          >
            <option value="today">Today</option>
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="custom">Custom Range</option>
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
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
        </div>
        <div className="flex items-end">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <FileDown size={18} />
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ReportsPage() {
  const [filterCategory, setFilterCategory] = useState("all");

  return (
    <AppSideBar>
      {" "}
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
        <NavigationHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {REPORT_STATS.map((stat, index) => (
              <StatsCard key={index} stat={stat} />
            ))}
          </div>

          {/* Quick Generate Section */}
          <QuickGenerateSection />

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
                {/* <option value="analytics">Analytics</option> */}
                {/* <option value="finance">Finance</option> */}
                <option value="system">System</option>
                <option value="compliance">Compliance</option>
              </select>
            </div>
            <div className="text-sm text-slate-600">
              <span className="font-semibold">{REPORT_TYPES.length}</span>{" "}
              available reports
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 gap-6">
            {REPORT_TYPES.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>

          {/* Info Notice */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <FileText className="text-blue-600 mt-1" size={20} />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  Automated Report Generation
                </h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Reports are automatically generated based on their frequency
                  settings. You can manually regenerate any report or schedule
                  custom reports through the Quick Generate section above.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppSideBar>
  );
}
