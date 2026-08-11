// pages/ViewProject.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrashAlt,
  FaCalendarAlt,
  FaTasks,
  FaProjectDiagram,
  FaSpinner,
  FaTimesCircle,
  FaUser,
  FaClock,
  FaTag,
  FaRocket,
  FaShareAlt,
  FaBookmark,
  FaUsers,
  FaComments,
  FaPaperPlane,
  FaGithub,
  FaLink,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaPalette,
  FaChartLine,
  FaFlask,
  FaEye
} from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";
import { 
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import CommentSection from '../components/CommentSection';
import { useAuth } from '../context/AuthContext';

export default function ViewProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 🔒 Permission checks
  const userRole = user?.role || 'viewer';
  const userId = user?.id || user?._id;
  const isAdmin = userRole === 'admin';
  const isClient = userRole === 'client';
  const isTeamMember = userRole === 'team_member';
  const isViewer = userRole === 'viewer';

  // 🔒 Can edit? - Admin OR Client (only their own projects)
  const canEdit = (projectData) => {
    if (isAdmin) return true;
    if (isClient) {
      const clientId = projectData?.client?._id || projectData?.client;
      return clientId === userId;
    }
    return false;
  };

  // 🔒 Can delete? - Only Admin
  const canDelete = () => {
    return isAdmin;
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:1000/api/projects/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Project not found");
        }
        
        const data = await response.json();
        setProject(data.project || data);
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

  // Get progress label and color
  const getProgressInfo = (progress) => {
    const info = [
      { value: 0, label: "Not Started", color: "text-gray-500", bg: "bg-gray-100" },
      { value: 25, label: "Just Started", color: "text-blue-500", bg: "bg-blue-100" },
      { value: 50, label: "In Progress", color: "text-yellow-500", bg: "bg-yellow-100" },
      { value: 75, label: "Almost Done", color: "text-orange-500", bg: "bg-orange-100" },
      { value: 100, label: "Completed", color: "text-green-500", bg: "bg-green-100" },
    ];
    return info.find(p => p.value === progress) || info[0];
  };

  // Get priority info
  const getPriorityInfo = (priority) => {
    const info = {
      urgent: { label: "Urgent", color: "text-red-700 bg-red-100 border-red-200" },
      high: { label: "High", color: "text-orange-700 bg-orange-100 border-orange-200" },
      medium: { label: "Medium", color: "text-yellow-700 bg-yellow-100 border-yellow-200" },
      low: { label: "Low", color: "text-green-700 bg-green-100 border-green-200" },
    };
    return info[priority] || info.medium;
  };

  // Get category icon
  const getCategoryInfo = (category) => {
    const categories = {
      development: { icon: FaGithub, label: "Development", color: "text-blue-600 bg-blue-50" },
      design: { icon: FaPalette, label: "Design", color: "text-purple-600 bg-purple-50" },
      marketing: { icon: FaChartLine, label: "Marketing", color: "text-green-600 bg-green-50" },
      research: { icon: FaFlask, label: "Research", color: "text-orange-600 bg-orange-50" },
      other: { icon: FaTag, label: "Other", color: "text-gray-600 bg-gray-50" },
    };
    return categories[category] || categories.other;
  };

  // Chart data
  const chartData = [
    { name: 'Completed', value: project?.progress || 0 },
    { name: 'Remaining', value: 100 - (project?.progress || 0) },
  ];

  const COLORS = ['#22c55e', '#e5e7eb'];

  const progressInfo = getProgressInfo(project?.progress);
  const priorityInfo = getPriorityInfo(project?.priority);
  const categoryInfo = getCategoryInfo(project?.category);
  const CategoryIcon = categoryInfo.icon;

  // 🔒 Check if user can edit this project
  const userCanEdit = project ? canEdit(project) : false;
  const userCanDelete = canDelete();

  const handleDelete = async () => {
    if (!userCanDelete) {
      alert("You don't have permission to delete this project");
      return;
    }
    
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:1000/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Failed to delete");
      navigate("/");
    } catch (error) {
      setError(error.message);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative">
            <FaSpinner className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-indigo-100 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-500 font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="relative">
            <FaTimesCircle className="w-20 h-20 text-red-500 mx-auto mb-4 animate-bounce" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full animate-ping"></div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Project Not Found</h2>
          <p className="text-gray-500 mb-6">{error || "The project you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-all duration-300 group"
        >
          <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* View-Only Badge */}
          {isViewer && (
            <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium flex items-center gap-2">
              <FaEye className="w-4 h-4" />
              View-Only Mode
            </span>
          )}
          
          {isTeamMember && !userCanEdit && (
            <span className="px-3 py-2 bg-blue-100 text-blue-600 rounded-xl text-sm font-medium flex items-center gap-2">
              <FaUsers className="w-4 h-4" />
              Team Member - Read Only
            </span>
          )}

          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
          >
            <FaBookmark className={`w-5 h-5 ${isBookmarked ? 'fill-indigo-600 text-indigo-600' : ''}`} />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200">
            <FaShareAlt className="w-5 h-5" />
          </button>

          {/* 🔒 Edit Button - Only Admin and Client (their own projects) */}
          {userCanEdit && (
            <Link
              to={`/projects/${id}/edit`}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <FaEdit className="w-4 h-4" />
              Edit Project
            </Link>
          )}

          {/* 🔒 Delete Button - Only Admin */}
          {userCanDelete && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <FaTrashAlt className="w-4 h-4" />
              Delete
            </button>
          )}

          {/* Viewer/Team Member cannot Edit or Delete */}
          {(isViewer || isTeamMember) && !userCanEdit && !userCanDelete && (
            <span className="px-4 py-2 bg-gray-200 text-gray-500 rounded-xl text-sm font-medium flex items-center gap-2">
              <FaEye className="w-4 h-4" />
              View Only
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Project Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Header Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="relative">
              {/* Gradient Header */}
              <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-start gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg">
                    <FaProjectDiagram className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${progressInfo.color} ${progressInfo.bg}`}>
                        {progressInfo.label}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium border ${priorityInfo.color}`}>
                        {priorityInfo.label} Priority
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${categoryInfo.color}`}>
                        <CategoryIcon className="inline w-3 h-3 mr-1" />
                        {categoryInfo.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        ID: #{project._id?.slice(-6) || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
                    {project.description}
                  </p>
                </div>

                {/* Progress Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Project Progress</span>
                    <span className="font-bold text-indigo-600">{project.progress}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                      style={{ width: `${project.progress}%` }}
                    >
                      <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Project Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaCalendarAlt className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Start Date</p>
                      <p className="text-sm font-medium text-gray-700">
                        {project.startingDate ? new Date(project.startingDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'Not set'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FaClock className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Deadline</p>
                      <p className="text-sm font-medium text-gray-700">
                        {project.DeadLine ? new Date(project.DeadLine).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'Not set'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FaUsers className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Team Members</p>
                      <p className="text-sm font-medium text-gray-700">8 members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FaTasks className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Tasks</p>
                      <p className="text-sm font-medium text-gray-700">24 tasks</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <CommentSection projectId={id} />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400">Progress</p>
              <p className="text-xl font-bold text-indigo-600">{project.progress}%</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400">Priority</p>
              <p className="text-xl font-bold text-gray-700">{priorityInfo.label}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400">Category</p>
              <p className="text-xl font-bold text-gray-700">{categoryInfo.label}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400">Status</p>
              <p className="text-xl font-bold text-gray-700">{progressInfo.label}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar Info */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-bold text-green-600">{project.progress === 100 ? '✓' : `${project.progress}%`}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="font-bold text-yellow-600">{project.progress > 0 && project.progress < 100 ? '⚡' : '—'}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                <span className="text-sm text-gray-600">Overdue</span>
                <span className="font-bold text-red-600">{project.DeadLine && new Date(project.DeadLine) < new Date() ? '⚠️' : '✓'}</span>
              </div>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Progress Overview</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Completed: {chartData[0].value}%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                Remaining: {chartData[1].value}%
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-indigo-100">
            <div className="flex items-start gap-3">
              <HiOutlineLightBulb className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-indigo-700">Quick Actions</h4>
                <ul className="mt-2 space-y-1 text-sm text-indigo-600">
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="w-3 h-3" />
                    Update project status
                  </li>
                  <li className="flex items-center gap-2">
                    <FaUsers className="w-3 h-3" />
                    Invite team members
                  </li>
                  <li className="flex items-center gap-2">
                    <FaPaperPlane className="w-3 h-3" />
                    Share project link
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slideUp">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FaTrashAlt className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Project</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-700">"{project.title}"</span>? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrashAlt className="w-4 h-4" />
                      Delete Project
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}