// src/pages/AddPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaSpinner, 
  FaCalendarAlt, 
  FaTasks, 
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaRocket,
  FaProjectDiagram,
  FaLaptopCode,
  FaPaintBrush,
  FaChartLine,
  FaFlask,
  FaTag,
  FaArrowLeft
} from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

export default function AddPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingDate: "",
    DeadLine: "",
    progress: "0",
    priority: "medium",
    category: "development",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  // Progress options with labels and colors
  const progressOptions = [
    { value: "0", label: "Not Started", color: "text-gray-500" },
    { value: "25", label: "Just Started", color: "text-blue-500" },
    { value: "50", label: "In Progress", color: "text-yellow-500" },
    { value: "75", label: "Almost Done", color: "text-orange-500" },
    { value: "100", label: "Completed", color: "text-green-500" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-700" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-700" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-700" },
  ];

  const categoryOptions = [
    { value: "development", label: "Development", icon: FaLaptopCode, color: "text-blue-600" },
    { value: "design", label: "Design", icon: FaPaintBrush, color: "text-purple-600" },
    { value: "marketing", label: "Marketing", icon: FaChartLine, color: "text-green-600" },
    { value: "research", label: "Research", icon: FaFlask, color: "text-orange-600" },
    { value: "other", label: "Other", icon: FaTag, color: "text-gray-600" },
  ];

  // Validate a single field
  const validateField = (name, value) => {
    let error = "";
    const today = new Date().toISOString().split("T")[0];
    
    switch (name) {
      case "title":
        if (!value.trim()) error = "Title is required.";
        else if (value.trim().length < 3) error = "Title must be at least 3 characters.";
        else if (value.trim().length > 100) error = "Title must be less than 100 characters.";
        break;
      case "description":
        if (!value.trim()) error = "Description is required.";
        else if (value.trim().length < 10) error = "Description must be at least 10 characters.";
        else if (value.trim().length > 500) error = "Description must be less than 500 characters.";
        break;
      case "DeadLine":
        if (!value) error = "Deadline is required.";
        else if (value < today) error = "Deadline must be today or a future date.";
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

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    const fields = ["title", "description", "startingDate", "DeadLine"];
    fields.forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccess(false);

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouchedFields(allTouched);

    // Full validation
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
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
        throw new Error(result.message || result.error || "Failed to add project");
      }

      // Show success
      setSuccess(true);
      
      // Navigate after short delay
      setTimeout(() => {
        navigate("/", { 
          state: { 
            message: "Project added successfully! 🎉" 
          } 
        });
      }, 1500);

    } catch (error) {
      setSubmitError(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-8 md:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-300 mb-6 group"
          >
            <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>

          {/* Header with Animation */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
              <FaRocket className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Create New Project
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Launch your next big idea in minutes
            </p>
          </div>

          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-slideDown">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <h4 className="font-semibold text-green-700">Project Created!</h4>
                  <p className="text-sm text-green-600">Redirecting to dashboard...</p>
                </div>
              </div>
            </div>
          )}

          {/* Global submit error */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-slideDown">
              <div className="flex items-center gap-3">
                <FaTimesCircle className="w-6 h-6 text-red-500" />
                <div>
                  <h4 className="font-semibold text-red-700">Error</h4>
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter a descriptive project title"
                      data-error={!!errors.title}
                      className={`w-full px-4 py-3 pl-11 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.title && touchedFields.title 
                          ? "border-red-500 bg-red-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    />
                    <FaProjectDiagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    {errors.title && touchedFields.title && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <FaExclamationCircle className="w-5 h-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.title && touchedFields.title && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-slideDown">
                      <FaInfoCircle className="w-4 h-4" />
                      {errors.title}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    {formData.title.length}/100 characters
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Describe your project in detail..."
                      data-error={!!errors.description}
                      className={`w-full px-4 py-3 pl-11 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-y ${
                        errors.description && touchedFields.description
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    />
                    <FaTasks className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    {errors.description && touchedFields.description && (
                      <div className="absolute right-3 top-3">
                        <FaExclamationCircle className="w-5 h-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.description && touchedFields.description && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-slideDown">
                      <FaInfoCircle className="w-4 h-4" />
                      {errors.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Start Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="startingDate"
                        value={formData.startingDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 pl-11 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.startingDate && touchedFields.startingDate
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      />
                      <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                    {errors.startingDate && touchedFields.startingDate && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-slideDown">
                        <FaInfoCircle className="w-4 h-4" />
                        {errors.startingDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Deadline <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="DeadLine"
                        value={formData.DeadLine}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 pl-11 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.DeadLine && touchedFields.DeadLine
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      />
                      <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                    {errors.DeadLine && touchedFields.DeadLine && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-slideDown">
                        <FaInfoCircle className="w-4 h-4" />
                        {errors.DeadLine}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Progress
                    </label>
                    <select
                      name="progress"
                      value={formData.progress}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    >
                      {progressOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {/* Progress bar preview */}
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${formData.progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-400 text-right">
                      {formData.progress}% complete
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    >
                      {priorityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2">
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        priorityOptions.find(p => p.value === formData.priority)?.color || ""
                      }`}>
                        {priorityOptions.find(p => p.value === formData.priority)?.label || "Medium"} Priority
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {categoryOptions.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                          className={`py-3 px-2 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1.5 ${
                            formData.category === category.value
                              ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md transform scale-105"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className={`w-6 h-6 ${
                            formData.category === category.value 
                              ? "text-blue-600" 
                              : category.color
                          }`} />
                          <span className="text-xs font-medium">{category.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:shadow-lg hover:scale-102 active:scale-98"
                    }`}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="w-5 h-5 animate-spin" />
                        <span>Creating Project...</span>
                      </>
                    ) : (
                      <>
                        <FaRocket className="w-5 h-5" />
                        <span>Launch Project</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 hover:shadow-md transition-all duration-300 hover:scale-102 active:scale-98"
                  >
                    Cancel
                  </button>
                </div>

                {/* Form tips */}
                <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="flex items-start gap-2">
                    <HiOutlineLightBulb className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="text-sm font-medium text-blue-700">Pro Tips:</h5>
                      <ul className="mt-1 text-xs text-blue-600 space-y-0.5 list-disc list-inside">
                        <li>Use a clear, descriptive title for better project management</li>
                        <li>Set realistic deadlines to keep your team on track</li>
                        <li>Update progress regularly to monitor project health</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}