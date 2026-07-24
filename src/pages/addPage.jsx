// src/pages/addPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AddPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingDate: "",
    DeadLine: "",
    progress: "0",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  // Validate a single field
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "title":
        if (!value.trim()) error = "Title is required.";
        else if (value.trim().length < 3) error = "Title must be at least 3 characters.";
        break;
      case "description":
        if (!value.trim()) error = "Description is required.";
        else if (value.trim().length < 10) error = "Description must be at least 10 characters.";
        break;
      case "DeadLine":
        if (!value) error = "Deadline is required.";
        else {
          const today = new Date().toISOString().split("T")[0];
          if (value < today) error = "Deadline must be today or a future date.";
        }
        break;
      case "startingDate":
        if (value && formData.DeadLine && value > formData.DeadLine) {
          error = "Start date cannot be after deadline.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  // Validate entire form (returns true if valid)
  const validateForm = () => {
    const newErrors = {};
    // Validate all fields
    const fields = ["title", "description", "startingDate", "DeadLine"];
    fields.forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Re-validate when any field changes
  useEffect(() => {
    // Validate on change but only if field has been touched? We'll just update errors for all fields.
    // But we want to show errors only after user interacts? Better to use onBlur or submit.
    // We'll use onBlur for each field to set errors.
    // For simplicity, we'll call validateForm on submit only, but show errors per field if they exist.
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Full validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:1000/api/new/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        // If backend sends validation errors (e.g., duplicate), show them
        throw new Error(result.message || result.error || "Failed to add project");
      }

      navigate("/");
    } catch (error) {
      setSubmitError(error.message);
      setLoading(false);
    }
  };

  // Navbar component (inline)
  const Navbar = () => (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-800 transition">
          MySaaS
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
          <Link to="/new" className="text-gray-700 hover:text-blue-600 transition font-medium">Add Project</Link>
          {/* You can add more links later */}
        </div>
      </div>
    </nav>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">➕ Add New Project</h1>
            <p className="text-gray-500 mt-1">Fill in the details to create a project.</p>
          </div>

          {/* Global submit error */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter project title"
                className={`mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Describe your project"
                className={`mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startingDate"
                  value={formData.startingDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.startingDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.startingDate && <p className="mt-1 text-sm text-red-600">{errors.startingDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deadline <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="DeadLine"
                  value={formData.DeadLine}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.DeadLine ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.DeadLine && <p className="mt-1 text-sm text-red-600">{errors.DeadLine}</p>}
              </div>
            </div>

            {/* Progress */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Progress</label>
              <select
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="0">Not Started</option>
                <option value="25">Just Started</option>
                <option value="50">Working</option>
                <option value="75">Almost Done</option>
                <option value="100">Completed</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  "Add Project"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}