import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#06080f] text-slate-200 flex overflow-hidden">
      {/* Sidebar (Responsive Overlay on Mobile, Fixed on Desktop) */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          {/* Subtle glow effect behind main content */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#06d6a0]/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
