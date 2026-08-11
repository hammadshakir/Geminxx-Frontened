// pages/AdminSettings.jsx
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Settings,
  Shield,
  Users,
  Bell,
  Mail,
  Lock,
  Globe,
  Database,
  RefreshCw,
  Save,
  CheckCircle,
  AlertCircle,
  Server,
  Cloud,
  Key,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Gemnixx',
    siteDescription: 'Project Management Platform',
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: '2h',
    maxLoginAttempts: 5,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    
    // User Settings
    allowRegistration: true,
    defaultRole: 'viewer',
    requireEmailVerification: true,
    
    // Integration Settings
    enableGoogleAuth: true,
    enableGithubAuth: false,
  });

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess('');
    try {
      // In production, save to API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const settingSections = [
    {
      title: 'General Settings',
      icon: Settings,
      fields: [
        { key: 'siteName', label: 'Site Name', type: 'text' },
        { key: 'siteDescription', label: 'Site Description', type: 'text' },
      ]
    },
    {
      title: 'Security Settings',
      icon: Lock,
      fields: [
        { key: 'twoFactorAuth', label: 'Enable Two-Factor Authentication', type: 'toggle' },
        { key: 'sessionTimeout', label: 'Session Timeout', type: 'select', options: ['30m', '1h', '2h', '4h', '8h'] },
        { key: 'maxLoginAttempts', label: 'Max Login Attempts', type: 'number' },
      ]
    },
    {
      title: 'Notification Settings',
      icon: Bell,
      fields: [
        { key: 'emailNotifications', label: 'Email Notifications', type: 'toggle' },
        { key: 'pushNotifications', label: 'Push Notifications', type: 'toggle' },
        { key: 'smsNotifications', label: 'SMS Notifications', type: 'toggle' },
      ]
    },
    {
      title: 'User Settings',
      icon: Users,
      fields: [
        { key: 'allowRegistration', label: 'Allow User Registration', type: 'toggle' },
        { key: 'defaultRole', label: 'Default User Role', type: 'select', options: ['viewer', 'client', 'team_member'] },
        { key: 'requireEmailVerification', label: 'Require Email Verification', type: 'toggle' },
      ]
    },
    {
      title: 'Integration Settings',
      icon: Cloud,
      fields: [
        { key: 'enableGoogleAuth', label: 'Enable Google Authentication', type: 'toggle' },
        { key: 'enableGithubAuth', label: 'Enable GitHub Authentication', type: 'toggle' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="w-8 h-8 text-indigo-600" />
              System Settings
            </h1>
            <p className="text-gray-500 mt-1">Configure system-wide settings and preferences</p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition flex items-center gap-2 shadow-sm disabled:opacity-60"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingSections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
                  <Icon className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                </div>
                <div className="p-6 space-y-4">
                  {section.fields.map((field) => {
                    const value = settings[field.key];
                    return (
                      <div key={field.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <label className="text-sm font-medium text-gray-700">
                          {field.label}
                        </label>
                        <div className="sm:w-64">
                          {field.type === 'toggle' ? (
                            <button
                              onClick={() => handleChange(field.key, !value)}
                              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                value ? 'bg-indigo-600' : 'bg-gray-300'
                              }`}
                            >
                              <div
                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                                  value ? 'translate-x-6' : ''
                                }`}
                              />
                            </button>
                          ) : field.type === 'select' ? (
                            <select
                              value={value}
                              onChange={(e) => handleChange(field.key, e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            >
                              {field.options.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : field.type === 'number' ? (
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => handleChange(field.key, parseInt(e.target.value))}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              min={1}
                              max={10}
                            />
                          ) : (
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => handleChange(field.key, e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* System Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-600" />
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Server Status</p>
              <p className="text-sm font-medium text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Running
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Database</p>
              <p className="text-sm font-medium text-green-600 flex items-center gap-1">
                <Database className="w-4 h-4" />
                Connected
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total Users</p>
              <p className="text-sm font-medium text-gray-900">0</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}