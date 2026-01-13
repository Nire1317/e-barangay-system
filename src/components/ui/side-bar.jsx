import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Settings,
  FilePlus,
  FolderOpen,
  User,
  Users,
  FileText,
  BarChart3,
  Shield,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermissions";
import NavSidebar from "./signOut-btn";

// Constants
const BASE_MENU_ITEMS = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Join Barangay",
    icon: MapPin,
    path: "/join-barangay",
  },
  {
    name: "My Requests",
    icon: FolderOpen,
    path: "/requests",
  },
  {
    name: "New Request",
    icon: FilePlus,
    path: "/new-request",
  },
  {
    name: "Become Official",
    icon: Shield,
    path: "/request-verification",
  },
  {
    name: "Profile",
    icon: User,
    path: "/profile",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const OFFICIAL_MENU_ITEMS = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Barangay Requests",
    icon: MapPin,
    path: "/barangay-requests",
  },
  {
    name: "Manage Requests",
    icon: FileText,
    path: "/manage-requests",
  },
  {
    name: "Official Verifications",
    icon: Shield,
    path: "/official-verifications",
  },
  {
    name: "Residents",
    icon: Users,
    path: "/residents",
  },
  {
    name: "Reports",
    icon: FileText,
    path: "/reports",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const ADMIN_MENU_ITEMS = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/superadmin",
  },
  {
    name: "All Verifications",
    icon: Shield,
    path: "/super-admin-verifications",
  },
  {
    name: "Official Verifications",
    icon: Shield,
    path: "/official-verifications",
  },
  {
    name: "Reports",
    icon: FileText,
    path: "/reports",
  },
  {
    name: "Admin Panel",
    icon: Shield,
    path: "/official-panel",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

// Hooks
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // const menuItems = useMemo(
  //   () => [
  //     {
  //       name: "Dashboard",
  //       icon: <LayoutDashboard size={18} />,
  //       path: "/dashboard",
  //     },
  //     {
  //       name: "My Request",
  //       icon: <FolderOpen size={18} />,
  //       path: "/requests",
  //     },
  //     {
  //       name: "New Request",
  //       icon: <FilePlus size={18} />,
  //       path: "/new-request",
  //     },
  //     {
  //       name: "Profile",
  //       icon: <User size={18} />,
  //       path: "/netWorthAnalysis",
  //     },
  //     // { name: "Reports",icon: <FileText size={18} />, path : "/reports" },
  //     // { name: "Charts",icon: <AreaChart size={18} />, path : "/charts" },
  //     { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
  //   ],
  //   []
  // );

  // const toggleDesktopSidebar = useCallback(() => {
  //   setIsOpen((prev) => !prev);
  // }, []);

  // const toggleMobileSidebar = useCallback(() => {
  //   setIsMobileOpen((prev) => !prev);
  // }, []);

  // const closeMobileSidebar = useCallback(() => {
  //   setIsMobileOpen(false);
  // }, []);
  useEffect(() => {
    let prevIsMobile = window.innerWidth < 768;

    const handleResize = () => {
      const nowIsMobile = window.innerWidth < 768;

      if (nowIsMobile !== prevIsMobile) {
        setIsMobile(nowIsMobile);
        prevIsMobile = nowIsMobile;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

const useSidebarState = (isMobile) => {
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
      setIsMobileOpen(false);
    } else {
      setIsOpen(true);
      setIsMobileOpen(false);
    }
  }, [isMobile]);

  const toggleDesktop = useCallback(() => setIsOpen((prev) => !prev), []);
  const toggleMobile = useCallback(() => setIsMobileOpen((prev) => !prev), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  return {
    isOpen,
    isMobileOpen,
    toggleDesktop,
    toggleMobile,
    closeMobile,
  };
};

// Components
const SidebarHeader = ({ isOpen, isMobile, isAdmin, isOfficial, onToggle }) => (
  <div className="flex justify-between items-center py-4 px-3 border-b border-gray-200">
    {(isOpen && !isMobile) || isMobile ? (
      <div>
        <h1 className="text-base font-semibold tracking-tight">
          Barangay Online Services System (BOSS)
        </h1>
        {(isAdmin || isOfficial) && (
          <p className="text-xs text-gray-500 mt-1">
            {isAdmin ? "Admin Portal" : "Official Portal"}
          </p>
        )}
      </div>
    ) : null}
    <button
      onClick={onToggle}
      className="p-1 rounded-md hover:bg-gray-100 transition-colors"
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      {isMobile || isOpen ? <X size={18} /> : <Menu size={18} />}
    </button>
  </div>
);

const MenuItem = ({ item, isOpen, isMobile, onClick }) => {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      className="group relative flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
      onClick={onClick}
    >
      <Icon size={18} />

      {((!isMobile && isOpen) || isMobile) && <span>{item.name}</span>}

      {!isMobile && !isOpen && (
        <span className="absolute left-full ml-2 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">
          {item.name}
        </span>
      )}
    </Link>
  );
};

const SidebarContent = ({
  isOpen,
  isMobile,
  isAdmin,
  isOfficial,
  menuItems,
  onToggle,
  onMenuClick,
}) => {
  const widthClass = useMemo(() => {
    if (isMobile) return "w-56";
    return isOpen ? "w-51" : "w-16";
  }, [isOpen, isMobile]);

  return (
    <div
      className={`flex flex-col h-full bg-white border-r border-gray-200 text-gray-900 font-sans text-sm transition-all duration-300 ${widthClass}`}
      style={{ minHeight: "100vh" }}
    >
      <SidebarHeader
        isOpen={isOpen}
        isMobile={isMobile}
        isAdmin={isAdmin}
        isOfficial={isOfficial}
        onToggle={onToggle}
      />

      <nav className="flex flex-col flex-1 mt-3 px-2">
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            item={item}
            isOpen={isOpen}
            isMobile={isMobile}
            onClick={isMobile ? onMenuClick : undefined}
          />
        ))}
      </nav>

      <div className="border-t border-gray-200 px-3 py-2 flex items-center justify-center">
        <NavSidebar isOpen={isOpen} isMobile={isMobile} />
      </div>
    </div>
  );
};

