// components/StatsCard.jsx
import { useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  RefreshCw
} from "lucide-react";
import {
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRocket,
  FaChartLine,
} from "react-icons/fa";
import { FiBarChart2, FiPieChart, FiCalendar, FiDollarSign } from "react-icons/fi";

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  color = 'indigo', 
  trend, 
  animated = false,
  subtitle,
  loading = false,
  onClick,
  progress,
  progressLabel,
  metric
}) {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      hover: 'hover:bg-indigo-100',
      ring: 'ring-indigo-500/20',
      gradient: 'from-indigo-500 to-indigo-600',
      border: 'border-indigo-200',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      hover: 'hover:bg-emerald-100',
      ring: 'ring-emerald-500/20',
      gradient: 'from-emerald-500 to-emerald-600',
      border: 'border-emerald-200',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      hover: 'hover:bg-amber-100',
      ring: 'ring-amber-500/20',
      gradient: 'from-amber-500 to-amber-600',
      border: 'border-amber-200',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      hover: 'hover:bg-rose-100',
      ring: 'ring-rose-500/20',
      gradient: 'from-rose-500 to-rose-600',
      border: 'border-rose-200',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      hover: 'hover:bg-blue-100',
      ring: 'ring-blue-500/20',
      gradient: 'from-blue-500 to-blue-600',
      border: 'border-blue-200',
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      hover: 'hover:bg-green-100',
      ring: 'ring-green-500/20',
      gradient: 'from-green-500 to-green-600',
      border: 'border-green-200',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      hover: 'hover:bg-purple-100',
      ring: 'ring-purple-500/20',
      gradient: 'from-purple-500 to-purple-600',
      border: 'border-purple-200',
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      hover: 'hover:bg-red-100',
      ring: 'ring-red-500/20',
      gradient: 'from-red-500 to-red-600',
      border: 'border-red-200',
    },
    cyan: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-600',
      hover: 'hover:bg-cyan-100',
      ring: 'ring-cyan-500/20',
      gradient: 'from-cyan-500 to-cyan-600',
      border: 'border-cyan-200',
    },
  };

  const colorConfig = colorClasses[color] || colorClasses.indigo;
  const isPositive = trend?.startsWith('+');
  const trendColor = isPositive ? 'text-emerald-600' : 'text-rose-600';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-7 bg-gray-200 rounded w-16 mt-1"></div>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Map icon names to actual icons
  const iconMap = {
    project: FaProjectDiagram,
    tasks: FaTasks,
    users: FaUsers,
    clock: FaClock,
    check: FaCheckCircle,
    warning: FaExclamationTriangle,
    rocket: FaRocket,
    chart: FaChartLine,
    barChart: FiBarChart2,
    pieChart: FiPieChart,
    calendar: FiCalendar,
    dollar: FiDollarSign,
  };

  // Get the icon component
  let IconComponent = icon;
  if (typeof icon === 'string') {
    IconComponent = iconMap[icon];
  }
  if (!IconComponent) {
    IconComponent = FaProjectDiagram;
  }

  return (
    <div 
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100 
        transition-all duration-300
        ${animated && !loading ? 'hover:-translate-y-0.5 hover:shadow-md' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${isHovered ? 'shadow-md' : ''}
        overflow-hidden
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="p-4">
        {/* Header - Title and Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-gray-500 truncate uppercase tracking-wider">
                {title}
              </p>
              {subtitle && (
                <span className="text-[10px] text-gray-400 font-normal bg-gray-100 px-1.5 py-0.5 rounded">
                  {subtitle}
                </span>
              )}
            </div>
            
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-xl font-bold text-gray-900">
                {value}
              </p>
              {metric && (
                <span className="text-[10px] text-gray-400 font-medium">
                  {metric}
                </span>
              )}
            </div>
          </div>

          {/* Icon */}
          <div className={`
            w-10 h-10 rounded-lg ${colorConfig.bg} 
            flex items-center justify-center transition-all duration-300 flex-shrink-0
            ${isHovered ? `scale-105 ${colorConfig.ring} ring-2` : ''}
          `}>
            <IconComponent className={`w-5 h-5 ${colorConfig.text}`} />
          </div>
        </div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-500">Progress</span>
              <span className={`font-medium ${colorConfig.text}`}>{progress}%</span>
            </div>
            <div className="mt-0.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${colorConfig.gradient} rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              />
            </div>
            {progressLabel && (
              <p className="mt-0.5 text-[10px] text-gray-400">{progressLabel}</p>
            )}
          </div>
        )}

        {/* Trend */}
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-[10px] font-medium ${trendColor}`}>
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            <span>{trend}</span>
            <span className="text-gray-400 font-normal">vs last month</span>
          </div>
        )}
      </div>

      {/* Bottom border accent */}
      <div className={`h-0.5 bg-gradient-to-r ${colorConfig.gradient} transition-all duration-300 ${isHovered ? 'h-1' : 'h-0.5'}`} />
    </div>
  );
}