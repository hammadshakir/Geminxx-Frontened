// components/ProjectCard.jsx
import Button from './Button';
import ProgressBar from './ProgressBar';

export default function ProjectCard({ project }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 truncate">{project.title}</h3>
      <p className="text-gray-600 mt-2 line-clamp-2 h-12">{project.description}</p>
      
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>📅 Start: {new Date(project.startingDate).toLocaleDateString()}</span>
        <span>⏳ Deadline: {new Date(project.DeadLine).toLocaleDateString()}</span>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <ProgressBar progress={project.progress} />
      </div>

      <div className="mt-5 flex gap-3">
        <Button to={`/projects/${project._id}`} variant="primary" className="text-sm flex-1">
          View
        </Button>
        <Button to={`/projects/${project._id}/edit`} variant="warning" className="text-sm flex-1">
          Edit
        </Button>
      </div>
    </div>
  );
}