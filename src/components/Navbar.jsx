// components/Navbar.jsx
import { Link } from 'react-router-dom';
import Button from './Button';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              🚀 SaaSify
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/new">
              <Button variant="success">+ New Project</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}