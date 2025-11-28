import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icons } from './Icon';

const NavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navbar on editor page to maximize space
  if (location.pathname.startsWith('/note/')) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe pt-2 px-6 flex justify-around items-center h-16 z-50 no-print">
      <button 
        onClick={() => navigate('/')}
        className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <Icons.Home size={24} />
        <span className="text-xs font-medium">Home</span>
      </button>

      <div className="relative -top-5">
        <button 
          onClick={() => navigate('/note/new')}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg active:scale-95 transition-transform"
        >
          <Icons.Plus size={28} />
        </button>
      </div>

      <button 
        onClick={() => navigate('/calendar')}
        className={`flex flex-col items-center gap-1 ${isActive('/calendar') ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <Icons.Calendar size={24} />
        <span className="text-xs font-medium">Calendar</span>
      </button>
    </div>
  );
};

export default NavBar;