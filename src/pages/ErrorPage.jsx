// src/pages/ErrorPage.jsx
import { useNavigate, useRouteError } from "react-router-dom";
import { useEffect } from "react";

const ErrorPage = ({ statusCode, message, customMessage }) => {
  const navigate = useNavigate();
  const routeError = useRouteError(); // Agar React Router ne pakda hai
  const error = routeError || {};

  // Agar props se data aya hai to use karein, warna routeError se
  const finalStatusCode = statusCode || error?.status || 500;
  const finalMessage = message || error?.statusText || error?.message || "Something went wrong!";
  const finalCustomMsg = customMessage || "We're sorry, but an unexpected error occurred.";

  // Backend se aya validation error array ho toh usko handle karein
  const isValidationError = Array.isArray(finalMessage);

  // Page load hote hi console me log kar dein (optional)
  useEffect(() => {
    console.error("❌ Error Page Triggered:", { finalStatusCode, finalMessage });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="h-12 w-12 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Status Code */}
        <h1 className="text-6xl font-extrabold text-gray-800 dark:text-white tracking-tight">
          {finalStatusCode}
        </h1>

        {/* Message */}
        <h2 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          {isValidationError ? "Validation Failed" : finalMessage}
        </h2>

        {/* Validation Errors List (agar array me aye) */}
        {isValidationError && (
          <ul className="mt-4 text-left bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            {finalMessage.map((err, idx) => (
              <li key={idx} className="text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                {err}
              </li>
            ))}
          </ul>
        )}

        {/* Custom Message */}
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          {finalCustomMsg}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-5 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            ← Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Take Me Home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-5 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Try Again
          </button>
        </div>

        {/* Technical details (sirf development environment me dikhao) */}
        {import.meta.env.DEV && error?.stack && (
          <details className="mt-8 text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <summary className="text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer">
              🔍 Technical Details (Dev Only)
            </summary>
            <pre className="mt-2 text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;