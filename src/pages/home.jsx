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
  ChevronDown
} from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import StatsCard from '../components/StatsCard';
import SearchBar from '../components/SearchBar';
import StatusBadge from '../components/StatusBadge';
import DashboardChart from '../components/DashboardChart';
import Navbar from '../components/Navbar';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, filterStatus]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:1000/api/projects');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      if (filterStatus === 'completed') {
        filtered = filtered.filter(p => p.progress === 100);
      } else if (filterStatus === 'ontrack') {
        filtered = filtered.filter(p => p.progress > 70 && p.progress < 100);
      } else if (filterStatus === 'inprogress') {
        filtered = filtered.filter(p => p.progress >= 30 && p.progress <= 70);
      } else if (filterStatus === 'starting') {
        filtered = filtered.filter(p => p.progress > 0 && p.progress < 30);
      } else if (filterStatus === 'notstarted') {
        filtered = filtered.filter(p => p.progress === 0);
      }
    }

    setFilteredProjects(filtered);
  };

  // Calculate stats
  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.progress === 100).length,
    inProgress: projects.filter(p => p.progress > 0 && p.progress < 100).length,
    overdue: projects.filter(p => {
      const deadline = new Date(p.DeadLine);
      return deadline < new Date() && p.progress < 100;
    }).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading projects...</p>
        </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage and track all your projects</p>
          </div>
          <Link to="/new">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2 shadow-sm">
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatsCard
            title="Total Projects"
            value={stats.total}
            icon={<LayoutGrid className="w-6 h-6" />}
            color="blue"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircle className="w-6 h-6" />}
            color="green"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={<Clock className="w-6 h-6" />}
            color="yellow"
          />
          <StatsCard
            title="Overdue"
            value={stats.overdue}
            icon={<AlertCircle className="w-6 h-6" />}
            color="red"
          />
        </div>

        {/* Chart */}
        {projects.length > 0 && (
          <div className="mb-8">
            <DashboardChart projects={projects} />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Filter:
            </span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="ontrack">On Track</option>
              <option value="inprogress">In Progress</option>
              <option value="starting">Starting</option>
              <option value="notstarted">Not Started</option>
            </select>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-sm transition ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-sm transition ${
                  viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Projects Display */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No projects found</p>
            <p className="text-gray-400 mt-1">
              {searchTerm ? 'Try adjusting your search' : 'Click "New Project" to get started'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs hidden md:table-cell">{project.description}</td>
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
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link to={`/projects/${project._id}`}>
                          <button className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition">
                            View
                          </button>
                        </Link>
                        <Link to={`/projects/${project._id}/edit`}>
                          <button className="px-3 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded transition">
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
    </div>
  );
}