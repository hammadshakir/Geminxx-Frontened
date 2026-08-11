// pages/Reports.jsx
import { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Eye,
  Share2,
  Printer,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Users,
  FolderOpen,
  TrendingUp,
  Search,
  Plus,
  Star,
  Bookmark,
  ExternalLink,
  Trash2,
  Edit,
  Copy,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  // Sample reports data
  useEffect(() => {
    // Simulate fetching reports
    const fetchReports = async () => {
      setLoading(true);
      try {
        // In production, fetch from API
        const sampleReports = [
          {
            id: 1,
            title: 'Q4 Project Performance Report',
            type: 'Performance',
            date: '2024-12-15',
            status: 'completed',
            project: 'E-commerce Platform',
            author: 'John Doe',
            summary: 'Comprehensive analysis of project performance metrics for Q4 2024.',
            views: 45,
            downloads: 12,
            starred: true,
          },
          {
            id: 2,
            title: 'Team Productivity Analysis',
            type: 'Team',
            date: '2024-12-10',
            status: 'completed',
            project: 'Mobile App Development',
            author: 'Jane Smith',
            summary: 'Detailed breakdown of team productivity and task completion rates.',
            views: 32,
            downloads: 8,
            starred: false,
          },
          {
            id: 3,
            title: 'Budget vs Actual Report',
            type: 'Financial',
            date: '2024-12-05',
            status: 'pending',
            project: 'Marketing Campaign',
            author: 'Mike Johnson',
            summary: 'Financial analysis comparing budget allocation to actual spend.',
            views: 18,
            downloads: 5,
            starred: true,
          },
          {
            id: 4,
            title: 'Client Satisfaction Survey Results',
            type: 'Client',
            date: '2024-11-28',
            status: 'completed',
            project: 'Various Projects',
            author: 'Sarah Wilson',
            summary: 'Analysis of client satisfaction scores and feedback from Q3.',
            views: 29,
            downloads: 6,
            starred: false,
          },
          {
            id: 5,
            title: 'Risk Assessment Report',
            type: 'Risk',
            date: '2024-11-20',
            status: 'draft',
            project: 'API Integration',
            author: 'Robert Brown',
            summary: 'Identification and assessment of project risks and mitigation strategies.',
            views: 12,
            downloads: 3,
            starred: false,
          },
          {
            id: 6,
            title: 'Resource Allocation Report',
            type: 'Resource',
            date: '2024-11-15',
            status: 'completed',
            project: 'Database Migration',
            author: 'Emily Davis',
            summary: 'Analysis of resource utilization and allocation across projects.',
            views: 24,
            downloads: 7,
            starred: false,
          },
        ];
        setReports(sampleReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      Performance: 'bg-blue-100 text-blue-700',
      Team: 'bg-purple-100 text-purple-700',
      Financial: 'bg-emerald-100 text-emerald-700',
      Client: 'bg-pink-100 text-pink-700',
      Risk: 'bg-red-100 text-red-700',
      Resource: 'bg-indigo-100 text-indigo-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  // Quick stats
  const totalReports = reports.length;
  const completedReports = reports.filter(r => r.status === 'completed').length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const draftReports = reports.filter(r => r.status === 'draft').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading reports...</p>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-500 mt-1">Generate and manage project reports</p>
          </div>
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition flex items-center gap-2 shadow-sm">
            <Plus className="w-5 h-5" />
            Generate Report
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalReports}</p>
                <p className="text-sm text-gray-500">Total Reports</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedReports}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingReports}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-xl">
                <AlertCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{draftReports}</p>
                <p className="text-sm text-gray-500">Drafts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">All Types</option>
              <option value="performance">Performance</option>
              <option value="team">Team</option>
              <option value="financial">Financial</option>
              <option value="client">Client</option>
              <option value="risk">Risk</option>
              <option value="resource">Resource</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{filteredReports.length} reports found</span>
            <span className="w-px h-4 bg-gray-300"></span>
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Report Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)} flex items-center gap-1`}>
                        {getStatusIcon(report.status)}
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                        {report.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{report.summary}</p>
                  </div>
                  <button className="text-gray-400 hover:text-yellow-500 transition">
                    {report.starred ? (
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    ) : (
                      <Star className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Report Body */}
              <div className="px-5 py-3 bg-gray-50">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">Project</p>
                    <p className="font-medium text-gray-700 truncate">{report.project}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Author</p>
                    <p className="font-medium text-gray-700">{report.author}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium text-gray-700">{new Date(report.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Report Footer */}
              <div className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {report.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {report.downloads}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-indigo-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-indigo-600">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-indigo-600">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gray-700">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No reports found</p>
            <p className="text-gray-400 mt-1">
              {searchTerm
                ? 'Try adjusting your search or filters'
                : 'Generate your first report to get started'}
            </p>
            <button className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}