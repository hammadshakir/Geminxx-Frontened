// components/DashboardChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardChart({ projects }) {
  const data = [
    { name: 'Completed', value: projects.filter(p => p.progress === 100).length },
    { name: 'On Track', value: projects.filter(p => p.progress > 70 && p.progress < 100).length },
    { name: 'In Progress', value: projects.filter(p => p.progress >= 30 && p.progress <= 70).length },
    { name: 'Starting', value: projects.filter(p => p.progress > 0 && p.progress < 30).length },
    { name: 'Not Started', value: projects.filter(p => p.progress === 0).length },
  ];

  const colors = ['#22c55e', '#3b82f6', '#eab308', '#8b5cf6', '#6b7280'];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Overview</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Bar key={index} dataKey="value" fill={colors[index % colors.length]} radius={[4, 4, 0, 0]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}