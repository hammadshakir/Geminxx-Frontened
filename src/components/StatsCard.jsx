// components/StatsCard.jsx
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatsCard({ title, value, icon, color = 'indigo', trend, animated = false }) {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };

  const isPositive = trend?.startsWith('+');
  const trendColor = isPositive ? 'text-emerald-600' : 'text-rose-600';

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md ${animated ? 'hover:-translate-y-1' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full ${colorClasses[color] || colorClasses.indigo} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${trendColor}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          <span>{trend}</span>
          <span className="text-gray-400 font-normal ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
}