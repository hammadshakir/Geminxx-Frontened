// pages/Timeline.jsx
import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Filter,
  Search,
  Plus,
  CheckCircle,
  Circle,
  AlertCircle,
  MoreVertical,
  Users,
  FolderOpen,
  MessageSquare,
  Paperclip,
  Star,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Trash2,
  Share2,
  Bookmark,
  Bell,
  Flag,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Timeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());

  useEffect(() => {
    fetchTimelineEvents();
  }, []);

  const fetchTimelineEvents = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      const sampleEvents = [
        {
          id: 1,
          type: 'project_started',
          title: 'New Project Started',
          description: 'E-commerce Platform project has been initiated',
          project: 'E-commerce Platform',
          date: '2024-12-15',
          time: '10:30 AM',
          user: 'John Doe',
          userAvatar: 'JD',
          icon: 'rocket',
          color: 'blue',
          details: 'Project planning phase has begun. Initial team meeting scheduled for next week.',
          attachments: ['Project Brief.pdf', 'Team Roster.xlsx'],
          comments: 5,
          priority: 'high',
        },
        {
          id: 2,
          type: 'task_completed',
          title: 'Task Completed',
          description: 'Design mockups approved by client',
          project: 'Mobile App Design',
          date: '2024-12-14',
          time: '3:45 PM',
          user: 'Jane Smith',
          userAvatar: 'JS',
          icon: 'check',
          color: 'green',
          details: 'All 12 design mockups have been reviewed and approved by the client. Ready for development.',
          attachments: ['Mockup_Final.zip'],
          comments: 8,
          priority: 'medium',
        },
        {
          id: 3,
          type: 'milestone',
          title: 'Milestone Reached',
          description: 'Phase 1 completion - API Integration',
          project: 'API Integration',
          date: '2024-12-13',
          time: '11:20 AM',
          user: 'Mike Johnson',
          userAvatar: 'MJ',
          icon: 'flag',
          color: 'purple',
          details: 'Successfully completed Phase 1 of API integration. All endpoints are functioning correctly.',
          attachments: ['API_Documentation.pdf', 'Test_Results.xlsx'],
          comments: 12,
          priority: 'high',
        },
        {
          id: 4,
          type: 'meeting',
          title: 'Team Meeting',
          description: 'Weekly sprint planning session',
          project: 'Marketing Campaign',
          date: '2024-12-12',
          time: '9:00 AM',
          user: 'Sarah Wilson',
          userAvatar: 'SW',
          icon: 'users',
          color: 'indigo',
          details: 'Weekly sprint planning meeting to review progress and plan next sprint tasks.',
          attachments: ['Sprint_Plan.pdf', 'Meeting_Notes.docx'],
          comments: 3,
          priority: 'medium',
        },
        {
          id: 5,
          type: 'feedback',
          title: 'Client Feedback Received',
          description: 'Feedback on project delivery and quality',
          project: 'Various Projects',
          date: '2024-12-11',
          time: '2:15 PM',
          user: 'Robert Brown',
          userAvatar: 'RB',
          icon: 'message',
          color: 'amber',
          details: 'Client provided positive feedback on project delivery. Minor adjustments requested.',
          attachments: ['Feedback_Form.pdf'],
          comments: 6,
          priority: 'low',
        },
        {
          id: 6,
          type: 'deadline',
          title: 'Project Deadline Approaching',
          description: 'Final submission deadline in 3 days',
          project: 'Database Migration',
          date: '2024-12-10',
          time: '4:00 PM',
          user: 'Emily Davis',
          userAvatar: 'ED',
          icon: 'alert',
          color: 'red',
          details: 'Project deadline is approaching. 3 days remaining for final submission.',
          attachments: [],
          comments: 2,
          priority: 'urgent',
        },
      ];
      setEvents(sampleEvents);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    const newSet = new Set(expandedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedItems(newSet);
  };

  const getIconColor = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-emerald-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
      amber: 'bg-amber-500',
      red: 'bg-rose-500',
    };
    return colors[color] || 'bg-gray-500';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'text-rose-600 bg-rose-50',
      high: 'text-amber-600 bg-amber-50',
      medium: 'text-blue-600 bg-blue-50',
      low: 'text-gray-600 bg-gray-50',
    };
    return colors[priority] || 'text-gray-600 bg-gray-50';
  };

  const filteredEvents = events.filter(event => {
    if (filterType === 'all') return true;
    return event.type === filterType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading timeline...</p>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Timeline</h1>
            <p className="text-gray-500 mt-1">Track all project events and activities</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>
        </div>

        {/* Timeline Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              <p className="text-sm text-gray-500">Total Events</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{events.filter(e => e.type === 'task_completed').length}</p>
              <p className="text-sm text-gray-500">Tasks Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{events.filter(e => e.priority === 'urgent' || e.priority === 'high').length}</p>
              <p className="text-sm text-gray-500">High Priority</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{events.filter(e => e.type === 'meeting').length}</p>
              <p className="text-sm text-gray-500">Meetings</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'project_started', 'task_completed', 'milestone', 'meeting', 'feedback', 'deadline'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filterType === type
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {type === 'all' ? 'All Events' : type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-6">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="relative pl-16">
                {/* Timeline dot */}
                <div className={`absolute left-3.5 top-1.5 w-5 h-5 rounded-full border-4 border-white ${getIconColor(event.color)} shadow-md`}></div>

                {/* Timeline connector line */}
                {index < filteredEvents.length - 1 && (
                  <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                )}

                {/* Event Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
                  <div
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => toggleExpand(event.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getPriorityColor(event.priority)}`}>
                            {event.priority.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400">{event.project}</span>
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {event.date} at {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center font-medium">
                              {event.userAvatar}
                            </div>
                            {event.user}
                          </span>
                          {event.comments > 0 && (
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5" />
                              {event.comments}
                            </span>
                          )}
                          {event.attachments.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Paperclip className="w-3.5 h-3.5" />
                              {event.attachments.length}
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 transition">
                        {expandedItems.has(event.id) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedItems.has(event.id) && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Details</h4>
                          <p className="text-sm text-gray-600">{event.details}</p>
                        </div>

                        {event.attachments.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
                            <div className="flex flex-wrap gap-2">
                              {event.attachments.map((file, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-xs">
                                  <Paperclip className="w-3 h-3 text-gray-400" />
                                  <span className="text-gray-600">{file}</span>
                                  <button className="text-gray-400 hover:text-indigo-600">
                                    <Download className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-2">
                          <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            View Details
                          </button>
                          <button className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            Comment
                          </button>
                          <button className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-1">
                            <Share2 className="w-3 h-3" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No events found</p>
            <p className="text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}