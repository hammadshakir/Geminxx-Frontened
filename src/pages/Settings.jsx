// pages/Settings.jsx
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiSettings, FiUser, FiBell, FiLock, FiGlobe, FiMail } from 'react-icons/fi';

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {[
              { icon: FiUser, label: 'Profile Settings', description: 'Update your personal information' },
              { icon: FiBell, label: 'Notifications', description: 'Manage your notification preferences' },
              { icon: FiLock, label: 'Security', description: 'Password and security settings' },
              { icon: FiGlobe, label: 'Preferences', description: 'Language and regional settings' },
              { icon: FiMail, label: 'Email Settings', description: 'Configure email notifications' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <item.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">→</button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}