// pages/Notifications.jsx
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiBell, FiCheckCircle, FiClock, FiAlertCircle, FiMessageSquare, FiStar, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch notifications from API
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      const sampleNotifications = [
        { 
          id: 1, 
          type: 'success', 
          title: 'Task Completed', 
          message: 'Your task "Website Redesign" has been completed', 
          time: '2 hours ago', 
          read: false 
        },
        { 
          id: 2, 
          type: 'info', 
          title: 'New Task Assigned', 
          message: 'You have been assigned to "API Integration Testing"', 
          time: '4 hours ago', 
          read: false 
        },
        { 
          id: 3, 
          type: 'warning', 
          title: 'Deadline Approaching', 
          message: 'Marketing Campaign deadline is in 3 days', 
          time: '1 day ago', 
          read: true 
        },
        { 
          id: 4, 
          type: 'message', 
          title: 'New Message', 
          message: 'Jane Smith sent you a message about the project', 
          time: '2 days ago', 
          read: true 
        },
      ];
      setNotifications(sampleNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <FiCheckCircle className="text-emerald-500" />;
      case 'warning': return <FiAlertCircle className="text-amber-500" />;
      case 'info': return <FiClock className="text-blue-500" />;
      case 'message': return <FiMessageSquare className="text-purple-500" />;
      case 'star': return <FiStar className="text-yellow-500" />;
      default: return <FiBell className="text-gray-500" />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500 mt-1">
              {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up! 🎉'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <FiBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No notifications</p>
            <p className="text-gray-400 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl shadow-sm border p-4 hover:shadow-md transition-all duration-300 ${
                  notification.read ? 'border-gray-100' : 'border-indigo-200 bg-indigo-50/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-xl">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 whitespace-nowrap">{notification.time}</span>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}