import { Link } from 'react-router-dom';
import { Bookmark, Clock, Users, MapPin, Building, Target } from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { useState } from 'react';

export default function ScholarshipCard({ scholarship, onSaveToggle }) {
  const [isSaved, setIsSaved] = useState(scholarship.isSaved);
  
  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await api.post(`/scholarships/${scholarship._id}/save`);
      setIsSaved(res.data.isSaved);
      if (onSaveToggle) onSaveToggle(scholarship._id, res.data.isSaved);
    } catch (err) {
      console.error(err);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-[#06d6a0]';
    if (score >= 60) return 'text-[#4cc9f0]';
    if (score >= 40) return 'text-[#ffd166]';
    return 'text-[#f72585]';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <Link 
      to={`/scholarships/${scholarship._id}`}
      className="block bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 hover:border-[#06d6a0]/50 transition-all hover:shadow-[0_0_20px_rgba(6,214,160,0.1)] group relative"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-white text-lg group-hover:text-[#06d6a0] transition-colors">{scholarship.name}</h3>
          <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
            <Building size={14} />
            <span>{scholarship.providerId?.orgName || 'ScholarIQ Partner'}</span>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="p-2 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-400 hover:text-[#f72585] hover:border-[#f72585]/50 transition-colors z-10"
        >
          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} className={isSaved ? 'text-[#f72585]' : ''} />
        </button>
      </div>

      <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
        {scholarship.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        <span className="px-2.5 py-1 bg-[#06d6a0]/10 border border-[#06d6a0]/30 text-[#06d6a0] text-xs font-semibold rounded-md">
          {formatCurrency(scholarship.amount)}
        </span>
        <span className="px-2.5 py-1 bg-[#4cc9f0]/10 border border-[#4cc9f0]/30 text-[#4cc9f0] text-xs font-semibold rounded-md flex items-center gap-1">
          <Clock size={12} /> {new Date(scholarship.deadline).toLocaleDateString()}
        </span>
        <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-md">
          {scholarship.category}
        </span>
      </div>

      {scholarship.matchScore !== undefined && (
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={16} className={getScoreColor(scholarship.matchScore)} />
            <span className={cn("font-bold", getScoreColor(scholarship.matchScore))}>
              {scholarship.matchScore}% Match
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {scholarship.isEligible ? 'Eligible to apply' : 'Missing requirements'}
          </span>
        </div>
      )}
    </Link>
  );
}
