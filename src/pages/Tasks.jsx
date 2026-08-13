// pages/Tasks.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Users,
  Tag,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Paperclip,
  Star,
  ChevronDown,
  ChevronUp,
  Download,
  List,
  Grid,
  UserCheck,
  UserX,
  ArrowUpRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function Tasks() {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [updatingTask, setUpdatingTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // 🔒 Permission checks
  const userRole = user?.role || 'viewer';
  const userId = user?.id || user?._id;
  const isAdmin = hasRole(['admin']);
  const isClient = hasRole(['client']);
  const isTeamMember = hasRole(['team_member']);
  const isViewer = userRole === 'viewer';
  
  const canCreateTask = isAdmin || isClient;
  const canEditTask = isAdmin || isClient;
  const canDeleteTask = isAdmin;

  // 🔒 Check if user is assigned to this task
  const isAssignedToTask = (task) => {
    if (!task || !task.assignedTo || task.assignedTo.length === 0) return false;
    if (!userId) return false;
    
    const currentUserId = userId.toString();
    return task.assignedTo.some(id => id.toString() === currentUserId);
  };

  // 🔒 Check if user can complete task
  const canCompleteTask = (task) => {
    if (!task) return false;
    if (isAdmin) return false;
    if (isTeamMember) {
      return isAssignedToTask(task);
    }
    return false;
  };

  // ===== GET USER NAME =====
  const getUserName = useCallback((userId) => {
    if (!userId) return 'Unassigned';
    if (usersLoading) return 'Loading...';
    if (users.length === 0) return 'Unknown User';
    
    const userIdStr = userId.toString();
    const foundUser = users.find(u => {
      const uId = u._id?.toString() || u.id?.toString();
      return uId === userIdStr;
    });
    
    return foundUser ? foundUser.name : 'Unknown User';
  }, [users, usersLoading]);

  // ===== GET USER ROLE =====
  const getUserRole = useCallback((userId) => {
    if (!userId) return '';
    if (usersLoading) return 'Loading...';
    if (users.length === 0) return '';
    
    const userIdStr = userId.toString();
    const foundUser = users.find(u => {
      const uId = u._id?.toString() || u.id?.toString();
      return uId === userIdStr;
    });
    return foundUser ? foundUser.role : '';
  }, [users, usersLoading]);

  // ===== FETCH USERS (Only Admin) =====
  const fetchUsers = useCallback(async () => {
    // ✅ Only admin can fetch all users
    if (!isAdmin) {
      console.log('⏭️ Skipping user fetch - Not admin');
      setUsers([]);
      setUsersLoading(false);
      return;
    }
    
    try {
      setUsersLoading(true);
      const token = localStorage.getItem('token');
      console.log('🔑 Fetching users with token:', token?.substring(0, 20) + '...');
      
      const response = await fetch('http://localhost:1000/api/user/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Users API response status:', response.status);
      
      if (response.status === 403) {
        console.log('⛔ Forbidden - User is not admin');
        setUsers([]);
        return;
      }
      
      if (!response.ok) {
        console.error('Failed to fetch users:', response.status);
        setUsers([]);
        return;
      }
      
      const data = await response.json();
      console.log('👥 Users data received:', data);
      
      let userList = [];
      if (data.users) {
        userList = data.users;
      } else if (Array.isArray(data)) {
        userList = data;
      } else if (data.data && Array.isArray(data.data)) {
        userList = data.data;
      }
      
      console.log('👥 Users list:', userList);
      console.log('👥 Users count:', userList.length);
      
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }, [isAdmin]);

  // ===== FETCH TASKS =====
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:1000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }

      const data = await response.json();
      console.log('📋 Tasks fetched:', data);
      
      const tasksList = data.tasks || data || [];
      setTasks(tasksList);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ===== INITIAL DATA FETCH =====
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTasks(), fetchUsers()]);
    };
    loadData();
  }, [fetchTasks, fetchUsers]);

  // ===== UPDATE TASK STATUS =====
  const handleUpdateTaskStatus = async (taskId, currentStatus) => {
    const task = tasks.find(t => t._id === taskId || t.id === taskId);
    
    if (!canCompleteTask(task)) {
      if (isAdmin) {
        alert('Admin cannot mark tasks as complete. Only assigned team members can complete tasks.');
      } else {
        alert('You are not assigned to this task. Only assigned team members can mark it as complete.');
      }
      return;
    }

    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    try {
      setUpdatingTask(taskId);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:1000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task');
      }

      await fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      alert(error.message);
    } finally {
      setUpdatingTask(null);
    }
  };

  // ===== DELETE TASK =====
  const handleDeleteTask = async (taskId, taskTitle) => {
    if (!canDeleteTask) {
      alert('Only admin can delete tasks');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:1000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete task');
      }

      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert(error.message);
    }
  };

  // ===== VIEW TASK DETAILS =====
  const handleViewTaskDetails = (task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  // ===== FILTER TASKS =====
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.project?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // ===== STATUS STYLES =====
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-700',
      in_progress: 'bg-blue-100 text-blue-700',
      review: 'bg-amber-100 text-amber-700',
      completed: 'bg-emerald-100 text-emerald-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      in_progress: 'In Progress',
      review: 'Review',
      completed: 'Completed',
      rejected: 'Rejected',
    };
    return labels[status] || status;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'text-rose-600 bg-rose-50',
      high: 'text-amber-600 bg-amber-50',
      medium: 'text-blue-600 bg-blue-50',
      low: 'text-gray-600 bg-gray-50',
    };
    return colors[priority] || 'text-gray-600 bg-gray-50';
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="w-4 h-4" />;
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  // ===== STATS =====
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const urgentTasks = tasks.filter(t => t.priority === 'urgent').length;
  const assignedToMeTasks = tasks.filter(t => isAssignedToTask(t)).length;

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading tasks...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-500 mt-1">
              {isAdmin ? 'Manage all tasks' : isClient ? 'Your tasks' : 'Assigned tasks'}
              {isTeamMember && assignedToMeTasks > 0 && (
                <span className="ml-2 text-sm text-purple-600 font-medium">
                  ({assignedToMeTasks} assigned to you)
                </span>
              )}
            </p>
          </div>
          {canCreateTask && (
            <button 
              onClick={() => navigate('/new-task')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="text-red-700 font-medium">Error loading tasks</p>
              <p className="text-red-600 text-sm">{error}</p>
              <button 
                onClick={fetchTasks}
                className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalTasks}</p>
                <p className="text-sm text-gray-500">Total Tasks</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedTasks}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressTasks}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'review').length}</p>
                <p className="text-sm text-gray-500">Review</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-xl">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{urgentTasks}</p>
                <p className="text-sm text-gray-500">Urgent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white w-48 sm:w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{filteredTasks.length} tasks</span>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-sm transition flex items-center gap-1 ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm transition flex items-center gap-1 ${
                  viewMode === 'list' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tasks Display */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No tasks found</p>
            <p className="text-gray-400 mt-1">
              {searchTerm ? 'Try adjusting your search' : 'No tasks available'}
            </p>
            {canCreateTask && (
              <button 
                onClick={() => navigate('/new-task')}
                className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create Task
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => {
              const assignedToMe = isAssignedToTask(task);
              const isCompleted = task.status === 'completed';
              const userCanComplete = canCompleteTask(task);
              
              let assigneeName = 'Unassigned';
              if (task.assignedTo && task.assignedTo.length > 0) {
                assigneeName = getUserName(task.assignedTo[0]);
              }
              
              return (
                <div
                  key={task._id || task.id}
                  className={`bg-white rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group ${
                    isCompleted ? 'border-emerald-200' : 'border-gray-100'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {getStatusLabel(task.status)}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                            {getPriorityIcon(task.priority)}
                            {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1) || 'Medium'}
                          </span>
                          {assignedToMe && !isCompleted && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 animate-pulse">
                              <Users className="w-3 h-3 inline mr-1" />
                              Assigned to you
                            </span>
                          )}
                          {isCompleted && assignedToMe && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                              Completed by you
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                          {task.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{task.description}</p>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {assigneeName}
                        {assignedToMe && <span className="text-purple-600 font-medium"> (You)</span>}
                      </span>
                    </div>

                    {/* 🔒 Complete Button */}
                    {userCanComplete && !isCompleted && (
                      <button
                        onClick={() => handleUpdateTaskStatus(task._id || task.id, task.status)}
                        disabled={updatingTask === (task._id || task.id)}
                        className="w-full mt-2 px-3 py-1.5 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {updatingTask === (task._id || task.id) ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Mark Complete
                          </>
                        )}
                      </button>
                    )}

                    {userCanComplete && isCompleted && (
                      <button
                        onClick={() => handleUpdateTaskStatus(task._id || task.id, task.status)}
                        disabled={updatingTask === (task._id || task.id)}
                        className="w-full mt-2 px-3 py-1.5 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {updatingTask === (task._id || task.id) ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Clock className="w-4 h-4" />
                            Reopen Task
                          </>
                        )}
                      </button>
                    )}

                    {isAdmin && !isCompleted && (
                      <div className="w-full mt-2 px-3 py-1.5 text-sm bg-yellow-50 text-yellow-600 rounded-lg text-center border border-yellow-200">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        Admin cannot complete tasks
                      </div>
                    )}

                    {!assignedToMe && !isAdmin && !isCompleted && (
                      <div className="w-full mt-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-500 rounded-lg text-center">
                        <Users className="w-4 h-4 inline mr-1" />
                        Not assigned to you
                      </div>
                    )}
                  </div>

                  <div className="px-5 py-3 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleViewTaskDetails(task)}
                        className="p-1.5 hover:bg-gray-200 rounded-lg transition text-gray-500 hover:text-indigo-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {canEditTask && (
                        <button className="p-1.5 hover:bg-gray-200 rounded-lg transition text-gray-500 hover:text-indigo-600">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      
                      {canDeleteTask && (
                        <button 
                          onClick={() => handleDeleteTask(task._id || task.id, task.title)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <button 
                      onClick={() => handleViewTaskDetails(task)}
                      className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Assignee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTasks.map((task) => {
                    const assignedToMe = isAssignedToTask(task);
                    const userCanComplete = canCompleteTask(task);
                    
                    let assigneeName = 'Unassigned';
                    if (task.assignedTo && task.assignedTo.length > 0) {
                      assigneeName = getUserName(task.assignedTo[0]);
                    }
                    
                    return (
                      <tr key={task._id || task.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{task.title}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{task.description}</p>
                            {assignedToMe && (
                              <span className="text-xs text-purple-600 font-medium">✓ Assigned to you</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{task.project || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                          {assigneeName}
                          {assignedToMe && (
                            <span className="ml-1 text-xs text-purple-600 font-medium">(You)</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {getStatusLabel(task.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getPriorityColor(task.priority)}`}>
                            {getPriorityIcon(task.priority)}
                            {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1) || 'Medium'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleViewTaskDetails(task)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-indigo-600"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            {canEditTask && (
                              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-indigo-600">
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            
                            {canDeleteTask && (
                              <button 
                                onClick={() => handleDeleteTask(task._id || task.id, task.title)}
                                className="p-1.5 hover:bg-red-50 rounded-lg transition text-gray-500 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}

                            {userCanComplete && (
                              <button
                                onClick={() => handleUpdateTaskStatus(task._id || task.id, task.status)}
                                disabled={updatingTask === (task._id || task.id)}
                                className={`p-1.5 rounded-lg transition ${
                                  task.status === 'completed' 
                                    ? 'hover:bg-gray-200 text-gray-500' 
                                    : 'hover:bg-emerald-50 text-emerald-600'
                                }`}
                              >
                                {updatingTask === (task._id || task.id) ? (
                                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  task.status === 'completed' ? 
                                    <Clock className="w-4 h-4" /> : 
                                    <CheckCircle className="w-4 h-4" />
                                )}
                              </button>
                            )}

                            {isAdmin && !userCanComplete && (
                              <span className="text-xs text-yellow-600 px-1" title="Admin cannot complete tasks">
                                🔒 Admin
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* ===== TASK DETAILS MODAL ===== */}
      {showTaskDetails && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <CheckSquare className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
                  <p className="text-sm text-gray-500">#{selectedTask._id?.slice(-6) || 'N/A'}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowTaskDetails(false);
                  setSelectedTask(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedTask.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                    {getStatusLabel(selectedTask.status)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getPriorityColor(selectedTask.priority)}`}>
                    {getPriorityIcon(selectedTask.priority)}
                    {selectedTask.priority?.charAt(0).toUpperCase() + selectedTask.priority?.slice(1) || 'Medium'} Priority
                  </span>
                  {selectedTask.assignedTo && selectedTask.assignedTo.length > 0 && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isAssignedToTask(selectedTask) ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Users className="w-3 h-3 inline mr-1" />
                      Assigned to: {getUserName(selectedTask.assignedTo[0])}
                      {isAssignedToTask(selectedTask) && (
                        <span className="ml-1 text-purple-600 font-medium">(You)</span>
                      )}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedTask.description || 'No description provided'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Project</p>
                  <p className="text-sm font-medium text-gray-800">{selectedTask.project || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Due Date</p>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Created By</p>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedTask.createdBy ? getUserName(selectedTask.createdBy) : 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Created At</p>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedTask.createdAt ? new Date(selectedTask.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowTaskDetails(false);
                    setSelectedTask(null);
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                >
                  Close
                </button>
                
                {canCompleteTask(selectedTask) && selectedTask.status !== 'completed' && (
                  <button
                    onClick={() => {
                      handleUpdateTaskStatus(selectedTask._id || selectedTask.id, selectedTask.status);
                      setShowTaskDetails(false);
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </button>
                )}
                
                {canCompleteTask(selectedTask) && selectedTask.status === 'completed' && (
                  <button
                    onClick={() => {
                      handleUpdateTaskStatus(selectedTask._id || selectedTask.id, selectedTask.status);
                      setShowTaskDetails(false);
                    }}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Reopen Task
                  </button>
                )}

                {isAdmin && (
                  <div className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm border border-yellow-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Admin cannot complete tasks
                  </div>
                )}

                {canEditTask && (
                  <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Task
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
      `}</style>
    </div>
  );
}