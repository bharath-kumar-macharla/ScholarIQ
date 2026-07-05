import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import StatsCard from '../../components/shared/StatsCard';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Target, 
  Bookmark, 
  Calendar,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/students/dashboard');
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">
            Welcome back, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-400">Here's your personalized scholarship intelligence for today.</p>
        </div>
        
        {data?.completionPercentage < 100 && (
          <Link to="/profile" className="flex items-center gap-2 px-4 py-2 bg-[#0d1117] border border-slate-700 hover:border-[#06d6a0] hover:text-[#06d6a0] rounded-xl transition-all text-sm font-medium">
            Complete your profile <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="AI Match Score" 
          value={`${data?.aiScore || 0}/100`}
          icon={Sparkles}
          color="primary"
          delay={0.1}
        />
        <StatsCard 
          title="Profile Completion" 
          value={`${data?.completionPercentage || 0}%`}
          icon={Target}
          color="secondary"
          delay={0.2}
        />
        <StatsCard 
          title="Saved Scholarships" 
          value={data?.stats?.savedCount || 0}
          icon={Bookmark}
          color="accent"
          delay={0.3}
        />
        <StatsCard 
          title="Upcoming Deadlines" 
          value={data?.stats?.upcomingDeadlines || 0}
          icon={Calendar}
          color="warning"
          delay={0.4}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Panel (Left) */}
        <div className="lg:col-span-2 bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="text-[#ffd166]" size={20} />
              Top Recommended Scholarships
            </h2>
            <Link to="/scholarships" className="text-sm text-[#06d6a0] hover:text-[#4cc9f0] transition-colors">View all</Link>
          </div>
          
          <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-slate-700/50 rounded-xl">
            {data?.completionPercentage < 50 ? (
              <>
                <Target className="text-slate-500 mb-3" size={32} />
                <h3 className="text-slate-300 font-medium mb-1">We need more information</h3>
                <p className="text-slate-500 text-sm max-w-sm mb-4">Complete your profile to unlock personalized AI-driven scholarship matches.</p>
                <Link to="/profile" className="px-5 py-2 bg-gradient-to-r from-[#06d6a0] to-[#4cc9f0] text-[#06080f] font-semibold rounded-lg hover:shadow-[0_0_15px_rgba(6,214,160,0.4)] transition-all">
                  Build Profile
                </Link>
              </>
            ) : (
              <>
                <Sparkles className="text-slate-500 mb-3" size={32} />
                <h3 className="text-slate-300 font-medium mb-1">No matches found yet</h3>
                <p className="text-slate-500 text-sm max-w-sm">We're updating our database. Check back soon for new opportunities matching your profile.</p>
              </>
            )}
          </div>
        </div>

        {/* Side Panel (Right) - AI Insights */}
        <div className="bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden">
          {/* Subtle gradient bg */}
          <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-[#f72585]/10 to-transparent pointer-events-none" />
          
          <h2 className="text-lg font-bold text-white mb-6 relative z-10 flex items-center gap-2">
            <Sparkles className="text-[#f72585]" size={20} />
            AI Advisor Insights
          </h2>

          <div className="space-y-4 relative z-10">
            <div className="p-4 bg-[#0d1117] border border-slate-700/50 rounded-xl">
              <div className="text-sm font-semibold text-[#06d6a0] mb-1">Profile Strength</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {data?.completionPercentage > 70 
                  ? "Your profile is highly detailed! Consider adding more specific skills to target niche tech scholarships." 
                  : "Adding your academic history and extracurriculars will significantly improve your match rate."}
              </p>
            </div>
            
            <div className="p-4 bg-[#0d1117] border border-slate-700/50 rounded-xl">
              <div className="text-sm font-semibold text-[#4cc9f0] mb-1">Next Best Action</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {data?.completionPercentage < 100 ? "Complete the 'Experience' section of your profile." : "Start applying to your top 3 recommended scholarships before their deadlines."}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
