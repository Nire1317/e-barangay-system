import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import AppSideBar from "../../components/ui/side-bar";

// Mock data
const RESIDENTS_DATA = [
  {
    id: 1,
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "+63 912 345 6789",
    address: "123 Main St, Barangay Center",
    status: "verified",
    registeredDate: "2025-01-15",
    age: 34,
    gender: "Female",
  },
  {
    id: 2,
    name: "Juan Dela Cruz",
    email: "juan.delacruz@email.com",
    phone: "+63 923 456 7890",
    address: "456 Church Ave, Block 2",
    status: "verified",
    registeredDate: "2025-02-20",
    age: 45,
    gender: "Male",
  },
  {
    id: 3,
    name: "Ana Reyes",
    email: "ana.reyes@email.com",
    phone: "+63 934 567 8901",
    address: "789 School Rd, Sitio 3",
    status: "pending",
    registeredDate: "2025-10-05",
    age: 28,
    gender: "Female",
  },
  {
    id: 4,
    name: "Pedro Garcia",
    email: "pedro.garcia@email.com",
    phone: "+63 945 678 9012",
    address: "321 Market St, Zone 1",
    status: "verified",
    registeredDate: "2023-12-10",
    age: 52,
    gender: "Male",
  },
  {
    id: 5,
    name: "Lisa Fernandez",
    email: "lisa.fernandez@email.com",
    phone: "+63 956 789 0123",
    address: "654 Park Lane, Block 4",
    status: "inactive",
    registeredDate: "2023-11-25",
    age: 41,
    gender: "Female",
  },
];

const STATS = [
  {
    title: "Total Residents",
    value: "456",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    trend: "+12 this month",
  },
  {
    title: "Verified",
    value: "398",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    trend: "87% of total",
  },
  {
    title: "Pending",
    value: "43",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    trend: "Needs review",
  },
  {
    title: "Inactive",
    value: "15",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    trend: "3% of total",
  },
];

// Components
const NavigationHeader = () => (
  <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-14.5 items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Residents Management
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
      Residents
    </h2>
    <p className="text-base text-slate-600 mt-2 font-medium">
      Manage resident information and registrations
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

const ActionButton = ({ icon: Icon, label, variant = "default", onClick }) => {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline: "border-2 border-slate-300 text-slate-700 hover:bg-slate-50",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${variants[variant]}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    verified: {
      label: "Verified",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    pending: {
      label: "Pending",
      className: "bg-orange-100 text-orange-700 border-orange-200",
    },
    inactive: {
      label: "Inactive",
      className: "bg-red-100 text-red-700 border-red-200",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
      {config.label}
    </span>
  );
};

const ResidentRow = ({ resident }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
            {resident.name.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-slate-900">
              {resident.name}
            </div>
            <div className="text-xs text-slate-500">{resident.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-slate-900">{resident.phone}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-slate-900 max-w-xs truncate">
          {resident.address}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={resident.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {resident.registeredDate}
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
                Edit
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default function ResidentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  return (
    <AppSideBar>
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
        <NavigationHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {STATS.map((stat, index) => (
              <StatsCard key={index} stat={stat} />
            ))}
          </div>

          {/* Actions Bar */}
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
                    placeholder="Search residents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-2">
                <ActionButton icon={Upload} label="Import" variant="outline" />
                <ActionButton
                  icon={Download}
                  label="Export"
                  variant="secondary"
                />
                <ActionButton icon={UserPlus} label="Add Resident" />
              </div>
            </div>
          </div>

          {/* Residents Table */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Resident
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {RESIDENTS_DATA.map((resident) => (
                    <ResidentRow key={resident.id} resident={resident} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing <span className="font-semibold">1-5</span> of{" "}
                <span className="font-semibold">456</span> residents
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                  1
                </button>
                <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  2
                </button>
                <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  3
                </button>
                <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppSideBar>
  );
}
