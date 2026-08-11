// pages/AdminRoles.jsx
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  AlertCircle,
  UserCheck,
  UserX,
  Crown,
  Briefcase,
  User,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, updateUserRole } from '../services/authApi'; 

export default function AdminRoles() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState('');

  // Role definitions with icons and descriptions
  const roleDefinitions = [
    {
      id: 'admin',
      name: 'Admin',
      icon: Crown,
      color: 'purple',
      description: 'Full system access - can manage users, projects, and settings',
      permissions: ['All permissions']
    },
    {
      id: 'client',
      name: 'Client',
      icon: Briefcase,
      color: 'blue',
      description: 'Can create projects, manage tasks, and communicate with team',
      permissions: ['Create projects', 'Manage tasks', 'Chat with team']
    },
    {
      id: 'team_member',
      name: 'Team Member',
      icon: User,
      color: 'green',
      description: 'Can work on assigned tasks and collaborate with team',
      permissions: ['View tasks', 'Update tasks', 'Team collaboration']
    },
    {
      id: 'viewer',
      name: 'Viewer',
      icon: Eye,
      color: 'gray',
      description: 'Read-only access - can view projects and tasks',
      permissions: ['View projects', 'View tasks']
    }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllUsers();
      setUsers(response.users || []);
    } catch (error) {
      setError(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setShowSuccess(`User role updated to ${newRole}`);
      setTimeout(() => setShowSuccess(''), 3000);
      fetchUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  const getRoleIcon = (role) => {
    const found = roleDefinitions.find(r => r.id === role);
    return found ? found.icon : User;
  };

  const getRoleColor = (role) => {
    const found = roleDefinitions.find(r => r.id === role);
    return found ? found.color : 'gray';
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-700 border-purple-200',
      client: 'bg-blue-100 text-blue-700 border-blue-200',
      team_member: 'bg-green-100 text-green-700 border-green-200',
      viewer: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  const filteredUsers = selectedRole === 'all' 
    ? users 
    : users.filter(u => u.role === selectedRole);

  // Count users by role
  const roleCounts = {
    admin: users.filter(u => u.role === 'admin').length,
    client: users.filter(u => u.role === 'client').length,
    team_member: users.filter(u => u.role === 'team_member').length,
    viewer: users.filter(u => u.role === 'viewer').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading roles...</p>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-8 h-8 text-indigo-600" />
              Role Management
            </h1>
            <p className="text-gray-500 mt-1">Manage user roles and permissions</p>
          </div>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-700">{showSuccess}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="text-red-700 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Role Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {roleDefinitions.map((role) => {
            const Icon = role.icon;
            const count = roleCounts[role.id] || 0;
            return (
              <div
                key={role.id}
                className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-300 ${
                  selectedRole === role.id ? 'ring-2 ring-indigo-500' : ''
                }`}
                onClick={() => setSelectedRole(selectedRole === role.id ? 'all' : role.id)}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl bg-${role.color}-50`}>
                    <Icon className={`w-5 h-5 text-${role.color}-600`} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{count}</span>
                </div>
                <p className="text-sm font-medium text-gray-700 mt-2">{role.name}s</p>
                <p className="text-xs text-gray-400">{role.description}</p>
              </div>
            );
          })}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Users ({filteredUsers.length})
              </span>
            </div>
            {selectedRole !== 'all' && (
              <button
                onClick={() => setSelectedRole('all')}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear filter
              </button>
            )}
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No users with this role</p>
              <p className="text-gray-400 text-sm">Try selecting a different role</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((u) => {
                    const RoleIcon = getRoleIcon(u.role);
                    const color = getRoleColor(u.role);
                    return (
                      <tr key={u._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                              {u.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{u.name}</p>
                              <p className="text-xs text-gray-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                          {u.email}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded-lg bg-${color}-50`}>
                              <RoleIcon className={`w-4 h-4 text-${color}-600`} />
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(u.role)}`}>
                              {u.role}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            u.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                            u.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {u.status === 'active' ? '🟢 Active' : 
                             u.status === 'inactive' ? '⚪ Inactive' : 
                             '🔴 Suspended'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {u.role !== 'admin' && (
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleUpdate(u._id, e.target.value)}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                              >
                                {roleDefinitions.map((role) => (
                                  <option key={role.id} value={role.id}>
                                    {role.name}
                                  </option>
                                ))}
                              </select>
                            )}
                            {u.role === 'admin' && (
                              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
                                Protected
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
          )}
        </div>

        {/* Role Definitions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Role Definitions & Permissions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roleDefinitions.map((role) => {
              const Icon = role.icon;
              const color = role.color;
              return (
                <div key={role.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-xl bg-${color}-50`}>
                      <Icon className={`w-5 h-5 text-${color}-600`} />
                    </div>
                    <h4 className="font-semibold text-gray-900">{role.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {role.permissions.map((perm, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}