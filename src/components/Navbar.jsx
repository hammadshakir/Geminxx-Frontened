// components/Navbar.jsx

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
FiGrid,
  FiPlus,
  FiUser,
  FiSettings,
  FiLogOut,
  FiBell,
  FiMenu,
  FiX,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { logoutUser, logoutAllUsers } from "../services/authApi";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [logoutAllDevices, setLogoutAllDevices] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  {/* {outside-click} */}

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  {/* {responsive-menu} */}

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  {/* {logout-modal-open} */}

  const openLogoutModal = () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    setLogoutAllDevices(false);
    setIsLogoutModalOpen(true);
  };

  {/* {logout-modal-close} */}

  const closeLogoutModal = () => {
    if (isLoggingOut) return;

    setIsLogoutModalOpen(false);
    setLogoutAllDevices(false);
  };

  {/* {logout} */}

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      if (logoutAllDevices) {
        await logoutAllUsers();
      } else {
        await logoutUser();
      }

      logout();

      setIsLogoutModalOpen(false);
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
      setLogoutAllDevices(false);

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);

      alert(error.message || "Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* {navbar} */}

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between h-16">

            {/* {dashboard-header} */}

            <div className="flex items-center">

              <Link
                to="/"
                className="flex items-center gap-3 group"
              >

                {/* {dashboard-icon} */}

                <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                 <FiGrid className="w-5 h-5 text-blue-600" />
                </div>

                {/* {dashboard-text} */}

                <div className="flex flex-col justify-center">

                  <span className="text-lg font-bold text-gray-800 leading-tight">
                    Dashboard
                  </span>

                  <span className="text-xs text-gray-500 leading-tight mt-0.5 flex items-center gap-1">
                    Overview of your workspace

                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  </span>

                </div>

              </Link>

            </div>

            {/* {right-actions} */}

            <div className="flex items-center gap-3">

              {/* {new-project-button} */}

              <Link
                to="/new"
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow"
              >

                <FiPlus className="w-4 h-4" />

                <span className="hidden sm:inline">
                  New Project
                </span>

              </Link>

              {/* {notification-bell} */}

              <button
                type="button"
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
              >

                <FiBell className="w-5 h-5" />

                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>

              </button>

              {/* {profile-section} */}

              <div
                className="relative"
                ref={profileRef}
              >

                <button
                  type="button"
                  onClick={() =>
                    setIsProfileOpen(!isProfileOpen)
                  }
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 transition-all duration-200 border-2 border-transparent hover:border-blue-200"
                >

                  {/* {user-avatar} */}

                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-blue-600" />
                  </div>

                  {/* {user-name} */}

                  <span className="text-sm text-gray-700 hidden sm:inline font-medium">
                    {user?.name || "User"}
                  </span>

                </button>

                {/* {profile-dropdown} */}

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-fadeIn">

                    {/* {profile-info} */}

                    <div className="px-4 py-3 border-b border-gray-100">

                      <p className="text-sm font-medium text-gray-800">
                        {user?.name || "User"}
                      </p>

                      <p className="text-xs text-gray-500">
                        {user?.email || ""}
                      </p>

                    </div>

                    {/* {my-profile} */}

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >

                      <FiUser className="w-4 h-4 text-gray-400" />

                      My Profile

                    </Link>

                    {/* {settings} */}

                    <Link
                      to="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >

                      <FiSettings className="w-4 h-4 text-gray-400" />

                      Settings

                    </Link>

                    <hr className="my-1" />

                    {/* {logout-button} */}

                    <button
                      type="button"
                      onClick={openLogoutModal}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full text-left"
                    >

                      <FiLogOut className="w-4 h-4" />

                      Logout

                    </button>

                  </div>
                )}

              </div>

              {/* {mobile-menu-toggle} */}

              <button
                type="button"
                onClick={() =>
                  setIsMobileMenuOpen(!isMobileMenuOpen)
                }
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >

                {isMobileMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}

              </button>

            </div>

          </div>

          {/* {mobile-menu} */}

          {isMobileMenuOpen && (
            <div
              className="md:hidden py-3 border-t border-gray-100"
              ref={mobileMenuRef}
            >

              {/* {mobile-new-project} */}

              <Link
                to="/new"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
              >

                <FiPlus className="w-4 h-4" />

                New Project

              </Link>

              {/* {mobile-profile} */}

              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition mt-1"
              >

                <FiUser className="w-4 h-4" />

                Profile

              </Link>

              {/* {mobile-settings} */}

              <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
              >

                <FiSettings className="w-4 h-4" />

                Settings

              </Link>

              {/* {mobile-logout} */}

              <button
                type="button"
                onClick={openLogoutModal}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition w-full text-left"
              >

                <FiLogOut className="w-4 h-4" />

                Logout

              </button>

            </div>
          )}

        </div>

        {/* {animation} */}

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.15s ease-out forwards;
          }
        `}</style>

      </nav>

      {/* {logout-modal} */}

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">

          {/* {modal-overlay} */}

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeLogoutModal}
          />

          {/* {modal-content} */}

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 animate-fadeIn">

            {/* {logout-icon} */}

            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-4">

              <FiLogOut className="w-6 h-6 text-red-600" />

            </div>

            {/* {modal-heading} */}

            <h2 className="text-xl font-bold text-gray-800">
              Confirm Logout
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to logout from your account?
            </p>

            {/* {logout-all-devices} */}

            <label
              className={`flex items-start gap-3 mt-5 p-4 rounded-xl border cursor-pointer transition ${
                logoutAllDevices
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >

              <input
                type="checkbox"
                checked={logoutAllDevices}
                onChange={(e) =>
                  setLogoutAllDevices(e.target.checked)
                }
                disabled={isLoggingOut}
                className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
              />

              <div>

                <p className="text-sm font-semibold text-gray-800">
                  Logout from all devices
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  This will logout your account from all devices where
                  you are currently signed in.
                </p>

              </div>

            </label>

            {/* {modal-actions} */}

            <div className="flex justify-end gap-3 mt-6">

              {/* {cancel-button} */}

              <button
                type="button"
                disabled={isLoggingOut}
                onClick={closeLogoutModal}
                className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>

              {/* {logout-confirm-button} */}

              <button
                type="button"
                disabled={isLoggingOut}
                onClick={handleLogout}
                className={`px-5 py-2.5 rounded-lg text-white text-sm font-medium transition disabled:opacity-50 flex items-center gap-2 ${
                  logoutAllDevices
                    ? "bg-red-700 hover:bg-red-800"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >

                {isLoggingOut ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />

                    Logging out...
                  </>
                ) : (
                  <>
                    <FiLogOut className="w-4 h-4" />

                    Logout
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}