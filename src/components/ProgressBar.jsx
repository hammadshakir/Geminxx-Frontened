// components/ProgressBar.jsx
import { useState, useEffect } from 'react';

export default function ProgressBar({ progress, showLabel = true, animated = true }) {
  const [displayProgress, setDisplayProgress] = useState(0);
  
  useEffect(() => {
    if (animated) {
      // Animate from 0 to progress
      let start = 0;
      const duration = 1000;
      const step = Math.max(1, Math.floor((progress || 0) / 20));
      const interval = duration / (progress / step);
      
      const timer = setInterval(() => {
        start += step;
        if (start >= progress) {
          setDisplayProgress(progress);
          clearInterval(timer);
        } else {
          setDisplayProgress(start);
        }
      }, interval);
      
      return () => clearInterval(timer);
    } else {
      setDisplayProgress(progress || 0);
    }
  }, [progress, animated]);

  // Get color based on progress
  const getProgressColor = (value) => {
    if (value >= 100) return 'bg-gradient-to-r from-emerald-500 to-green-500';
    if (value >= 75) return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    if (value >= 50) return 'bg-gradient-to-r from-indigo-500 to-purple-500';
    if (value >= 25) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    return 'bg-gradient-to-r from-rose-500 to-red-500';
  };

  // Get status text
  const getStatusText = (value) => {
    if (value >= 100) return 'Completed 🎉';
    if (value >= 75) return 'Almost Done';
    if (value >= 50) return 'In Progress';
    if (value >= 25) return 'Just Started';
    return 'Not Started';
  };

  const safeProgress = Math.min(Math.max(displayProgress || 0, 0), 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600 font-medium">{getStatusText(safeProgress)}</span>
          <span className="text-gray-500">{safeProgress}%</span>
        </div>
      )}
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getProgressColor(safeProgress)}`}
          style={{ width: `${safeProgress}%` }}
        >
          {/* Shimmer animation for active progress */}
          {safeProgress > 0 && safeProgress < 100 && (
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  );
}