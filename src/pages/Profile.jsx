// pages/Profile.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiShield,
  FiEdit,
  FiArrowLeft,
  FiCheckCircle,
} from "react-icons/fi";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      // Try different common localStorage keys
      const storedUser =
        localStorage.getItem("user") ||
        localStorage.getItem("authUser") ||
        localStorage.getItem("currentUser");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  }, []);

  // Fallback
  const userName = user?.name || "User";
  const userEmail = user?.email || "No email available";
  const userId = user?.id || user?._id || "N/A";

  return (
    <div className="min-h-screen bg-gray-50 py-6">

      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/"
            className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 transition"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              My Profile
            </h1>

            <p className="text-sm text-gray-500">
              Manage your account information
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

          {/* Profile Info */}
          <div className="px-6 pb-6">

            {/* Avatar */}
            <div className="-mt-12 mb-5 flex items-end justify-between">

              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <FiUser className="w-10 h-10 text-white" />
                </div>
              </div>

              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-blue-600 hover:bg-blue-700 text-white text-sm
                font-medium transition"
              >
                <FiEdit className="w-4 h-4" />
                Edit Profile
              </button>

            </div>

            {/* Name */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {userName}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Gemnixx Account
              </p>
            </div>

            {/* Account Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Name */}
              <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition">
                <div className="flex items-center gap-3">

                  <div className="p-2.5 rounded-lg bg-blue-50">
                    <FiUser className="w-5 h-5 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Full Name
                    </p>

                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {userName}
                    </p>
                  </div>

                </div>
              </div>

              {/* Email */}
              <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition">
                <div className="flex items-center gap-3">

                  <div className="p-2.5 rounded-lg bg-purple-50">
                    <FiMail className="w-5 h-5 text-purple-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Email Address
                    </p>

                    <p className="text-sm font-semibold text-gray-800 mt-1 break-all">
                      {userEmail}
                    </p>
                  </div>

                </div>
              </div>

              {/* Account Status */}
              <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition">
                <div className="flex items-center gap-3">

                  <div className="p-2.5 rounded-lg bg-green-50">
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Account Status
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold text-green-600">
                        Verified
                      </span>

                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    </div>
                  </div>

                </div>
              </div>

              {/* User ID */}
              <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition">
                <div className="flex items-center gap-3">

                  <div className="p-2.5 rounded-lg bg-amber-50">
                    <FiShield className="w-5 h-5 text-amber-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      User ID
                    </p>

                    <p className="text-sm font-semibold text-gray-800 mt-1 truncate">
                      {userId}
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* Account Security */}
            <div className="mt-6 p-5 rounded-xl bg-gray-50 border border-gray-200">

              <div className="flex items-start gap-3">

                <div className="p-2 rounded-lg bg-green-100">
                  <FiShield className="w-5 h-5 text-green-600" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Account Security
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Your account is protected with email verification
                    and secure authentication.
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}