// components/ProjectTable.jsx
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { Eye, Edit } from 'lucide-react';

export default function ProjectTable({ projects }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project._id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{project.title}</td>
              <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs hidden md:table-cell">{project.description}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(project.DeadLine).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <StatusBadge progress={project.progress} />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{project.progress}%</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <Link to={`/projects/${project._id}`}>
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition">
                      <Eye className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link to={`/projects/${project._id}/edit`}>
                    <button className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition">
                      <Edit className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}