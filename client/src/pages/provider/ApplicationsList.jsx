import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Loader2, Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ApplicationsList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, reviewing, approved, rejected

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/providers/applications');
      setApplications(res.data.applications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/providers/applications/${id}/status`, { status: newStatus });
      fetchApplications(); // Refresh list to reflect new state
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filteredApps = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#06d6a0]" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">Review Applications</h1>
          <p className="text-slate-400">Applications are automatically sorted by ScholarIQ AI Match Score.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="text-slate-500" size={18} />
          <select 
            className="bg-[#161b22] border border-slate-700/50 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-[#06d6a0]"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="text-center py-16 bg-[#161b22]/80 border border-slate-700/50 rounded-2xl">
            <p className="text-slate-400">No applications found for the selected filter.</p>
          </div>
        ) : (
          filteredApps.map((app, index) => (
            <div key={app._id} className="bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative overflow-hidden">
              
              {/* Highlight top match */}
              {index === 0 && filter === 'all' && (
                 <div className="absolute top-0 right-0 bg-[#06d6a0] text-[#06080f] text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                   Top Candidate
                 </div>
              )}

              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full border-4 border-[#06d6a0]/30 flex flex-col items-center justify-center bg-[#0d1117] relative">
                   <div className="text-xl font-bold text-[#06d6a0]">{app.matchScore}%</div>
                   <div className="text-[10px] text-slate-500 uppercase font-medium">Match</div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white">{app.studentId?.name}</h3>
                  <div className="text-sm text-slate-400 mb-2">{app.studentId?.email}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700">
                      Applied for: <span className="font-semibold text-white">{app.scholarshipId?.name}</span>
                    </span>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-md border capitalize font-semibold flex items-center gap-1",
                      app.status === 'pending' ? 'bg-slate-800 border-slate-600 text-slate-300' :
                      app.status === 'approved' ? 'bg-[#06d6a0]/10 border-[#06d6a0]/30 text-[#06d6a0]' :
                      app.status === 'rejected' ? 'bg-[#f72585]/10 border-[#f72585]/30 text-[#f72585]' :
                      'bg-[#4cc9f0]/10 border-[#4cc9f0]/30 text-[#4cc9f0]'
                    )}>
                      {app.status === 'pending' && <Clock size={12} />}
                      {app.status === 'approved' && <CheckCircle size={12} />}
                      {app.status === 'rejected' && <XCircle size={12} />}
                      {app.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                {app.status === 'pending' && (
                  <button onClick={() => updateStatus(app._id, 'reviewing')} className="flex-1 md:flex-none px-4 py-2 bg-[#4cc9f0]/10 text-[#4cc9f0] border border-[#4cc9f0]/30 hover:bg-[#4cc9f0]/20 rounded-xl text-sm font-medium transition-colors">
                    Start Review
                  </button>
                )}
                {(app.status === 'pending' || app.status === 'reviewing') && (
                  <>
                    <button onClick={() => updateStatus(app._id, 'approved')} className="flex-1 md:flex-none px-4 py-2 bg-[#06d6a0]/10 text-[#06d6a0] border border-[#06d6a0]/30 hover:bg-[#06d6a0]/20 rounded-xl text-sm font-medium transition-colors">
                      Approve
                    </button>
                    <button onClick={() => updateStatus(app._id, 'rejected')} className="flex-1 md:flex-none px-4 py-2 bg-[#f72585]/10 text-[#f72585] border border-[#f72585]/30 hover:bg-[#f72585]/20 rounded-xl text-sm font-medium transition-colors">
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
