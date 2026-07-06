import { useAuth } from '../../context/AuthContext';
import { Bell, Search, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-20 bg-[#0d1117]/80 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-6 lg:px-8 shrink-0 sticky top-0 z-50">
      
      {/* Mobile Menu Button (Visible only on small screens) */}
      <button 
        onClick={onMenuClick}
        className="md:hidden text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
      >
        <Menu size={24} />
      </button>

      {/* Global Search */}
      <div className="hidden md:flex relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text" 
          placeholder="Search scholarships, providers, or skills..." 
          className="w-full bg-[#161b22] border border-slate-700/50 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#06d6a0] focus:ring-1 focus:ring-[#06d6a0] transition-all"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 ml-auto md:ml-0">
        
        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-[#06d6a0] transition-colors rounded-full hover:bg-slate-800">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f72585] rounded-full ring-2 ring-[#0d1117]"></span>
        </button>

        <div className="w-px h-8 bg-slate-800 mx-2 hidden sm:block"></div>

        {/* User Profile Dropdown Placeholder */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-semibold text-white leading-none">{user?.name}</div>
            <div className="text-xs text-[#06d6a0] capitalize mt-1">{user?.role}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06d6a0] to-[#4cc9f0] flex items-center justify-center text-[#06080f] font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Logout (Simple button for now) */}
        <button 
          onClick={handleLogout}
          className="ml-2 p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>

      </div>
    </header>
  );
}
