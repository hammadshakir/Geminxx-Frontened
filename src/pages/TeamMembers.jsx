// pages/TeamMembers.jsx
import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Filter,
  Search,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Award,
  TrendingUp,
  UserCheck,
  UserX,
  PieChart as PieChartIcon,
  BarChart3,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TeamMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      const sampleMembers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1 234 567 890',
          role: 'Project Manager',
          avatar: 'JD',
          status: 'active',
          projects: ['E-commerce Platform', 'Mobile App Design'],
          tasksCompleted: 45,
          tasksAssigned: 52,
          efficiency: 86,
          joinDate: '2024-01-15',
          skills: ['Project Management', 'Agile', 'Scrum', 'Leadership'],
          bio: 'Experienced project manager with 8 years in software development.',
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@email.com',
          phone: '+1 234 567 891',
          role: 'Senior Developer',
          avatar: 'JS',
          status: 'active',
          projects: ['Mobile App Design', 'API Integration'],
          tasksCompleted: 38,
          tasksAssigned: 44,
          efficiency: 86,
          joinDate: '2024-03-10',
          skills: ['React Native', 'Node.js', 'TypeScript', 'AWS'],
          bio: 'Full-stack developer specializing in mobile applications.',
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike.johnson@email.com',
          phone: '+1 234 567 892',
          role: 'UI/UX Designer',
          avatar: 'MJ',
          status: 'active',
          projects: ['Marketing Campaign', 'E-commerce Platform'],
          tasksCompleted: 32,
          tasksAssigned: 38,
          efficiency: 84,
          joinDate: '2024-02-20',
          skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
          bio: 'Creative designer with a passion for user-centered design.',
        },
        {
          id: 4,
          name: 'Sarah Wilson',
          email: 'sarah.wilson@email.com',
          phone: '+1 234 567 893',
          role: 'QA Engineer',
          avatar: 'SW',
          status: 'on_leave',
          projects: ['API Integration', 'Database Migration'],
          tasksCompleted: 28,
          tasksAssigned: 36,
          efficiency: 78,
          joinDate: '2024-04-05',
          skills: ['Selenium', 'Jest', 'Cypress', 'Manual Testing'],
          bio: 'Quality assurance specialist with 5 years of testing experience.',
        },
        {
          id: 5,
          name: 'Robert Brown',
          email: 'robert.brown@email.com',
          phone: '+1 234 567 894',
          role: 'DevOps Engineer',
          avatar: 'RB',
          status: 'active',
          projects: ['E-commerce Platform', 'Database Migration'],
          tasksCompleted: 25,
          tasksAssigned: 30,
          efficiency: 83,
          joinDate: '2024-05-12',
          skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins'],
          bio: 'DevOps engineer focused on automation and infrastructure.',
        },
        {
          id: 6,
          name: 'Emily Davis',
          email: 'emily.davis@email.com',
          phone: '+1 234 567 895',
          role: 'Marketing Specialist',
          avatar: 'ED',
          status: 'active',
          projects: ['Marketing Campaign'],
          tasksCompleted: 20,
          tasksAssigned: 25,
          efficiency: 80,
          joinDate: '2024-06-01',
          skills: ['Digital Marketing', 'Content Creation', 'SEO', 'Analytics'],
          bio: 'Marketing professional with expertise in digital campaigns.',
        },
        {
          id: 7,
          name: 'Alex Turner',
          email: 'alex.turner@email.com',
          phone: '+1 234 567 896',
          role: 'Intern',
          avatar: 'AT',
          status: 'inactive',
          projects: ['Mobile App Design'],
          tasksCompleted: 12,
          tasksAssigned: 20,
          efficiency: 60,
          joinDate: '2024-07-15',
          skills: ['React', 'Python', 'Git'],
          bio: 'Passionate intern learning software development.',
        },
      ];
      setMembers(sampleMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-emerald-100 text-emerald-700',
      on_leave: 'bg-amber-100 text-amber-700',
      inactive: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <UserCheck className="w-4 h-4" />;
      case 'on_leave': return <Clock className="w-4 h-4" />;
      case 'inactive': return <UserX className="w-4 h-4" />;
      default: return <UserCheck className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      'Project Manager': 'bg-indigo-100 text-indigo-700',
      'Senior Developer': 'bg-blue-100 text-blue-700',
      'UI/UX Designer': 'bg-purple-100 text-purple-700',
      'QA Engineer': 'bg-emerald-100 text-emerald-700',
      'DevOps Engineer': 'bg-amber-100 text-amber-700',
      'Marketing Specialist': 'bg-pink-100 text-pink-700',
      'Intern': 'bg-gray-100 text-gray-700',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  // Stats
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const onLeave = members.filter(m => m.status === 'on_leave').length;
  const avgEfficiency = members.length > 0
    ? Math.round(members.reduce((acc, m) => acc + m.efficiency, 0) / members.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading team members...</p>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Team Members</h1>
            <p className="text-gray-500 mt-1">Manage your team and track performance</p>
          </div>
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition flex items-center gap-2 shadow-sm">
            <UserPlus className="w-5 h-5" />
            Add Member
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMembers}</p>
                <p className="text-sm text-gray-500">Total Members</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <UserCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeMembers}</p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{onLeave}</p>
                <p className="text-sm text-gray-500">On Leave</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-xl">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgEfficiency}%</p>
                <p className="text-sm text-gray-500">Avg Efficiency</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {members.reduce((acc, m) => acc + m.tasksCompleted, 0)}
                </p>
                <p className="text-sm text-gray-500">Tasks Done</p>
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
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white w-48 sm:w-64"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">All Roles</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Senior Developer">Senior Developer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Marketing Specialist">Marketing Specialist</option>
              <option value="Intern">Intern</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            {filteredMembers.length} members found
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                      {member.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.role}</p>
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
                    <span className="text-gray-600">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {member.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                    {member.skills.length > 3 && (
                      <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{member.skills.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(member.status)}`}>
                        {getStatusIcon(member.status)}
                        {member.status === 'active' ? 'Active' : member.status === 'on_leave' ? 'On Leave' : 'Inactive'}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">{member.efficiency}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{member.tasksCompleted} tasks done</span>
                    <span>•</span>
                    <span>{member.projects.length} projects</span>
                  </div>
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
                </div>
                <div className="flex items-center gap-1">
                  <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No team members found</p>
            <p className="text-gray-400 mt-1">
              {searchTerm ? 'Try adjusting your search' : 'Add your first team member'}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}