const MobileMenuButton = ({ onClick }) => (
  <button
    className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md shadow-lg"
    onClick={onClick}
    aria-label="Open menu"
  >
    <Menu size={18} />
  </button>
);

const MobileOverlay = ({ onClick }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-30 z-40"
    onClick={onClick}
    aria-hidden="true"
  />
);

// Main component
export default function AppSideBar({ children }) {
  const isMobile = useResponsive();
  const { isAdmin, isOfficial } = usePermissions();
  const { isOpen, isMobileOpen, toggleDesktop, toggleMobile, closeMobile } =
    useSidebarState(isMobile);

  const menuItems = useMemo(() => {
    if (isAdmin) return ADMIN_MENU_ITEMS;
    if (isOfficial) return OFFICIAL_MENU_ITEMS;
    return BASE_MENU_ITEMS;
  }, [isAdmin, isOfficial]);

  const contentMargin = useMemo(() => {
    if (isMobile) return "";
    return isOpen ? "ml-48" : "ml-16";
  }, [isMobile, isOpen]);

  return (
    <div className="flex font-sans">
      {/* Mobile menu button */}
      {isMobile && !isMobileOpen && <MobileMenuButton onClick={toggleMobile} />}

      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="fixed left-0 top-0 h-screen shadow-sm z-40">
          <SidebarContent
            isOpen={isOpen}
            isMobile={isMobile}
            isAdmin={isAdmin}
            isOfficial={isOfficial}
            menuItems={menuItems}
            onToggle={toggleDesktop}
            onMenuClick={closeMobile}
          />
        </div>
      )}

      {/* Mobile sidebar */}
      {isMobile && isMobileOpen && (
        <>
          <MobileOverlay onClick={closeMobile} />
          <div className="fixed left-0 top-0 h-screen z-50 shadow-sm">
            <SidebarContent
              isOpen={isOpen}
              isMobile={isMobile}
              isAdmin={isAdmin}
              isOfficial={isOfficial}
              menuItems={menuItems}
              onToggle={toggleMobile}
              onMenuClick={closeMobile}
            />
          </div>
        </>
      )}

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${contentMargin}`}>
        {children}
      </div>
    </div>
  );
}
