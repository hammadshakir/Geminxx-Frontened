// components/Sidebar.jsx
import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiFolder,
  FiPlus,
  FiSettings,
  FiUsers,
  FiBarChart2,
  FiCalendar,
  FiBell,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiGrid,
  FiTrendingUp,
  FiClock,
  FiTag,
  FiStar,
} from "react-icons/fi";
import {
  FaProjectDiagram,
  FaRocket,
  FaUserFriends,
  FaTasks,
} from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";
import { MdOutlineAnalytics } from "react-icons/md";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Notify App about sidebar state change
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('sidebarToggle', { 
      detail: { isCollapsed } 
    }));
  }, [isCollapsed]);

  // Navigation items with icons and labels
  const navItems = [
    {
      section: "Main",
      items: [
        { path: "/", label: "Dashboard", icon: FiHome, end: true },
        { path: "/projects", label: "Projects", icon: FiFolder },
        { path: "/new", label: "New Project", icon: FiPlus },
      ],
    },
    {
      section: "Analytics",
      items: [
        { path: "/analytics", label: "Analytics", icon: MdOutlineAnalytics },
        { path: "/reports", label: "Reports", icon: FiBarChart2 },
        { path: "/timeline", label: "Timeline", icon: FiCalendar },
      ],
    },
    {
      section: "Team",
      items: [
        { path: "/team", label: "Team Members", icon: FiUsers },
        { path: "/clients", label: "Clients", icon: FaUserFriends },
        { path: "/tasks", label: "Tasks", icon: FaTasks },
      ],
    },
    {
      section: "Settings",
      items: [
        { path: "/settings", label: "Settings", icon: FiSettings },
        { path: "/notifications", label: "Notifications", icon: FiBell },
      ],
    },
  ];

  // Quick stats
  const quickStats = [
    { label: "Projects", value: "12", icon: FiFolder, color: "blue" },
    { label: "Tasks", value: "48", icon: FaTasks, color: "green" },
    { label: "Team", value: "8", icon: FiUsers, color: "purple" },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Get stat color
  const getStatColor = (color) => {
    switch(color) {
      case 'blue': return 'text-blue-600 bg-blue-50';
      case 'green': return 'text-green-600 bg-green-50';
      case 'purple': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
        aria-label="Toggle sidebar"
      >
        <FiMenu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out z-50
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          shadow-lg
          overflow-hidden
          flex flex-col
        `}
      >
        {/* Logo Section */}
        <div className={`
          flex items-center border-b border-gray-200
          ${isCollapsed ? "justify-center py-4" : "px-5 py-4"}
        `}>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-md">
              <FaProjectDiagram className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Gemnixx
                </span>
                <span className="block text-[10px] text-gray-400 font-medium tracking-wider">
                  PROJECT MANAGEMENT
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Quick Stats - Only when expanded */}
        {!isCollapsed && (
          <div className="px-3 py-3 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-1.5">
              {quickStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className={`rounded-lg p-2 text-center ${getStatColor(stat.color)} transition-all hover:scale-105`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    <p className="text-sm font-bold">{stat.value}</p>
                    <p className="text-[9px] font-medium truncate">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-3">
          {navItems.map((section) => (
            <div key={section.section}>
              {!isCollapsed && (
                <p className="px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  {section.section}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.end
                    ? location.pathname === item.path
                    : location.pathname.startsWith(item.path);

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl
                        transition-all duration-200 group relative
                        ${isActive
                          ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-gray-800 shadow-sm border border-blue-200/50"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        }
                        ${isCollapsed ? "justify-center" : ""}
                      `}
                      title={isCollapsed ? item.label : ""}
                    >
                      <Icon className={`
                        w-5 h-5 flex-shrink-0
                        ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"}
                        transition-colors
                      `} />
                      
                      {!isCollapsed && (
                        <span className={`text-sm font-medium ${isActive ? "text-gray-800" : "text-gray-600"}`}>
                          {item.label}
                        </span>
                      )}

                      {/* Tooltip for collapsed mode */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                          {item.label}
                        </div>
                      )}

                      {/* Active indicator */}
                      {isActive && (
                        <div className={`
                          absolute right-0 top-1/2 -translate-y-1/2
                          w-1 h-7 bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-full
                          ${isCollapsed ? "right-1" : ""}
                        `} />
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Action Button */}
          {!isCollapsed && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <Link
                to="/new"
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
              >
                <FaRocket className="w-5 h-5 text-white group-hover:rotate-12 transition" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Create Project</p>
                  <p className="text-[10px] text-blue-200">Launch your next idea</p>
                </div>
                <FiPlus className="w-4 h-4 text-white/70 group-hover:rotate-90 transition" />
              </Link>
            </div>
          )}

          {/* Collapsed Quick Action */}
          {isCollapsed && (
            <Link
              to="/new"
              className="flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 mt-3"
              title="Create New Project"
            >
              <FaRocket className="w-5 h-5 text-white" />
            </Link>
          )}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 p-3 space-y-2">
          {/* Pro Tip */}
          {!isCollapsed && (
            <div className="px-3 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200/50">
              <div className="flex items-center gap-2">
                <HiOutlineLightBulb className="w-4 h-4 text-yellow-600" />
                <p className="text-xs text-gray-600">
                  <span className="text-yellow-600 font-medium">Tip:</span> Use shortcuts
                </p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            className={`
              flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
              text-red-500 hover:text-red-600 hover:bg-red-50
              transition-all duration-200 group
              ${isCollapsed ? "justify-center" : ""}
            `}
            onClick={() => console.log("Logout clicked")}
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0 group-hover:rotate-12 transition" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>

          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={`
              flex items-center gap-2 w-full px-3 py-2 rounded-xl
              text-gray-500 hover:text-gray-700 hover:bg-gray-50
              transition-all duration-200
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            {isCollapsed ? (
              <FiChevronRight className="w-5 h-5" />
            ) : (
              <div className="flex items-center gap-3">
                <FiChevronLeft className="w-5 h-5" />
                <span className="text-sm">Collapse</span>
              </div>
            )}
          </button>

          {/* Version Info */}
          {!isCollapsed && (
            <p className="text-[10px] text-gray-400 text-center">
              v2.0.0 • © 2024
            </p>
          )}
        </div>
      </aside>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </>
  );
}