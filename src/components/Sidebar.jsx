// components/Sidebar.jsx
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
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
  FiUser,
  FiGrid,
  FiShield,
  FiUserCheck,
  FiClipboard,
  FiMessageSquare,
  FiTrendingUp,
} from "react-icons/fi";
import {
  FaRocket,
  FaUserFriends,
  FaTasks,
  FaUserCog,
} from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";
import { MdOutlineAnalytics } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { logoutUser, logoutAllUsers } from "../services/authApi";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutAll, setLogoutAll] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, hasRole, userRole } = useAuth();

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
    window.dispatchEvent(
      new CustomEvent("sidebarToggle", {
        detail: { isCollapsed },
      })
    );
  }, [isCollapsed]);

  // Role-based navigation items
  const getNavItems = () => {
    const navItems = [];

    // ===== MAIN SECTION =====
    const mainItems = [
      { path: "/", label: "Dashboard", icon: FiHome, end: true },
      { path: "/projects", label: "Projects", icon: FiFolder },
    ];

    // Only show "New Project" for admin, client, and team member
    if (hasRole(['admin', 'client', 'team_member'])) {
      mainItems.push({ path: "/new", label: "New Project", icon: FiPlus });
    }

    navItems.push({
      section: "Main",
      items: mainItems,
    });

    // ===== ADMIN SECTION (Only for Admin) =====
    if (hasRole(['admin'])) {
      navItems.push({
        section: "Admin",
        items: [
          { path: "/admin/users", label: "User Management", icon: FaUserCog },
          { path: "/admin/roles", label: "Role Management", icon: FiShield },
          { path: "/admin/settings", label: "System Settings", icon: FiSettings },
        ],
      });
    }

    // ===== ANALYTICS SECTION (Admin & Client) =====
    if (hasRole(['admin', 'client'])) {
      navItems.push({
        section: "Analytics",
        items: [
          { path: "/analytics", label: "Analytics", icon: MdOutlineAnalytics },
          { path: "/reports", label: "Reports", icon: FiBarChart2 },
          { path: "/timeline", label: "Timeline", icon: FiCalendar },
        ],
      });
    }

    // ===== TEAM SECTION (Admin & Team Member) =====
    if (hasRole(['admin', 'team_member'])) {
      navItems.push({
        section: "Team",
        items: [
          { path: "/team", label: "Team Members", icon: FiUsers },
          { path: "/clients", label: "Clients", icon: FaUserFriends },
          { path: "/tasks", label: "Tasks", icon: FaTasks },
        ],
      });
    }

    // ===== CHAT SECTION (Admin, Client, Team Member) =====
    if (hasRole(['admin', 'client', 'team_member'])) {
      navItems.push({
        section: "Communication",
        items: [
          { path: "/chat", label: "Chat", icon: FiMessageSquare },
          { path: "/notifications", label: "Notifications", icon: FiBell },
        ],
      });
    }

    // ===== SETTINGS SECTION (Everyone) =====
    const settingsItems = [
      { path: "/profile", label: "Profile", icon: FiUser },
    ];

    // Only show settings for admin, client, team_member
    if (hasRole(['admin', 'client', 'team_member'])) {
      settingsItems.push({ path: "/settings", label: "Settings", icon: FiSettings });
    }

    navItems.push({
      section: "Settings",
      items: settingsItems,
    });

    return navItems;
  };

  const navItems = getNavItems();

  // Quick stats - dynamic based on role
  const getQuickStats = () => {
    const stats = [];

    // Projects - visible to all
    stats.push({ 
      label: "Projects", 
      value: "12", 
      icon: FiFolder, 
      color: "blue" 
    });

    // Tasks - visible to admin, client, team_member
    if (hasRole(['admin', 'client', 'team_member'])) {
      stats.push({ 
        label: "Tasks", 
        value: "48", 
        icon: FaTasks, 
        color: "green" 
      });
    }

    // Team - visible to admin and team_member
    if (hasRole(['admin', 'team_member'])) {
      stats.push({ 
        label: "Team", 
        value: "8", 
        icon: FiUsers, 
        color: "purple" 
      });
    }

    // If no stats, add default
    if (stats.length === 0) {
      stats.push({ 
        label: "Projects", 
        value: "0", 
        icon: FiFolder, 
        color: "blue" 
      });
    }

    return stats;
  };

  const quickStats = getQuickStats();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const handleLogoutClick = () => {
    setLogoutAll(false);
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      if (logoutAll) {
        await logoutAllUsers();
      } else {
        await logoutUser();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setShowLogoutModal(false);
      setLogoutAll(false);
      setIsLoggingOut(false);
      setIsMobileOpen(false);

      navigate("/login", { replace: true });
    }
  };

  const handleCancelLogout = () => {
    if (isLoggingOut) return;
    setShowLogoutModal(false);
    setLogoutAll(false);
  };

  const getStatColor = (color) => {
    switch (color) {
      case "blue": return "text-blue-600 bg-blue-50";
      case "green": return "text-green-600 bg-green-50";
      case "purple": return "text-purple-600 bg-purple-50";
      case "indigo": return "text-indigo-600 bg-indigo-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  // Get user role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'client': return 'bg-blue-100 text-blue-700';
      case 'team_member': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Check if user can view chat
  const canChat = hasRole(['admin', 'client', 'team_member']);

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
        <div className={`flex items-center border-b border-gray-200 ${isCollapsed ? "justify-center py-4" : "px-5 py-4"}`}>
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/gemnixx-logo1 (1).png"
              alt="Gemnixx"
              className={`${isCollapsed ? "w-10 h-10" : "w-40 h-12"} object-contain`}
            />
          </Link>
        </div>

        {/* User Role Badge */}
        {!isCollapsed && user && (
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-base shadow-md">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${getRoleBadgeColor(user.role)}`}>
                    {user.role || "viewer"}
                  </span>
                  {user.isPasswordChanged === false && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                      ⚠️
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Password change warning */}
            {user.isPasswordChanged === false && (
              <div className="mt-1.5 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                Please change your password
              </div>
            )}
          </div>
        )}

        {/* Quick Stats - Only when expanded */}
        {!isCollapsed && quickStats.length > 0 && (
          <div className="px-3 py-3 border-b border-gray-200">
            <div className={`grid ${quickStats.length === 1 ? 'grid-cols-1' : quickStats.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-1.5`}>
              {quickStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className={`rounded-lg p-2 text-center ${getStatColor(stat.color)} transition-all hover:scale-105 cursor-default`}
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
                      className={({ isActive: navIsActive }) => `
                        flex items-center gap-3 px-3 py-2.5 rounded-xl
                        transition-all duration-200 group relative
                        ${
                          navIsActive
                            ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-gray-800 shadow-sm border border-blue-200/50"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        }
                        ${isCollapsed ? "justify-center" : ""}
                      `}
                      title={isCollapsed ? item.label : ""}
                    >
                      <Icon
                        className={`
                          w-5 h-5 flex-shrink-0
                          ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"}
                          transition-colors
                        `}
                      />

                      {!isCollapsed && (
                        <span className={`text-sm font-medium ${isActive ? "text-gray-800" : "text-gray-600"}`}>
                          {item.label}
                        </span>
                      )}

                      {isCollapsed && (
                        <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                          {item.label}
                        </div>
                      )}

                      {isActive && (
                        <div
                          className={`
                            absolute right-0 top-1/2 -translate-y-1/2
                            w-1 h-7 bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-full
                            ${isCollapsed ? "right-1" : ""}
                          `}
                        />
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Action Button - Only for admin, client, team_member */}
          {hasRole(['admin', 'client', 'team_member']) && (
            <>
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

              {isCollapsed && (
                <Link
                  to="/new"
                  className="flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 mt-3"
                  title="Create New Project"
                >
                  <FaRocket className="w-5 h-5 text-white" />
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 p-3 space-y-2">
          {/* Pro Tip - Only for expanded */}
          {!isCollapsed && (
            <div className="px-3 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200/50">
              <div className="flex items-center gap-2">
                <HiOutlineLightBulb className="w-4 h-4 text-yellow-600" />
                <p className="text-xs text-gray-600">
                  <span className="text-yellow-600 font-medium">Tip:</span>{" "}
                  {userRole === 'admin' 
                    ? "Manage users from Admin panel" 
                    : canChat 
                      ? "Use chat to communicate with your team"
                      : "Contact admin for more permissions"}
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
            onClick={handleLogoutClick}
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0 group-hover:rotate-12 transition" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
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
            <p className="text-[10px] text-gray-400 text-center">v2.0.0 • © 2024</p>
          )}
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
                  <FiLogOut className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Logout</h2>
                  <p className="text-sm text-gray-500">Are you sure you want to logout?</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5">
              <label
                className={`
                  flex items-start gap-3 p-4 rounded-xl border cursor-pointer
                  transition-all duration-200
                  ${logoutAll ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}
                `}
              >
                <input
                  type="checkbox"
                  checked={logoutAll}
                  onChange={(e) => setLogoutAll(e.target.checked)}
                  disabled={isLoggingOut}
                  className="mt-1 w-4 h-4 accent-red-600 cursor-pointer"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">Logout from all devices</p>
                  <p className="text-xs text-gray-500 mt-1">
                    This will logout your account from all devices where you are currently signed in.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCancelLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-white border border-gray-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FiLogOut className="w-4 h-4" />
                {isLoggingOut ? "Logging out..." : logoutAll ? "Logout All" : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
    </>
  );
}