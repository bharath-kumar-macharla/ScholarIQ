import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  UserCircle, 
  Search, 
  Bookmark, 
  Send,
  Settings,
  GraduationCap,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import logoImg from '../../assets/logo.jpg';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const studentLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile Builder', href: '/profile', icon: UserCircle },
    { name: 'Find Scholarships', href: '/scholarships', icon: Search },
    { name: 'Saved', href: '/saved', icon: Bookmark },
    { name: 'My Applications', href: '/applications', icon: Send },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const providerLinks = [
    { name: 'Dashboard', href: '/provider/dashboard', icon: LayoutDashboard },
    { name: 'Manage Scholarships', href: '/provider/scholarships', icon: Bookmark },
    { name: 'Applications', href: '/provider/applications', icon: Send },
    { name: 'Settings', href: '/provider/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: UserCircle },
    { name: 'Scholarships', href: '/admin/scholarships', icon: Bookmark },
  ];

  let links = studentLinks;
  if (user?.role === 'provider') links = providerLinks;
  if (user?.role === 'admin') links = adminLinks;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 md:hidden z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div 
        className={cn(
          "w-64 bg-[#0d1117] md:bg-[#0d1117]/80 backdrop-blur-xl border-r border-slate-800 flex flex-col h-full shrink-0 transition-transform duration-300 ease-in-out fixed md:static inset-y-0 left-0 z-50 md:translate-x-0 md:flex",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo & Close Button */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/50">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
            <img src={logoImg} alt="ScholarIQ Logo" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-xl font-bold font-heading tracking-tight text-white">ScholarIQ</span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm",
                  isActive 
                    ? "bg-[#06d6a0]/10 text-[#06d6a0] border border-[#06d6a0]/20 shadow-[0_0_15px_rgba(6,214,160,0.1)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                )}
              >
                <Icon size={18} className={cn(isActive ? "text-[#06d6a0]" : "text-slate-500")} />
                {link.name}
              </Link>
            );
          })}
        </div>
      
      {/* Bottom Ad / Info (Optional) */}
      <div className="p-4 mx-4 mb-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30 text-center">
        <div className="text-xs font-semibold text-slate-300 mb-1">ScholarIQ Premium</div>
        <p className="text-[10px] text-slate-500 mb-3 leading-tight">Unlock AI resume analysis and priority application processing.</p>
        <button className="text-xs bg-[#f72585] text-white px-3 py-1.5 rounded-lg w-full font-medium hover:bg-[#d31e70] transition-colors">
          Upgrade Now
        </button>
      </div>
      </div>
    </>
  );
}
