import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Loader2, Calendar, ChevronRight, FileText, Clock, XCircle, AlertCircle, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/students/applications');
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: { label: 'Pending', bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: Clock },
      reviewing: { label: 'Under Review', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Clock },
      shortlisted: { label: 'Shortlisted', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: AlertCircle },
      interview: { label: 'Interview Scheduled', bg: 'bg-[#4cc9f0]/10 text-[#4cc9f0] border-[#4cc9f0]/20', icon: Calendar },
      approved: { label: 'Awarded', bg: 'bg-[#06d6a0]/10 text-[#06d6a0] border-[#06d6a0]/20', icon: Award },
      rejected: { label: 'Rejected', bg: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle }
    };
    
    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    
    return (
      <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border", config.bg)}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  // Stats calculation
  const totalCount = applications.length;
  const underReviewCount = applications.filter(a => ['pending', 'reviewing'].includes(a.status)).length;
  const shortlistedCount = applications.filter(a => ['shortlisted', 'interview'].includes(a.status)).length;
  const awardedCount = applications.filter(a => a.status === 'approved').length;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#06d6a0]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">My Applications</h1>
        <p className="text-slate-400 text-sm">Track the status of all your scholarship applications.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Submitted', val: totalCount, color: 'text-white', bg: 'bg-slate-800/40 border-slate-700/40' },
          { label: 'Under Review', val: underReviewCount, color: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/10' },
          { label: 'Shortlisted / Interview', val: shortlistedCount, color: 'text-purple-400', bg: 'bg-purple-500/5 border-purple-500/10' },
          { label: 'Awarded 🏆', val: awardedCount, color: 'text-[#06d6a0]', bg: 'bg-[#06d6a0]/5 border-[#06d6a0]/10' },
        ].map((stat, i) => (
          <div key={i} className={cn("border rounded-xl p-5 backdrop-blur-xl relative overflow-hidden", stat.bg)}>
            <div className="text-2xl font-bold font-heading mb-1 text-white">{stat.val}</div>
            <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-[#0d1117]/40">
          <FileText className="text-slate-600 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-white mb-1">No Applications Found</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">You haven't submitted any scholarship applications yet. Search for active opportunities to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {applications.map((app) => (
            <div 
              key={app._id}
              onClick={() => setSelectedApp(app)}
              className="group border border-slate-800/60 hover:border-[#06d6a0]/40 bg-[#0d1117]/80 backdrop-blur-xl rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:shadow-[0_0_20px_rgba(6,214,160,0.05)] transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#06d6a0]/10 to-[#4cc9f0]/10 border border-[#06d6a0]/20 flex items-center justify-center text-[#06d6a0] font-bold text-lg flex-shrink-0">
                  {app.scholarshipId?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-[#06d6a0] transition-colors font-heading text-lg">
                    {app.scholarshipId?.name || 'Scholarship Opportunity'}
                  </h3>
                  <p className="text-sm text-slate-400 mb-1">
                    {app.scholarshipId?.providerId?.orgName || 'ScholarIQ Partner'}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>Amount: ₹{app.scholarshipId?.amount?.toLocaleString() || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800/50">
                {/* AI Match Score Badge */}
                <div className="text-left md:text-right">
                  <div className="text-xs text-slate-500 mb-0.5">AI Match Score</div>
                  <div className="text-sm font-bold text-[#06d6a0]">
                    {app.matchScore}% Match
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {getStatusBadge(app.status)}
                  <ChevronRight className="text-slate-500 group-hover:text-slate-300 transition-colors" size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-out Detail Drawer */}
      <AnimatePresence>
        {selectedApp && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="fixed inset-0 bg-black z-50 pointer-events-auto"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#0d1117] border-l border-slate-800 shadow-2xl z-50 overflow-y-auto p-6 md:p-8 flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex justify-between items-start border-b border-slate-800/60 pb-5">
                  <div>
                    <span className="text-xs font-semibold text-[#06d6a0] tracking-wider uppercase">Application Details</span>
                    <h2 className="text-2xl font-bold text-white mt-1 font-heading">{selectedApp.scholarshipId?.name}</h2>
                    <p className="text-slate-400 text-sm mt-0.5">{selectedApp.scholarshipId?.providerId?.orgName}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedApp(null)}
                    className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                  >
                    <XCircle size={20} />
                  </button>
                </div>

                {/* Score & Status Panel */}
                <div className="grid grid-cols-2 gap-4 bg-slate-800/20 border border-slate-800/60 rounded-xl p-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Status</div>
                    {getStatusBadge(selectedApp.status)}
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">AI Match Score</div>
                    <div className="text-lg font-bold text-[#06d6a0]">{selectedApp.matchScore}% Match</div>
                  </div>
                </div>

                {/* Custom Answers */}
                {selectedApp.answers && selectedApp.answers.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-slate-400">Application Answers</h3>
                    <div className="space-y-3">
                      {selectedApp.answers.map((ans, idx) => (
                        <div key={idx} className="bg-slate-800/10 border border-slate-800/40 rounded-lg p-3 space-y-1">
                          <div className="text-xs font-semibold text-slate-300">Q: {ans.question}</div>
                          <div className="text-sm text-slate-400">A: {ans.answer}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents List */}
                {selectedApp.documents && selectedApp.documents.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-slate-400">Submitted Documents</h3>
                    <div className="space-y-2">
                      {selectedApp.documents.map((doc, idx) => (
                        <a 
                          key={idx}
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between bg-slate-800/10 hover:bg-slate-800/20 border border-slate-800/40 rounded-lg p-3 group transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <FileText size={18} className="text-[#06d6a0]" />
                            <span className="text-sm text-slate-300 group-hover:text-[#06d6a0] transition-colors">{doc.name || doc.type}</span>
                          </div>
                          <ChevronRight size={16} className="text-slate-500" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-slate-800/60 pt-6 mt-8">
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
