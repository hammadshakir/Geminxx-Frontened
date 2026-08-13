// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";

import ErrorPage from "./pages/ErrorPage";
import App from "./App";
import AdminUsers from './pages/AdminUsers';
import AdminRoles from './pages/AdminRoles';
import AdminSettings from './pages/AdminSettings';

// Pages
import Home from "./pages/Home";
import AddPage from "./pages/AddPage";
import ViewProject from "./pages/ViewProject";
import EditProject from "./pages/EditProject";
import Profile from './pages/Profile';
import NewTask from './pages/NewTask';

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";

// New Pages
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Timeline from "./pages/Timeline";
import TeamMembers from "./pages/TeamMembers";
import Clients from "./pages/Clients";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Chat from './pages/Chat';


// Components
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const router = createBrowserRouter([
  // Auth Routes
  {
    path: "/login",
    element: <Login />,
  },
  {
  path: "admin/users",
  element: <AdminUsers />,
},
{
  path: "admin/roles",
  element: <AdminRoles />,
},
{
  path: "admin/settings",
  element: <AdminSettings />,
},
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOTP />,
  },

  // Protected Routes
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "projects", element: <Home /> },
      { path: "projects/:id", element: <ViewProject /> },
      { path: "projects/:id/edit", element: <EditProject /> },
      { path: "new", element: <AddPage /> },
      { path: "profile", element: <Profile /> },
      
      // New Pages
      { path: "analytics", element: <Analytics /> },
      { path: "reports", element: <Reports /> },
      { path: "timeline", element: <Timeline /> },
      { path: "team", element: <TeamMembers /> },
      { path: "clients", element: <Clients /> },
      { path: "tasks", element: <Tasks /> },
      { path: "settings", element: <Settings /> },
      { path: "notifications", element: <Notifications /> },
      {
  path: "chat",
  element: <Chat/>,
},
{
  path: "new-task",
  element: <NewTask />,
},
    ],
  },

  // 404
  {
    path: "*",
    element: <ErrorPage statusCode={404} message="Page Not Found" />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);