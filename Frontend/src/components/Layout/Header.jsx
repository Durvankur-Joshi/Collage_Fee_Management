import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
          <Link to="/dashboard" className="text-xl font-bold text-blue-600">
            College Fee Management
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User size={20} className="text-gray-600" />
            <span className="text-sm">
              {user?.name} ({user?.role})
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-600 hover:text-red-700"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;