import { useState } from 'react';
import api from '../../lib/api';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import TagInput from '../../components/shared/TagInput';

export default function CreateScholarship() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    deadline: '',
    category: 'Merit-based',
    eligibility: {
      minGPA: 0,
      skills: [],
      categories: [],
      requiresInternship: false,
      requiresHackathon: false
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        publishNow: true
      };
      
      await api.post('/providers/scholarships', payload);
      navigate('/provider/scholarships');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create scholarship');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Link to="/provider/scholarships" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={16} /> Back to Scholarships
      </Link>
      
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">Create New Scholarship</h1>
        <p className="text-slate-400">Fill out the details below. Our AI engine will automatically match this with eligible students.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 lg:p-8 space-y-8">
        
        {/* Basic Info */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Scholarship Title <span className="text-red-500">*</span></label>
              <input required type="text" className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-[#06d6a0] focus:ring-1 focus:ring-[#06d6a0]"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Future Tech Leaders Grant" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea required rows={4} className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-[#06d6a0] focus:ring-1 focus:ring-[#06d6a0]"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the purpose of this scholarship..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Amount (USD) <span className="text-red-500">*</span></label>
              <input required type="number" min="1" className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-[#06d6a0] focus:ring-1 focus:ring-[#06d6a0]"
                value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="5000" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Deadline <span className="text-red-500">*</span></label>
              <input required type="date" className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-[#06d6a0] focus:ring-1 focus:ring-[#06d6a0]"
                value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
              <select className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-[#06d6a0] focus:ring-1 focus:ring-[#06d6a0] appearance-none"
                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="Merit-based">Merit-based</option>
                <option value="Need-based">Need-based</option>
                <option value="Research">Research</option>
                <option value="Achievement-based">Achievement-based</option>
              </select>
            </div>
          </div>
        </section>

        {/* Eligibility AI Engine */}
        <section className="space-y-4">
          <div className="mb-4">
             <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
               AI Match Criteria
             </h2>
             <p className="text-xs text-slate-500 mt-1">These fields power the AI matching engine to find your ideal candidates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Minimum GPA Requirement</label>
              <input type="number" step="0.1" min="0" max="4.0" className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-[#06d6a0] focus:ring-1 focus:ring-[#06d6a0]"
                value={formData.eligibility.minGPA} onChange={e => setFormData({...formData, eligibility: {...formData.eligibility, minGPA: e.target.value}})} placeholder="0.0 for no requirement" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Required Technical Skills</label>
              <TagInput tags={formData.eligibility.skills} setTags={t => setFormData({...formData, eligibility: {...formData.eligibility, skills: t}})} placeholder="e.g. Python, React" />
            </div>

            <div className="md:col-span-2 flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.eligibility.requiresInternship} onChange={e => setFormData({...formData, eligibility: {...formData.eligibility, requiresInternship: e.target.checked}})} className="rounded border-slate-700 text-[#06d6a0] focus:ring-[#06d6a0] bg-[#0d1117]" />
                <span className="text-sm text-slate-300">Requires Prior Internship</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.eligibility.requiresHackathon} onChange={e => setFormData({...formData, eligibility: {...formData.eligibility, requiresHackathon: e.target.checked}})} className="rounded border-slate-700 text-[#06d6a0] focus:ring-[#06d6a0] bg-[#0d1117]" />
                <span className="text-sm text-slate-300">Requires Hackathon Exp.</span>
              </label>
            </div>
          </div>
        </section>

        {error && <div className="text-red-400 text-sm font-medium">{error}</div>}

        <div className="pt-6 border-t border-slate-800 flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-[#06d6a0] to-[#4cc9f0] text-[#06080f] font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(6,214,160,0.4)] transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Publish Scholarship
          </button>
        </div>

      </form>
    </div>
  );
}
