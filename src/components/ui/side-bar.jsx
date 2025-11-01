    import React, { useState, useEffect, useMemo, useCallback } from "react";
    import {
    Menu,
    X,
    LayoutDashboard,
    Settings,
    FilePlus,
    FolderOpen,
    User,

    } from "lucide-react";
    import { Link } from "react-router-dom";
    // import { NavUser } from "./nav-user";
    // import { SidebarProvider } from "./ui/sidebar";
    import NavSidebar from "./nav-sidebar";

    export default function AppSideBar({ children }) {
    const [isOpen, setIsOpen] = useState(true); // desktop state
    const [isMobileOpen, setIsMobileOpen] = useState(false); // mobile state
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const menuItems = useMemo(
        () => [
        { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
        { name: "My Request", icon: <FolderOpen size={18} />, path: "/requests" },
        { name: "New Request", icon: <FilePlus size={18} />, path: "/new-request" },
        { name: "Profile", icon: <User  size={18} />, path: "/netWorthAnalysis" },
        // { name: "Reports",icon: <FileText size={18} />, path : "/reports" },
        // { name: "Charts",icon: <AreaChart size={18} />, path : "/charts" },
        { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
        ],
        []
    );

    const toggleDesktopSidebar = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const toggleMobileSidebar = useCallback(() => {
        setIsMobileOpen((prev) => !prev);
    }, []);

    const closeMobileSidebar = useCallback(() => {
        setIsMobileOpen(false);
    }, []);

    useEffect(() => {
        let prevIsMobile = window.innerWidth < 768;

        const handleResize = () => {
        const nowIsMobile = window.innerWidth < 768;

        if (nowIsMobile !== prevIsMobile) {
            setIsMobile(nowIsMobile);
            if (nowIsMobile) {
            setIsOpen(false);
            setIsMobileOpen(false);
            } else {
            setIsOpen(true);
            setIsMobileOpen(false);
            }
            prevIsMobile = nowIsMobile;
        }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const SidebarContent = (
        <div
        className={`flex flex-col h-full bg-white border-r border-gray-200 text-gray-900 font-sans text-sm transition-all duration-300
            ${isOpen && !isMobile ? "w-51" : "w-16"} ${isMobile ? "w-56" : ""}`}
        style={{ minHeight: "100vh" }}
        >
        {/* Header */}
        <div className="flex justify-between items-center py-4 px-3 border-b border-gray-200">
            {(isOpen && !isMobile) || isMobile ? (
            <h1 className="text-base font-semibold tracking-tight">Barangay Online Services System (BOSS)</h1>
            ) : null}
            <button
            onClick={isMobile ? toggleMobileSidebar : toggleDesktopSidebar}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
            {isMobile ? <X size={18} /> : isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
        </div>

        {/* Menu Items */}
    <nav className="flex flex-col flex-1 mt-3 px-2">
            {menuItems.map((item, index) => (
            <Link
                key={index}
                to={item.path}
                className="group relative flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
                onClick={isMobile ? closeMobileSidebar : undefined}
            >
                {item.icon}

                {((!isMobile && isOpen) || isMobile) && <span>{item.name}</span>}

                {!isMobile && !isOpen && (
                <span className="absolute left-full ml-2 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                    {item.name}
                </span>
                )}
            </Link>
            ))}
    </nav>

        {/* NavUser fixed at bottom with no extra space */}
        {/* <div className="border-t border-gray-200 p-3 h-17">
            <SidebarProvider>
            <NavUser />
            </SidebarProvider>
        </div> */}
        <div className="border-t border-gray-200 px-3 py-2 flex items-center justify-center">
            <NavSidebar />
        </div>
</div>
    );

    return (
        <div className="flex font-sans">
        {isMobile && !isMobileOpen && (
            <button
            className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md"
            onClick={toggleMobileSidebar}
            >
            <Menu size={18} />
            </button>
        )}

        {!isMobile && (
            <div className="fixed left-0 top-0 h-screen shadow-sm">
            {SidebarContent}
            </div>
        )}

        {isMobile && isMobileOpen && (
            <>
            <div
                className="fixed inset-0 bg-black bg-opacity-30 z-40"
                onClick={closeMobileSidebar}
            />
            <div className="fixed left-0 top-0 h-screen z-50 shadow-sm">
                {SidebarContent}
            </div>
            </>
        )}

        <div
            className={`flex-1 transition-all duration-300 ${
            !isMobile ? (isOpen ? "ml-48" : "ml-16") : ""
            }`}
        >
            {children}
        </div>
        </div>
    );
    }
