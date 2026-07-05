import { useState, useEffect } from 'react';
import api from '../../lib/api';
import StatsCard from '../../components/shared/StatsCard';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { FileText, Users, DollarSign, Activity, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/providers/dashboard');
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
          Provider Dashboard
        </h1>
        <p className="text-slate-400">Welcome back, {user?.name}. Here's an overview of your scholarship programs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Active Scholarships" 
          value={stats?.activeScholarships || 0}
          icon={Activity}
          color="primary"
        />
        <StatsCard 
          title="Total Applications" 
          value={stats?.totalApplications || 0}
          icon={Users}
          color="secondary"
        />
        <StatsCard 
          title="Pending Review" 
          value={stats?.pendingApplications || 0}
          icon={Clock}
          color="warning"
        />
        <StatsCard 
          title="Funds Distributed" 
          value={`$${(stats?.fundsDistributed || 0).toLocaleString()}`}
          icon={DollarSign}
          color="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Applications</h2>
            <Link to="/provider/applications" className="text-sm text-[#06d6a0] hover:text-[#4cc9f0]">View all</Link>
          </div>
          
          {stats?.recentApplications?.length > 0 ? (
            <div className="space-y-4">
              {stats.recentApplications.map(app => (
                <div key={app._id} className="flex items-center justify-between p-4 bg-[#0d1117] border border-slate-700 rounded-xl hover:border-slate-600 transition-colors">
                  <div>
                    <h4 className="font-semibold text-white">{app.studentId?.name}</h4>
                    <p className="text-xs text-slate-400">Applied for: {app.scholarshipId?.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">AI Match Score</div>
                      <div className="font-bold text-[#06d6a0]">{app.matchScore}%</div>
                    </div>
                    <Link to={`/provider/applications`} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-lg transition-colors">
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed border-slate-700/50 rounded-xl">
               <FileText className="text-slate-500 mb-2" size={32} />
               <p className="text-slate-400">No applications received yet.</p>
             </div>
          )}
        </div>

        <div className="bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#f72585]/10 rounded-bl-full pointer-events-none" />
           <h2 className="text-xl font-bold text-white mb-4 relative z-10">Quick Actions</h2>
           <div className="space-y-3 relative z-10">
             <Link to="/provider/scholarships/new" className="flex items-center gap-3 p-4 bg-[#0d1117] border border-slate-700 rounded-xl hover:border-[#06d6a0] hover:text-[#06d6a0] transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-[#06d6a0]/10 flex items-center justify-center group-hover:bg-[#06d6a0]/20">
                  <Activity size={20} className="text-[#06d6a0]" />
                </div>
                <div className="font-medium">Create New Scholarship</div>
             </Link>
             <Link to="/provider/scholarships" className="flex items-center gap-3 p-4 bg-[#0d1117] border border-slate-700 rounded-xl hover:border-[#4cc9f0] hover:text-[#4cc9f0] transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-[#4cc9f0]/10 flex items-center justify-center group-hover:bg-[#4cc9f0]/20">
                  <FileText size={20} className="text-[#4cc9f0]" />
                </div>
                <div className="font-medium">Manage Active Programs</div>
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
