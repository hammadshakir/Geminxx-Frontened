// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import ErrorPage from './pages/ErrorPage';
import App from './App';
import Home from './pages/home';
import AddPage from './pages/AddPage';
import ViewProject from './pages/viewProject';
import EditProject from './pages/editProject';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'new', element: <AddPage /> },
      // Fix: Use :id instead of :_id or keep as :_id based on your usage
      { path: 'projects/:id', element: <ViewProject /> },
      { path: 'projects/:id/edit', element: <EditProject /> },
      // Also add a catch-all for projects without ID
      { path: 'projects', element: <Home /> },
    ],
  },
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