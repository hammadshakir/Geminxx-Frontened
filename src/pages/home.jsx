// pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutGrid,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Filter,
  TrendingUp,
  Calendar,
  FolderOpen,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
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
} from 'recharts';
import ProjectCard from '../components/ProjectCard';
import StatsCard from '../components/StatsCard';
import SearchBar from '../components/SearchBar';
import StatusBadge from '../components/StatusBadge';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


export default function Home() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');

  // ---- Fetch ----
  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, filterStatus]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:1000/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus !== 'all') {
      if (filterStatus === 'completed') filtered = filtered.filter(p => p.progress === 100);
      else if (filterStatus === 'ontrack') filtered = filtered.filter(p => p.progress > 70 && p.progress < 100);
      else if (filterStatus === 'inprogress') filtered = filtered.filter(p => p.progress >= 30 && p.progress <= 70);
      else if (filterStatus === 'starting') filtered = filtered.filter(p => p.progress > 0 && p.progress < 30);
      else if (filterStatus === 'notstarted') filtered = filtered.filter(p => p.progress === 0);
    }
    setFilteredProjects(filtered);
  };

  // ---- Stats ----
  const total = projects.length;
  const completed = projects.filter(p => p.progress === 100).length;
  const inProgress = projects.filter(p => p.progress > 0 && p.progress < 100).length;
  const overdue = projects.filter(p => {
    const deadline = new Date(p.DeadLine);
    return deadline < new Date() && p.progress < 100;
  }).length;

  // Trends (dummy for demo – you can calculate week-over-week)
  const statsData = [
    { title: 'Total Projects', value: total, icon: LayoutGrid, color: 'indigo', trend: '+12%' },
    { title: 'Completed', value: completed, icon: CheckCircle, color: 'emerald', trend: '+8%' },
    { title: 'In Progress', value: inProgress, icon: Clock, color: 'amber', trend: '-2%' },
    { title: 'Overdue', value: overdue, icon: AlertCircle, color: 'rose', trend: '+5%' },
  ];

  // ---- Chart Data ----
  const chartData = [
    { name: 'Not Started', value: projects.filter(p => p.progress === 0).length },
    { name: 'Started', value: projects.filter(p => p.progress > 0 && p.progress < 30).length },
    { name: 'In Progress', value: projects.filter(p => p.progress >= 30 && p.progress <= 70).length },
    { name: 'On Track', value: projects.filter(p => p.progress > 70 && p.progress < 100).length },
    { name: 'Completed', value: completed },
  ];
  const chartColors = ['#94a3b8', '#f59e0b', '#3b82f6', '#8b5cf6', '#22c55e'];

  // ---- Upcoming Deadlines (sorted) ----
  const upcomingDeadlines = projects
    .filter(p => p.progress < 100)
    .sort((a, b) => new Date(a.DeadLine) - new Date(b.DeadLine))
    .slice(0, 5);

  // ---- Recent Activity (dummy – can be replaced with real logs) ----
  const recentActivities = projects.slice(0, 3).map(p => ({
    project: p.title,
    action: 'updated',
    time: '2 hours ago',
    color: 'blue',
  }));

  // ---- Loading ----
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading Gemnixx...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ----- Premium Hero Section ----- */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-500 rounded-3xl p-8 md:p-10 mb-8 shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNMzYgMzR2LTRoNHY0aC00em0wIDB2LTRoLTR2NGg0eiIvPjwvZz48L2c+PC9zdmc+')]"></div>
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="text-white">
              <div className="flex items-center gap-2 text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full w-fit mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Welcome back, Admin</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Let's build something amazing
              </h1>
              <p className="text-indigo-100 mt-1 max-w-md">
                You have {total} projects across your workspace. 
                {completed === total ? ' All completed! 🎉' : ` ${completed} completed so far.`}
              </p>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Link to="/new">
                <button className="px-6 py-3 bg-white text-indigo-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition flex items-center gap-2 hover:scale-105">
                  <Plus className="w-5 h-5" />
                  New Project
                </button>
              </Link>
              <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Analytics
              </button>
            </div>
          </div>
          {/* Quick stats mini */}
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/20">
            <div>
              <p className="text-indigo-200 text-xs uppercase tracking-wider">Total</p>
              <p className="text-white text-2xl font-bold">{total}</p>
            </div>
            <div>
              <p className="text-indigo-200 text-xs uppercase tracking-wider">Completed</p>
              <p className="text-white text-2xl font-bold">{completed}</p>
            </div>
            <div>
              <p className="text-indigo-200 text-xs uppercase tracking-wider">In Progress</p>
              <p className="text-white text-2xl font-bold">{inProgress}</p>
            </div>
            <div>
              <p className="text-indigo-200 text-xs uppercase tracking-wider">Overdue</p>
              <p className="text-white text-2xl font-bold">{overdue}</p>
            </div>
          </div>
        </div>

        {/* ----- Stats Cards with Trends ----- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {statsData.map((stat, idx) => (
            <StatsCard
              key={idx}
              title={stat.title}
              value={stat.value}
              icon={<stat.icon className="w-6 h-6" />}
              color={stat.color}
              trend={stat.trend}
              animated
            />
          ))}
        </div>

        {/* ----- Two-column layout: Chart + Upcoming Deadlines ----- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart takes 2/3 */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Project Status Distribution
              </h3>
              <span className="text-xs text-gray-400">Last 30 days</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Deadlines (1/3) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                ⏰ Upcoming Deadlines
              </h3>
              <span className="text-xs text-gray-400">{upcomingDeadlines.length} due soon</span>
            </div>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No upcoming deadlines 🎉</p>
            ) : (
              <ul className="space-y-3">
                {upcomingDeadlines.map((p) => {
                  const days = Math.ceil((new Date(p.DeadLine) - new Date()) / (1000 * 60 * 60 * 24));
                  const urgency = days <= 2 ? 'text-rose-600 bg-rose-50' : days <= 7 ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50';
                  return (
                    <li key={p._id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate max-w-[120px]">{p.title}</p>
                        <p className="text-xs text-gray-400">{new Date(p.DeadLine).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${urgency}`}>
                        {days <= 0 ? 'Overdue' : `${days}d`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* ----- Recent Activity Feed ----- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Recent Activity
            </h3>
            <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">View all</button>
          </div>
          {recentActivities.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((act, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full bg-${act.color}-500`}></div>
                  <span className="text-gray-600">
                    <span className="font-medium text-gray-800">{act.project}</span> {act.action}
                  </span>
                  <span className="text-gray-400 text-xs ml-auto">{act.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ----- Error ----- */}
        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 rounded-lg mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* ----- Filters & View ----- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Status:
            </span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="ontrack">On Track</option>
              <option value="inprogress">In Progress</option>
              <option value="starting">Starting</option>
              <option value="notstarted">Not Started</option>
            </select>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-sm transition ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-sm transition ${
                  viewMode === 'table' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* ----- Projects Display ----- */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No projects found</p>
            <p className="text-gray-400 mt-1">
              {searchTerm
                ? 'Try adjusting your search or filters'
                : 'Create your first project and start managing your workflow'}
            </p>
            <Link to="/new">
              <button className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm">
                + Create Project
              </button>
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{project.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs hidden md:table-cell">
                      {project.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(project.DeadLine).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge progress={project.progress} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link to={`/projects/${project._id}`}>
                          <button className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded transition">
                            View
                          </button>
                        </Link>
                        <Link to={`/projects/${project._id}/edit`}>
                          <button className="px-3 py-1 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded transition">
                            Edit
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
       <Footer />
    </div>
  );
}