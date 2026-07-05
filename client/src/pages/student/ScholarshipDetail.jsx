import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/api';
import { Loader2, ArrowLeft, Bookmark, CheckCircle, Clock, Building, DollarSign, Send } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ScholarshipDetail() {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/scholarships/${id}`);
        setScholarship(res.data.scholarship);
        setIsSaved(res.data.scholarship.isSaved);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleSave = async () => {
    try {
      const res = await api.post(`/scholarships/${id}/save`);
      setIsSaved(res.data.isSaved);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post(`/scholarships/${id}/apply`);
      setScholarship({ ...scholarship, hasApplied: true, applicationStatus: 'pending' });
      setApplyMessage('Application submitted successfully!');
    } catch (err) {
      setApplyMessage(err.response?.data?.error || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#06d6a0]" size={40} /></div>;
  if (!scholarship) return <div className="text-center py-20 text-white">Scholarship not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Link to="/scholarships" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={16} /> Back to Scholarships
      </Link>

      <div className="bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 md:p-10 relative overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#06d6a0]/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between gap-6 items-start relative z-10">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
              <Building size={16} />
              <span>{scholarship.providerId?.orgName || 'ScholarIQ Partner'}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600 mx-1"></span>
              <span>{scholarship.category}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">{scholarship.name}</h1>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#06d6a0]/10 border border-[#06d6a0]/30 rounded-xl text-[#06d6a0]">
                <DollarSign size={20} />
                <span className="font-bold text-lg">${scholarship.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300">
                <Clock size={18} />
                <span className="font-medium">Due {new Date(scholarship.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex md:flex-col gap-3 w-full md:w-auto">
            <button 
              onClick={handleSave}
              className={cn("px-6 py-3 border rounded-xl flex items-center justify-center gap-2 font-medium transition-all flex-1 md:flex-none",
                isSaved ? "bg-[#f72585]/10 border-[#f72585]/50 text-[#f72585]" : "bg-[#0d1117] border-slate-700 text-slate-300 hover:bg-slate-800"
              )}
            >
              <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Saved' : 'Save'}
            </button>
            
            {scholarship.hasApplied ? (
              <div className="px-6 py-3 bg-[#06d6a0]/10 border border-[#06d6a0] rounded-xl flex items-center justify-center gap-2 font-medium text-[#06d6a0] flex-1 md:flex-none">
                <CheckCircle size={18} /> Applied ({scholarship.applicationStatus})
              </div>
            ) : (
              <button 
                onClick={handleApply}
                disabled={applying || !scholarship.isEligible}
                className="px-6 py-3 bg-gradient-to-r from-[#06d6a0] to-[#4cc9f0] text-[#06080f] rounded-xl flex items-center justify-center gap-2 font-bold hover:shadow-[0_0_20px_rgba(6,214,160,0.4)] transition-all flex-1 md:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applying ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                Apply Now
              </button>
            )}
          </div>
        </div>
        
        {applyMessage && <div className="mt-4 text-sm font-medium text-[#06d6a0]">{applyMessage}</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">About this Scholarship</h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{scholarship.description}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Your Match Score</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-[#06d6a0] flex items-center justify-center text-2xl font-bold text-white">
                {scholarship.matchScore}%
              </div>
              <div>
                <div className="text-slate-300 font-medium">{scholarship.isEligible ? 'Strong Match' : 'Not Eligible'}</div>
                <div className="text-xs text-slate-500">Based on your profile data</div>
              </div>
            </div>
            
            {scholarship.matchDetails && (
              <div className="space-y-3">
                {Object.entries(scholarship.matchDetails).map(([key, detail]) => (
                  <div key={key} className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 capitalize flex items-center gap-2">
                      {detail.achieved ? <CheckCircle size={14} className="text-[#06d6a0]" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="font-medium text-slate-300">{detail.points}/{detail.max} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
