// App.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { loading } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleSidebarToggle = (event) => {
      setIsCollapsed(event.detail?.isCollapsed || false);
    };
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className={`
        flex-1 transition-all duration-300 min-h-screen
        ${!isMobile && isCollapsed ? "ml-20" : !isMobile ? "ml-64" : "ml-0"}
        ${isMobile ? "pt-16" : ""}
      `}>
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;