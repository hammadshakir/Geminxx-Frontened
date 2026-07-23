// components/StatusBadge.jsx
export default function StatusBadge({ progress }) {
  let status, color;
  
  if (progress === 100) {
    status = 'Completed';
    color = 'bg-green-100 text-green-800';
  } else if (progress > 70) {
    status = 'On Track';
    color = 'bg-blue-100 text-blue-800';
  } else if (progress > 30) {
    status = 'In Progress';
    color = 'bg-yellow-100 text-yellow-800';
  } else if (progress > 0) {
    status = 'Starting';
    color = 'bg-purple-100 text-purple-800';
  } else {
    status = 'Not Started';
    color = 'bg-gray-100 text-gray-800';
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {status}
    </span>
  );
}