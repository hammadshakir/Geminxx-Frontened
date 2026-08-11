// pages/Clients.jsx
import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Building2,
  Calendar,
  Star,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Award,
  PieChart,
  BarChart3,
  Download,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      const sampleClients = [
        {
          id: 1,
          name: 'TechCorp Solutions',
          email: 'contact@techcorp.com',
          phone: '+1 234 567 8900',
          industry: 'Technology',
          status: 'active',
          avatar: 'TC',
          projects: ['E-commerce Platform', 'Mobile App Design'],
          totalSpent: 125000,
          satisfaction: 92,
          joinDate: '2024-01-15',
          address: '123 Tech Street, Silicon Valley, CA 94025',
          description: 'Leading provider of enterprise software solutions.',
          contacts: [
            { name: 'Alice Johnson', role: 'CEO', email: 'alice@techcorp.com' },
            { name: 'Bob Williams', role: 'CTO', email: 'bob@techcorp.com' },
          ],
        },
        {
          id: 2,
          name: 'Creative Studios',
          email: 'info@creativestudios.com',
          phone: '+1 234 567 8901',
          industry: 'Media & Entertainment',
          status: 'active',
          avatar: 'CS',
          projects: ['Marketing Campaign'],
          totalSpent: 45000,
          satisfaction: 88,
          joinDate: '2024-03-10',
          address: '456 Creative Ave, Los Angeles, CA 90210',
          description: 'Creative agency specializing in digital content.',
          contacts: [
            { name: 'Sarah Miller', role: 'Creative Director', email: 'sarah@creativestudios.com' },
          ],
        },
        {
          id: 3,
          name: 'FinancePro LLC',
          email: 'support@financepro.com',
          phone: '+1 234 567 8902',
          industry: 'Finance',
          status: 'active',
          avatar: 'FP',
          projects: ['API Integration', 'Database Migration'],
          totalSpent: 89000,
          satisfaction: 95,
          joinDate: '2024-05-20',
          address: '789 Wall Street, New York, NY 10005',
          description: 'Financial advisory and investment management firm.',
          contacts: [
            { name: 'David Chen', role: 'Managing Partner', email: 'david@financepro.com' },
            { name: 'Emma Wilson', role: 'Operations Manager', email: 'emma@financepro.com' },
          ],
        },
        {
          id: 4,
          name: 'HealthTech Innovations',
          email: 'contact@healthtech.com',
          phone: '+1 234 567 8903',
          industry: 'Healthcare',
          status: 'inactive',
          avatar: 'HI',
          projects: [],
          totalSpent: 12000,
          satisfaction: 75,
          joinDate: '2024-06-01',
          address: '101 Health Blvd, Boston, MA 02115',
          description: 'Healthcare technology solutions provider.',
          contacts: [
            { name: 'Dr. Michael Roberts', role: 'Chief Medical Officer', email: 'michael@healthtech.com' },
          ],
        },
        {
          id: 5,
          name: 'RetailPlus Group',
          email: 'info@retailplus.com',
          phone: '+1 234 567 8904',
          industry: 'Retail',
          status: 'active',
          avatar: 'RG',
          projects: ['Marketing Campaign'],
          totalSpent: 67000,
          satisfaction: 85,
          joinDate: '2024-07-15',
          address: '202 Shopping Center, Chicago, IL 60601',
          description: 'Multi-brand retail chain with 50+ locations.',
          contacts: [
            { name: 'Lisa Anderson', role: 'VP Marketing', email: 'lisa@retailplus.com' },
          ],
        },
        {
          id: 6,
          name: 'EduTech Solutions',
          email: 'hello@edutech.com',
          phone: '+1 234 567 8905',
          industry: 'Education',
          status: 'active',
          avatar: 'ES',
          projects: ['E-commerce Platform', 'Mobile App Design', 'API Integration'],
          totalSpent: 158000,
          satisfaction: 90,
          joinDate: '2024-08-01',
          address: '303 Learning Lane, Austin, TX 78701',
          description: 'Educational technology platform for online learning.',
          contacts: [
            { name: 'Dr. James Lee', role: 'CEO', email: 'james@edutech.com' },
            { name: 'Jessica Park', role: 'COO', email: 'jessica@edutech.com' },
          ],
        },
        {
          id: 7,
          name: 'GreenEnergy Corp',
          email: 'info@greenenergy.com',
          phone: '+1 234 567 8906',
          industry: 'Energy',
          status: 'inactive',
          avatar: 'GE',
          projects: [],
          totalSpent: 8000,
          satisfaction: 70,
          joinDate: '2024-09-10',
          address: '404 Solar Drive, Denver, CO 80201',
          description: 'Renewable energy solutions provider.',
          contacts: [
            { name: 'Mark Green', role: 'Director', email: 'mark@greenenergy.com' },
          ],
        },
      ];
      setClients(sampleClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    const matchesIndustry = filterIndustry === 'all' || client.industry === filterIndustry;
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const getStatusColor = (status) => {
    return status === 'active'
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-gray-100 text-gray-700';
  };

  const getIndustryIcon = (industry) => {
    const icons = {
      Technology: '💻',
      'Media & Entertainment': '🎬',
      Finance: '💰',
      Healthcare: '🏥',
      Retail: '🛍️',
      Education: '📚',
      Energy: '⚡',
    };
    return icons[industry] || '🏢';
  };

  // Stats
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalSpent = clients.reduce((acc, c) => acc + c.totalSpent, 0);
  const avgSatisfaction = clients.length > 0
    ? Math.round(clients.reduce((acc, c) => acc + c.satisfaction, 0) / clients.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading clients...</p>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-500 mt-1">Manage your client relationships and projects</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition flex items-center gap-2 shadow-sm">
              <UserPlus className="w-5 h-5" />
              Add Client
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalClients}</p>
                <p className="text-sm text-gray-500">Total Clients</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <UserPlus className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeClients}</p>
                <p className="text-sm text-gray-500">Active Clients</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-xl">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{clients.filter(c => c.projects.length > 0).length}</p>
                <p className="text-sm text-gray-500">With Projects</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-xl">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgSatisfaction}%</p>
                <p className="text-sm text-gray-500">Avg Satisfaction</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <PieChart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${(totalSpent / 1000).toFixed(0)}k</p>
                <p className="text-sm text-gray-500">Total Spent</p>
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
                placeholder="Search clients..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">All Industries</option>
              <option value="Technology">Technology</option>
              <option value="Media & Entertainment">Media & Entertainment</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Retail">Retail</option>
              <option value="Education">Education</option>
              <option value="Energy">Energy</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            {filteredClients.length} clients found
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                      {client.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm text-gray-500">{client.industry}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 py-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{client.address}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Projects:</span>
                      <span className="text-sm font-medium text-gray-700">{client.projects.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">{client.satisfaction}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total Spent</span>
                    <span className="font-semibold text-indigo-600">${client.totalSpent.toLocaleString()}</span>
                  </div>

                  {client.contacts.length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Key Contacts</p>
                      <div className="flex flex-wrap gap-2">
                        {client.contacts.map((contact, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs bg-gray-50 px-2.5 py-1 rounded-lg">
                            <span className="font-medium text-gray-700">{contact.name}</span>
                            <span className="text-gray-400">·</span>
                            <span className="text-gray-500">{contact.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-gray-200 rounded-lg transition text-gray-500 hover:text-indigo-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded-lg transition text-gray-500 hover:text-indigo-600">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded-lg transition text-gray-500 hover:text-indigo-600">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  View Projects
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No clients found</p>
            <p className="text-gray-400 mt-1">
              {searchTerm ? 'Try adjusting your search' : 'Add your first client'}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}