// pages/Analytics.jsx
import { useState, useEffect } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  FolderOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Award,
  Target,
  Activity,
  Layers,
  DollarSign,
  Percent,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RePieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
  ComposedChart,
} from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:1000/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data);
      processAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.message);
      // Set default empty data to prevent crashes
      setAnalyticsData({
        total: 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        avgProgress: 0,
        completionRate: 0,
        onTrack: 0,
        projects: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (data) => {
    // Ensure data is an array
    const projectData = Array.isArray(data) ? data : [];
    
    const total = projectData.length;
    const completed = projectData.filter(p => p.progress === 100).length;
    const inProgress = projectData.filter(p => p.progress > 0 && p.progress < 100).length;
    const notStarted = projectData.filter(p => p.progress === 0).length;
    
    const avgProgress = total > 0 ? Math.round(projectData.reduce((acc, p) => acc + (p.progress || 0), 0) / total) : 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const onTrack = projectData.filter(p => p.progress > 70 && p.progress < 100).length;
    
    setAnalyticsData({
      total,
      completed,
      inProgress,
      notStarted,
      avgProgress,
      completionRate,
      onTrack,
      projects: projectData,
    });
  };

  // Safely prepare chart data with fallbacks
  const getStatusDistribution = () => {
    if (!analyticsData) {
      return [
        { name: 'Completed', value: 0 },
        { name: 'In Progress', value: 0 },
        { name: 'Not Started', value: 0 },
      ];
    }
    return [
      { name: 'Completed', value: analyticsData.completed || 0 },
      { name: 'In Progress', value: analyticsData.inProgress || 0 },
      { name: 'Not Started', value: analyticsData.notStarted || 0 },
    ];
  };

  const getProgressData = () => {
    if (!analyticsData || !analyticsData.projects || analyticsData.projects.length === 0) {
      return [
        { name: 'No Data', progress: 0, deadline: 'N/A' }
      ];
    }
    return analyticsData.projects.slice(0, 10).map(p => ({
      name: p.title?.length > 15 ? p.title.slice(0, 15) + '...' : p.title || 'Untitled',
      progress: p.progress || 0,
      deadline: p.DeadLine ? new Date(p.DeadLine).toLocaleDateString() : 'N/A',
    }));
  };

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  // If loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading analytics...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load analytics</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={fetchAnalyticsData}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If no data
  if (!analyticsData || analyticsData.total === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data</h2>
            <p className="text-gray-500 mb-4">Start creating projects to see analytics and insights here.</p>
            <a 
              href="/new"
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Create Your First Project
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">Track your project performance and team metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <FolderOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                +12%
              </span>
            </div>
            <p className="text-2xl font-bold mt-3">{analyticsData.total}</p>
            <p className="text-sm text-gray-500">Total Projects</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                +8%
              </span>
            </div>
            <p className="text-2xl font-bold mt-3">{analyticsData.completed}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                +5%
              </span>
            </div>
            <p className="text-2xl font-bold mt-3">{analyticsData.inProgress}</p>
            <p className="text-sm text-gray-500">In Progress</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-amber-50 rounded-xl">
                <Percent className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-3">{analyticsData.avgProgress}%</p>
            <p className="text-sm text-gray-500">Average Progress</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-purple-50 rounded-xl">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                +3%
              </span>
            </div>
            <p className="text-2xl font-bold mt-3">{analyticsData.completionRate}%</p>
            <p className="text-sm text-gray-500">Completion Rate</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Project Status Distribution
                </h3>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={getStatusDistribution()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {getStatusDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Project Progress Overview
                </h3>
              </div>
              <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option>All Projects</option>
                <option>Active</option>
                <option>Completed</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getProgressData()} layout="vertical" margin={{ top: 5, right: 10, left: 50, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={50} />
                  <Tooltip />
                  <Bar dataKey="progress" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                    {getProgressData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.progress >= 70 ? '#22c55e' : entry.progress >= 30 ? '#3b82f6' : '#f59e0b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Monthly Trend - Sample Data (since we don't have historical data) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Monthly Project Trend
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-indigo-600"></span> Projects
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-emerald-500"></span> Completed
                </span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { month: 'Jan', projects: 5, completed: 2 },
                  { month: 'Feb', projects: 8, completed: 4 },
                  { month: 'Mar', projects: 12, completed: 6 },
                  { month: 'Apr', projects: 15, completed: 8 },
                  { month: 'May', projects: analyticsData.total, completed: analyticsData.completed },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="projects" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="completed" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Team Performance - Sample Data */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Team Performance
                </h3>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={[
                  { member: 'Team A', efficiency: 85 },
                  { member: 'Team B', efficiency: 78 },
                  { member: 'Team C', efficiency: 92 },
                  { member: 'Team D', efficiency: 70 },
                  { member: 'Team E', efficiency: 88 },
                ]}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="member" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Efficiency" dataKey="efficiency" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Project Details
              </h3>
            </div>
            <a href="/projects" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
              View All Projects
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analyticsData.projects.slice(0, 5).map((project, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{project.title || 'Untitled'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              project.progress >= 70 ? 'bg-emerald-500' :
                              project.progress >= 30 ? 'bg-blue-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${project.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{project.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {project.DeadLine ? new Date(project.DeadLine).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        project.progress === 100 ? 'bg-emerald-100 text-emerald-700' :
                        project.progress > 70 ? 'bg-blue-100 text-blue-700' :
                        project.progress > 0 ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {project.progress === 100 ? 'Completed' :
                         project.progress > 70 ? 'On Track' :
                         project.progress > 0 ? 'In Progress' : 'Not Started'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}