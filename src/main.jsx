// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import ErrorPage from './pages/ErrorPage';
import App from './App'; // Yeh parent layout hai
import Home from './pages/home';
import AddPage from './pages/addPage';
import ViewProject from './pages/viewProject';
import EditProject from './pages/editProject';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // 👈 App.jsx yahan render ho raha hai
    errorElement: <ErrorPage />, // 👈 Koi bhi error aaya toh ye dikhega
    children: [
      // 👇 Ye saare components App.jsx ke <Outlet /> ke andar render honge
      { index: true, element: <Home /> }, // Matches "/"
      { path: 'new', element: <AddPage /> }, // Matches "/new"
      { path: 'projects/:_id', element: <ViewProject /> }, // Matches "/projects/123"
      { path: 'projects/:_id/edit', element: <EditProject /> }, // Matches "/projects/123/edit"
    ],
  },
  // 404 handler
  {
    path: '*',
    element: <ErrorPage statusCode={404} message="Page Not Found" />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);