// pages/Tasks.jsx
import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [expandedTasks, setExpandedTasks] = useState(new Set());

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      const sampleTasks = [
        {
          id: 1,
          title: 'Complete project documentation',
          description: 'Write comprehensive documentation for the E-commerce platform including API endpoints, deployment guide, and user manual.',
          status: 'in_progress',
          priority: 'high',
          project: 'E-commerce Platform',
          assignee: 'John Doe',
          assigneeAvatar: 'JD',
          dueDate: '2024-12-20',
          createdDate: '2024-12-10',
          labels: ['Documentation', 'API', 'Frontend'],
          comments: 5,
          attachments: 3,
          subtasks: [
            { title: 'API Documentation', completed: true },
            { title: 'Deployment Guide', completed: false },
            { title: 'User Manual', completed: false },
          ],
        },
        {
          id: 2,
          title: 'Design system implementation',
          description: 'Implement the new design system across all React components including typography, colors, and component library.',
          status: 'completed',
          priority: 'medium',
          project: 'Mobile App Design',
          assignee: 'Jane Smith',
          assigneeAvatar: 'JS',
          dueDate: '2024-12-15',
          createdDate: '2024-12-01',
          labels: ['Design', 'React', 'Components'],
          comments: 8,
          attachments: 2,
          subtasks: [
            { title: 'Typography tokens', completed: true },
            { title: 'Color palette', completed: true },
            { title: 'Component library', completed: true },
          ],
        },
        {
          id: 3,
          title: 'API integration testing',
          description: 'Perform comprehensive testing of all API endpoints including unit tests, integration tests, and end-to-end testing.',
          status: 'todo',
          priority: 'urgent',
          project: 'API Integration',
          assignee: 'Mike Johnson',
          assigneeAvatar: 'MJ',
          dueDate: '2024-12-22',
          createdDate: '2024-12-12',
          labels: ['Testing', 'API', 'Backend'],
          comments: 2,
          attachments: 1,
          subtasks: [
            { title: 'Unit tests', completed: false },
            { title: 'Integration tests', completed: false },
            { title: 'E2E tests', completed: false },
          ],
        },
        {
          id: 4,
          title: 'Marketing campaign assets',
          description: 'Create all visual assets for the marketing campaign including social media graphics, email templates, and banner ads.',
          status: 'in_progress',
          priority: 'medium',
          project: 'Marketing Campaign',
          assignee: 'Sarah Wilson',
          assigneeAvatar: 'SW',
          dueDate: '2024-12-18',
          createdDate: '2024-12-08',
          labels: ['Design', 'Marketing', 'Social Media'],
          comments: 6,
          attachments: 5,
          subtasks: [
            { title: 'Social media graphics', completed: true },
            { title: 'Email templates', completed: false },
            { title: 'Banner ads', completed: false },
          ],
        },
        {
          id: 5,
          title: 'Database migration script',
          description: 'Write and test database migration script for moving data from legacy system to new PostgreSQL database.',
          status: 'review',
          priority: 'high',
          project: 'Database Migration',
          assignee: 'Robert Brown',
          assigneeAvatar: 'RB',
          dueDate: '2024-12-19',
          createdDate: '2024-12-05',
          labels: ['Database', 'Migration', 'Backend'],
          comments: 4,
          attachments: 2,
          subtasks: [
            { title: 'Migration script', completed: true },
            { title: 'Data validation', completed: true },
            { title: 'Performance testing', completed: false },
          ],
        },
        {
          id: 6,
          title: 'Client onboarding process',
          description: 'Develop and document the client onboarding process including initial setup, training materials, and support resources.',
          status: 'todo',
          priority: 'low',
          project: 'Various Projects',
          assignee: 'Emily Davis',
          assigneeAvatar: 'ED',
          dueDate: '2024-12-30',
          createdDate: '2024-12-14',
          labels: ['Documentation', 'Process', 'Client'],
          comments: 1,
          attachments: 0,
          subtasks: [
            { title: 'Setup guide', completed: false },
            { title: 'Training materials', completed: false },
            { title: 'Support resources', completed: false },
          ],
        },
        {
          id: 7,
          title: 'Security audit',
          description: 'Conduct a comprehensive security audit of all systems and applications including vulnerability assessment and penetration testing.',
          status: 'review',
          priority: 'urgent',
          project: 'E-commerce Platform',
          assignee: 'John Doe',
          assigneeAvatar: 'JD',
          dueDate: '2024-12-16',
          createdDate: '2024-12-09',
          labels: ['Security', 'Audit', 'Compliance'],
          comments: 9,
          attachments: 4,
          subtasks: [
            { title: 'Vulnerability scan', completed: true },
            { title: 'Penetration testing', completed: true },
            { title: 'Security report', completed: false },
          ],
        },
        {
          id: 8,
          title: 'User feedback analysis',
          description: 'Analyze user feedback from surveys and interviews to identify improvement opportunities and feature requests.',
          status: 'completed',
          priority: 'medium',
          project: 'Mobile App Design',
          assignee: 'Jane Smith',
          assigneeAvatar: 'JS',
          dueDate: '2024-12-13',
          createdDate: '2024-12-02',
          labels: ['Analysis', 'Research', 'UX'],
          comments: 3,
          attachments: 2,
          subtasks: [
            { title: 'Survey analysis', completed: true },
            { title: 'Interview summaries', completed: true },
            { title: 'Recommendations', completed: true },
          ],
        },
      ];
      setTasks(sampleTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    const newSet = new Set(expandedTasks);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedTasks(newSet);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status) => {
    const colors = {
      todo: 'bg-gray-100 text-gray-700',
      in_progress: 'bg-blue-100 text-blue-700',
      review: 'bg-amber-100 text-amber-700',
      completed: 'bg-emerald-100 text-emerald-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status) => {
    const labels = {
      todo: 'To Do',
      in_progress: 'In Progress',
      review: 'Review',
      completed: 'Completed',
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

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const urgentTasks = tasks.filter(t => t.priority === 'urgent').length;

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
            <p className="text-gray-500 mt-1">Manage and track all your tasks</p>
          </div>
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition flex items-center gap-2 shadow-sm">
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </div>

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
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
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
              {searchTerm ? 'Try adjusting your search' : 'Create your first task'}
            </p>
            <button className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusLabel(task.status)}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                          {getPriorityIcon(task.priority)}
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                        {task.title}
                      </h3>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{task.description}</p>

                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {task.assignee}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {task.labels.slice(0, 3).map((label, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {label}
                      </span>
                    ))}
                    {task.labels.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{task.labels.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {task.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Paperclip className="w-3.5 h-3.5" />
                      {task.attachments}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                    </span>
                  </div>
                </div>

                <div className="px-5 py-3 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-gray-200 rounded-lg transition text-gray-500 hover:text-indigo-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-200 rounded-lg transition text-gray-500 hover:text-indigo-600">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
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
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{task.title}</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">{task.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{task.project}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">{task.assignee}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusLabel(task.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getPriorityColor(task.priority)}`}>
                          {getPriorityIcon(task.priority)}
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-indigo-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-indigo-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-rose-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}