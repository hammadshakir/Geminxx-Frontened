// components/ProgressBar.jsx
export default function ProgressBar({ progress }) {
  const color = progress === 100 ? 'bg-green-500' : progress > 70 ? 'bg-blue-500' : progress > 30 ? 'bg-yellow-500' : 'bg-red-500';
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div
        className={`h-2.5 rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}