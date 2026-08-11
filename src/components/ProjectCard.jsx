// components/ProjectCard.jsx
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Edit, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Share2,
  Bookmark,
  Star,
  ExternalLink,
  GitBranch,
  MessageSquare,
  TrendingUp,
  Zap,
  Award,
  Flag,
  Target,
  Code2,
  Brush,
  Megaphone,
  Microscope,
  FolderKanban,
  MessageCircle,
  Trash2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';

export default function ProjectCard({ 
  project, 
  canEdit = false, 
  canDelete = false, 
  isViewer = false,
  userRole = 'viewer',
  userId = null,
  onDelete = null,
  isDeleting = false
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [loadingComments, setLoadingComments] = useState(false);
  
  // 🔒 CRITICAL: Check permissions properly
  const isAdmin = userRole === 'admin';
  const isClient = userRole === 'client';
  const isTeamMember = userRole === 'team_member';
  
  // 🔒 Check if user can edit THIS project
  const canEditThisProject = () => {
    // Admin can edit all projects
    if (isAdmin) return true;
    
    // Client can edit ONLY their own projects
    if (isClient) {
      // Check if project.client is an object with _id
      const clientId = project.client?._id || project.client;
      return clientId === userId;
    }
    
    // Others cannot edit
    return false;
  };
  
  // 🔒 Check if user can delete THIS project
  const canDeleteThisProject = () => {
    // Only admin can delete
    return isAdmin;
  };
  
  const isEditable = canEditThisProject();
  const isDeletable = canDeleteThisProject();
  
  const daysUntilDeadline = project.DeadLine ? Math.ceil(
    (new Date(project.DeadLine) - new Date()) / (1000 * 60 * 60 * 24)
  ) : null;
  
  const isOverdue = daysUntilDeadline !== null && daysUntilDeadline < 0;
  const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 3 && !isOverdue;
  
  // Fetch comment count
  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        setLoadingComments(true);
        const response = await fetch(`http://localhost:1000/api/projects/${project._id}/comments`);
        if (response.ok) {
          const comments = await response.json();
          setCommentCount(comments.length || 0);
        }
      } catch (error) {
        console.error("Error fetching comment count:", error);
      } finally {
        setLoadingComments(false);
      }
    };

    if (project._id) {
      fetchCommentCount();
    }
  }, [project._id]);
  
  const getDeadlineStatus = () => {
    if (isOverdue) return { color: 'text-rose-600', bg: 'bg-rose-50', label: 'Overdue', icon: AlertCircle };
    if (isUrgent) return { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Urgent', icon: Clock };
    return { color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'On Track', icon: CheckCircle };
  };
  
  const deadlineStatus = getDeadlineStatus();
  const DeadlineIcon = deadlineStatus.icon;
  
  const getPriorityColor = () => {
    const priority = project.priority || 'medium';
    switch(priority) {
      case 'urgent': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryInfo = () => {
    const category = project.category || 'other';
    const categories = {
      development: { icon: Code2, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Development' },
      design: { icon: Brush, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Design' },
      marketing: { icon: Megaphone, color: 'text-green-600', bg: 'bg-green-50', label: 'Marketing' },
      research: { icon: Microscope, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Research' },
      other: { icon: FolderKanban, color: 'text-gray-600', bg: 'bg-gray-50', label: 'Other' },
    };
    return categories[category] || categories.other;
  };

  const categoryInfo = getCategoryInfo();
  const CategoryIcon = categoryInfo.icon;

  const getProgressStatus = () => {
    const progress = project.progress || 0;
    if (progress === 100) return { label: 'Completed', color: 'text-emerald-600', icon: Award };
    if (progress >= 75) return { label: 'Almost Done', color: 'text-blue-600', icon: TrendingUp };
    if (progress >= 50) return { label: 'In Progress', color: 'text-indigo-600', icon: Zap };
    if (progress >= 25) return { label: 'Just Started', color: 'text-amber-600', icon: Target };
    return { label: 'Not Started', color: 'text-gray-500', icon: Flag };
  };

  const progressStatus = getProgressStatus();
  const ProgressIcon = progressStatus.icon;

  return (
    <div 
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-200 
        transition-all duration-300 relative overflow-hidden
        ${isHovered ? 'shadow-xl -translate-y-1 border-indigo-200' : 'hover:shadow-lg'}
        hover:border-indigo-200
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top colored bar */}
      <div className={`
        absolute top-0 left-0 right-0 h-1 
        ${project.progress === 100 ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}
        transition-all duration-300
        ${isHovered ? 'h-1.5' : 'h-1'}
      `} />

      {/* Top section with status and actions */}
      <div className="relative p-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <StatusBadge progress={project.progress} />
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border ${getPriorityColor()}`}>
                {project.priority || 'Medium'}
              </span>
              {isViewer && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                  👁️ View Only
                </span>
              )}
              {isTeamMember && !isEditable && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-medium">
                  ⚡ Assigned
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-gray-800 truncate hover:text-indigo-600 transition-colors">
              {project.title}
            </h3>
          </div>
          
          {/* Action buttons - Only for non-viewers */}
          {!isViewer && (
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all duration-200"
              >
                <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
          {project.description || 'No description provided'}
        </p>

        {/* Category and metadata */}
        <div className="flex items-center gap-2 mt-3 text-xs flex-wrap">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${categoryInfo.bg} ${categoryInfo.color}`}>
            <CategoryIcon className="w-3.5 h-3.5" />
            <span className="font-medium">{categoryInfo.label}</span>
          </span>
          
          <span className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
            <GitBranch className="w-3.5 h-3.5" />
            <span>v1.0</span>
          </span>
          
          <span className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
            <Users className="w-3.5 h-3.5" />
            <span>Team</span>
          </span>
        </div>
      </div>

      {/* Project details */}
      <div className="relative px-4 py-3 bg-gray-50/80 border-y border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Start</p>
              <p className="text-xs font-semibold text-gray-700">
                {project.startingDate ? new Date(project.startingDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-50 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Deadline</p>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-gray-700 truncate">
                  {project.DeadLine ? new Date(project.DeadLine).toLocaleDateString() : 'N/A'}
                </p>
                {project.DeadLine && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 ${deadlineStatus.bg} ${deadlineStatus.color}`}>
                    <DeadlineIcon className="w-3 h-3" />
                    {deadlineStatus.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress section */}
      <div className="relative px-4 pt-3 pb-2">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center gap-1.5">
            <ProgressIcon className={`w-3.5 h-3.5 ${progressStatus.color}`} />
            <span className={`font-medium ${progressStatus.color}`}>{progressStatus.label}</span>
          </div>
          <span className="font-bold text-indigo-600">{project.progress || 0}%</span>
        </div>
        <ProgressBar progress={project.progress || 0} showLabel={false} />
        
        {project.DeadLine && !isOverdue && project.progress < 100 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] text-gray-400">
              {daysUntilDeadline} days remaining
            </span>
          </div>
        )}
        
        {project.DeadLine && isOverdue && project.progress < 100 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            <span className="text-[10px] text-rose-500 font-medium">
              Overdue by {Math.abs(daysUntilDeadline)} days
            </span>
          </div>
        )}
      </div>

      {/* 🔒 ACTION BUTTONS - Based on permissions */}
      <div className="relative px-4 pb-4 pt-2 flex gap-2">
        {/* View Button - Everyone */}
        <Link to={`/projects/${project._id}`} className="flex-1">
          <button className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </Link>
        
        {/* 🔒 Edit Button - Only Admin and Client (their own projects) */}
        {isEditable && (
          <Link to={`/projects/${project._id}/edit`} className="flex-1">
            <button className="w-full px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </Link>
        )}
        
        {/* 🔒 Delete Button - Only Admin */}
        {isDeletable && onDelete && (
          <button 
            onClick={onDelete}
            disabled={isDeleting}
            className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        )}
        
        {/* 🔒 Team Member - View Only (No Edit/Delete) */}
        {isTeamMember && !isEditable && !isDeletable && (
          <div className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-500 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            View Only
          </div>
        )}
        
        {/* 🔒 Viewer - View Only */}
        {isViewer && (
          <div className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-500 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            View Only
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative px-4 pb-3 pt-0 border-t border-gray-100/50">
        <div className="flex items-center justify-between text-[10px] text-gray-400">
          <Link 
            to={`/projects/${project._id}`}
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors group"
          >
            <MessageCircle className="w-3.5 h-3.5 group-hover:text-indigo-500 transition-colors" />
            <span className="group-hover:text-indigo-600 transition-colors">
              {loadingComments ? (
                <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></span>
              ) : (
                `${commentCount} ${commentCount === 1 ? 'comment' : 'comments'}`
              )}
            </span>
          </Link>
          
          <span className="flex items-center gap-1.5">
            <ExternalLink className="w-3 h-3" />
            <span>Updated recently</span>
          </span>
        </div>
      </div>
    </div>
  );
}