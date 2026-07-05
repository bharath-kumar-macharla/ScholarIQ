import { useState, useEffect } from 'react';
import api from '../../lib/api';
import StatsCard from '../../components/shared/StatsCard';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { Users, GraduationCap, Building, DollarSign, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-slate-400">Platform overview and management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Students" 
          value={stats?.students || 0}
          icon={GraduationCap}
          color="primary"
        />
        <StatsCard 
          title="Total Providers" 
          value={stats?.providers || 0}
          icon={Building}
          color="secondary"
        />
        <StatsCard 
          title="Active Scholarships" 
          value={stats?.activeScholarships || 0}
          icon={Target}
          color="warning"
        />
        <StatsCard 
          title="Platform Funding" 
          value={`$${(stats?.totalFunding || 0).toLocaleString()}`}
          icon={DollarSign}
          color="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Registrations</h2>
            <Link to="/admin/users" className="text-sm text-[#06d6a0] hover:text-[#4cc9f0]">Manage Users</Link>
          </div>
          
          <div className="space-y-4">
            {stats?.recentUsers?.map(u => (
              <div key={u._id} className="flex items-center justify-between p-4 bg-[#0d1117] border border-slate-700 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{u.name}</h4>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${u.role === 'student' ? 'bg-[#06d6a0]/10 text-[#06d6a0]' : u.role === 'provider' ? 'bg-[#4cc9f0]/10 text-[#4cc9f0]' : 'bg-[#f72585]/10 text-[#f72585]'}`}>
                    {u.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6">
           <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
           <div className="space-y-3">
             <Link to="/admin/users" className="flex items-center gap-3 p-4 bg-[#0d1117] border border-slate-700 rounded-xl hover:border-[#06d6a0] transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-[#06d6a0]/10 flex items-center justify-center group-hover:bg-[#06d6a0]/20">
                  <Users size={20} className="text-[#06d6a0]" />
                </div>
                <div className="font-medium text-slate-200">Manage Users</div>
             </Link>
             <Link to="/admin/scholarships" className="flex items-center gap-3 p-4 bg-[#0d1117] border border-slate-700 rounded-xl hover:border-[#4cc9f0] transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-[#4cc9f0]/10 flex items-center justify-center group-hover:bg-[#4cc9f0]/20">
                  <Target size={20} className="text-[#4cc9f0]" />
                </div>
                <div className="font-medium text-slate-200">Review Scholarships</div>
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
