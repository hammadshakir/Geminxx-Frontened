// pages/editProject.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  FaSpinner, 
  FaCalendarAlt, 
  FaTasks, 
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaSave,
  FaProjectDiagram,
  FaArrowLeft,
  FaEdit,
  FaTrashAlt,
  FaRocket,
  // FaFloppyDisk,
  FaPercentage,
  FaClock,
  FaClipboardList,
  FaPalette,
  FaChartLine,
  FaFlask,
  FaTag,
  FaGithub,
  FaUsers,
  FaPaperPlane
} from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";

export default function EditProject() {
  const { id } = useParams(); // ✅ Using 'id' from route params
  const navigate = useNavigate();
  const [project, setProject] = useState({
    title: "",
    description: "",
    startingDate: "",
    DeadLine: "",
    progress: 0,
    priority: "medium",
    category: "development"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Progress options with labels and colors
  const progressOptions = [
    { value: 0, label: "Not Started", color: "text-gray-500" },
    { value: 25, label: "Just Started", color: "text-blue-500" },
    { value: 50, label: "In Progress", color: "text-yellow-500" },
    { value: 75, label: "Almost Done", color: "text-orange-500" },
    { value: 100, label: "Completed", color: "text-green-500" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-700" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-700" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-700" },
  ];

  const categoryOptions = [
    { value: "development", label: "Development", icon: FaGithub, color: "text-blue-600" },
    { value: "design", label: "Design", icon: FaPalette, color: "text-purple-600" },
    { value: "marketing", label: "Marketing", icon: FaChartLine, color: "text-green-600" },
    { value: "research", label: "Research", icon: FaFlask, color: "text-orange-600" },
    { value: "other", label: "Other", icon: FaTag, color: "text-gray-600" },
  ];

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:1000/api/projects/${id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }
        
        const data = await response.json();
        
        setProject({
          title: data.title || "",
          description: data.description || "",
          startingDate: data.startingDate ? new Date(data.startingDate).toISOString().split('T')[0] : "",
          DeadLine: data.DeadLine ? new Date(data.DeadLine).toISOString().split('T')[0] : "",
          progress: data.progress || 0,
          priority: data.priority || "medium",
          category: data.category || "development"
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({
      ...prev,
      [name]: name === 'progress' ? parseInt(value) : value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`http://localhost:1000/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      const data = await response.json();
      setSuccess(true);
      
      setTimeout(() => {
        navigate(`/projects/${id}`);
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:1000/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      navigate("/");
    } catch (error) {
      setError(error.message);
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };

  // Get current progress label
  const getProgressLabel = (progress) => {
    const option = progressOptions.find(p => p.value === progress);
    return option ? option.label : "Not Started";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error && !project.title) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <FaTimesCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Project</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition inline-flex items-center gap-2"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-8 md:py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/projects/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-all duration-300 mb-6 group"
        >
          <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Project</span>
        </button>

        {/* Header with Animation */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-2xl mb-4">
            <FaEdit className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Edit Project
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Update your project details
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-slideDown">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <h4 className="font-semibold text-green-700">Project Updated!</h4>
                <p className="text-sm text-green-600">Redirecting to project...</p>
              </div>
            </div>
          </div>
        )}

        {/* Global submit error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-slideDown">
            <div className="flex items-center gap-3">
              <FaTimesCircle className="w-6 h-6 text-red-500" />
              <div>
                <h4 className="font-semibold text-red-700">Error</h4>
                <p className="text-sm text-red-600">{error}</p>
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
                    value={project.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter project title"
                    className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  />
                  <FaProjectDiagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
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
                    value={project.description}
                    onChange={handleChange}
                    required
                    placeholder="Describe your project in detail..."
                    className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-y hover:border-gray-300"
                  />
                  <FaTasks className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                </div>
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
                      value={project.startingDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    />
                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="DeadLine"
                      value={project.DeadLine}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    />
                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Progress with slider */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Progress
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <input
                      type="range"
                      name="progress"
                      min="0"
                      max="100"
                      step="25"
                      value={project.progress}
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      style={{
                        background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${project.progress}%, #e5e7eb ${project.progress}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-purple-600 min-w-[80px] text-right">
                    {project.progress}%
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  {progressOptions.map((option) => (
                    <span key={option.value} className={`text-xs ${option.color}`}>
                      {option.value}%
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Status: <span className="font-medium">{getProgressLabel(project.progress)}</span>
                </p>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Priority
                </label>
                <select
                  name="priority"
                  value={project.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2">
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    priorityOptions.find(p => p.value === project.priority)?.color || ""
                  }`}>
                    {priorityOptions.find(p => p.value === project.priority)?.label || "Medium"} Priority
                  </span>
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
                        onClick={() => setProject(prev => ({ ...prev, category: category.value }))}
                        className={`py-3 px-2 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1.5 ${
                          project.category === category.value
                            ? "border-purple-500 bg-purple-50 text-purple-700 shadow-md transform scale-105"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${
                          project.category === category.value 
                            ? "text-purple-600" 
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
                  disabled={saving}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    saving
                      ? "bg-purple-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 hover:shadow-lg hover:scale-102 active:scale-98"
                  }`}
                >
                  {saving ? (
                    <>
                      <FaSpinner className="w-5 h-5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <FaSave className="w-5 h-5" />
                      <span>Update Project</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/projects/${id}`)}
                  className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 hover:shadow-md transition-all duration-300 hover:scale-102 active:scale-98"
                >
                  Cancel
                </button>
              </div>

              {/* Form tips */}
              <div className="mt-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <div className="flex items-start gap-2">
                  <HiOutlineLightBulb className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="text-sm font-medium text-purple-700">Pro Tips:</h5>
                    <ul className="mt-1 text-xs text-purple-600 space-y-0.5 list-disc list-inside">
                      <li>Keep your project title clear and concise</li>
                      <li>Update progress regularly to track milestones</li>
                      <li>Adjust priority based on project urgency</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Delete Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden border border-red-100">
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 rounded-xl">
                <FaTrashAlt className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">Delete Project</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Once you delete this project, it cannot be recovered. Please be certain.
                </p>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`mt-4 px-6 py-2.5 rounded-xl font-medium text-white transition-all duration-300 flex items-center gap-2 ${
                    deleteConfirm && !deleting
                      ? "bg-red-600 hover:bg-red-700 animate-pulse"
                      : deleting
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {deleting ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : deleteConfirm ? (
                    <>
                      <FaExclamationCircle className="w-4 h-4" />
                      <span>Confirm Delete</span>
                    </>
                  ) : (
                    <>
                      <FaTrashAlt className="w-4 h-4" />
                      <span>Delete Project</span>
                    </>
                  )}
                </button>
                {deleteConfirm && !deleting && (
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="ml-3 px-6 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}