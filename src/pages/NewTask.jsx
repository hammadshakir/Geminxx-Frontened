// pages/NewTask.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaSpinner,
  FaTasks,
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaRocket,
  FaUsers,
  FaClock,
  FaFlag,
  FaPlus,
  FaMinus,
} from 'react-icons/fa';
import { HiOutlineLightBulb } from 'react-icons/hi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function NewTask() {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: [],
    priority: 'medium',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  // 🔒 Permission check - Only Admin & Client can create tasks
  const canCreateTask = hasRole(['admin', 'client']);

  // Redirect if no permission
  useEffect(() => {
    if (!canCreateTask) {
      navigate('/tasks', { 
        state: { error: 'You do not have permission to create tasks' }
      });
    }
  }, [canCreateTask, navigate]);

  // Fetch users and projects
  useEffect(() => {
    if (canCreateTask) {
      fetchUsers();
      fetchProjects();
    }
  }, [canCreateTask]);

  // ===== FETCH USERS =====
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:1000/api/user/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        // Filter only team members and admins (who can be assigned tasks)
        const assignableUsers = data.users.filter(u => 
          u.role === 'team_member' || u.role === 'admin'
        );
        setUsers(assignableUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // ===== FETCH PROJECTS =====
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:1000/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // ===== VALIDATION =====
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'title':
        if (!value.trim()) error = 'Title is required';
        else if (value.trim().length < 3) error = 'Title must be at least 3 characters';
        break;
      case 'description':
        if (!value.trim()) error = 'Description is required';
        else if (value.trim().length < 10) error = 'Description must be at least 10 characters';
        break;
      case 'dueDate':
        if (!value) error = 'Due date is required';
        else {
          const today = new Date().toISOString().split('T')[0];
          if (value < today) error = 'Due date cannot be in the past';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = ['title', 'description', 'dueDate'];
    fields.forEach(field => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== HANDLE CHANGE =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  // ===== HANDLE ASSIGNEE TOGGLE =====
  const toggleAssignee = (userId) => {
    setFormData(prev => {
      const assigned = prev.assignedTo.includes(userId);
      return {
        ...prev,
        assignedTo: assigned 
          ? prev.assignedTo.filter(id => id !== userId)
          : [...prev.assignedTo, userId]
      };
    });
  };

  // ===== SUBMIT =====
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

    if (!validateForm()) {
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:1000/api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create task');
      }

      setSuccess(true);
      
      setTimeout(() => {
        navigate('/tasks', { 
          state: { message: 'Task created successfully! 🎉' }
        });
      }, 1500);

    } catch (error) {
      setSubmitError(error.message);
      setLoading(false);
    }
  };

  // ===== PRIORITY OPTIONS =====
  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-700' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700' },
  ];

  // ===== ACCESS DENIED =====
  if (!canCreateTask) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center max-w-md px-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTimesCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-500 mb-4">
              You don't have permission to create tasks.
            </p>
            <button
              onClick={() => navigate('/tasks')}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              Go Back to Tasks
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-all duration-300 mb-6 group"
        >
          <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Tasks</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4">
            <FaTasks className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Create New Task
          </h1>
          <p className="text-gray-500 mt-2">
            Assign tasks to team members and track progress
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-slideDown">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <h4 className="font-semibold text-green-700">Task Created!</h4>
                <p className="text-sm text-green-600">Redirecting to tasks...</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Error */}
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Task Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaTasks className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter task title"
                  data-error={!!errors.title}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                    errors.title && touchedFields.title 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                {errors.title && touchedFields.title && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <FaExclamationTriangle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.title && touchedFields.title && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <FaInfoCircle className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaInfoCircle className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Describe the task in detail..."
                  data-error={!!errors.description}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-y ${
                    errors.description && touchedFields.description
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                {errors.description && touchedFields.description && (
                  <div className="absolute right-3 top-3">
                    <FaExclamationTriangle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.description && touchedFields.description && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <FaInfoCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Project & Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Project
                </label>
                <div className="relative">
                  <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white appearance-none"
                  >
                    <option value="">Select Project (Optional)</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    data-error={!!errors.dueDate}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.dueDate && touchedFields.dueDate
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  {errors.dueDate && touchedFields.dueDate && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <FaExclamationTriangle className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.dueDate && touchedFields.dueDate && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <FaInfoCircle className="w-4 h-4" />
                    {errors.dueDate}
                  </p>
                )}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Priority
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {priorityOptions.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                    className={`py-2.5 px-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                      formData.priority === priority.value
                        ? `border-indigo-500 bg-indigo-50 shadow-md transform scale-105 ${priority.color}`
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <FaFlag className={`w-4 h-4 ${
                      formData.priority === priority.value ? 'text-indigo-600' : 'text-gray-400'
                    }`} />
                    <span className="text-sm font-medium">{priority.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Assign To */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Assign To
              </label>
              {users.length === 0 ? (
                <p className="text-sm text-gray-400">No team members available</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {users.map((user) => (
                    <button
                      key={user._id}
                      type="button"
                      onClick={() => toggleAssignee(user._id)}
                      className={`py-2 px-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-2 ${
                        formData.assignedTo.includes(user._id)
                          ? 'border-indigo-500 bg-indigo-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        formData.assignedTo.includes(user._id)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm truncate">{user.name}</span>
                      {formData.assignedTo.includes(user._id) && (
                        <FaCheckCircle className="w-4 h-4 text-indigo-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-400">
                {formData.assignedTo.length} {formData.assignedTo.length === 1 ? 'person' : 'people'} assigned
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  loading
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="w-5 h-5 animate-spin" />
                    <span>Creating Task...</span>
                  </>
                ) : (
                  <>
                    <FaRocket className="w-5 h-5" />
                    <span>Create Task</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/tasks')}
                className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 hover:shadow-md transition-all duration-300"
              >
                Cancel
              </button>
            </div>

            {/* Tips */}
            <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="flex items-start gap-2">
                <HiOutlineLightBulb className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-sm font-medium text-blue-700">Pro Tips:</h5>
                  <ul className="mt-1 text-xs text-blue-600 space-y-0.5 list-disc list-inside">
                    <li>Use clear, descriptive titles for better understanding</li>
                    <li>Set realistic deadlines for team members</li>
                    <li>Assign tasks to the right team members</li>
                    <li>Use priority levels to indicate urgency</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}