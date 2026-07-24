// src/components/ErrorBoundary.jsx
import React from "react";
import ErrorPage from "../pages/ErrorPage";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("💥 Runtime Error caught by Boundary:", error, errorInfo);
    // Yahan aap error logging service (Sentry, LogRocket) bhi laga sakte hain
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          statusCode={500}
          message={this.state.error?.message || "Runtime Error"}
          customMessage="Oops! Something broke in the UI. Please try reloading."
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;