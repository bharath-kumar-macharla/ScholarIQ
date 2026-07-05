import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Loader2, Plus, Users, Clock, Edit, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function ManageScholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await api.get('/providers/scholarships');
        setScholarships(res.data.scholarships);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#06d6a0]" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">Manage Scholarships</h1>
          <p className="text-slate-400">View and edit your organization's active scholarship programs.</p>
        </div>
        <Link to="/provider/scholarships/new" className="px-5 py-2.5 bg-gradient-to-r from-[#06d6a0] to-[#4cc9f0] text-[#06080f] font-bold rounded-lg flex items-center gap-2 hover:shadow-[0_0_15px_rgba(6,214,160,0.4)] transition-all">
          <Plus size={18} /> Create Scholarship
        </Link>
      </div>

      <div className="bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0d1117] border-b border-slate-700/50 text-slate-400 text-sm">
                <th className="p-4 font-medium">Scholarship Name</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Applicants</th>
                <th className="p-4 font-medium">Deadline</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scholarships.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No scholarships created yet. Click "Create Scholarship" to get started.
                  </td>
                </tr>
              ) : (
                scholarships.map(scholarship => (
                  <tr key={scholarship._id} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors group">
                    <td className="p-4">
                      <div className="font-semibold text-white group-hover:text-[#06d6a0] transition-colors">{scholarship.name}</div>
                      <div className="text-xs text-slate-500">{scholarship.category}</div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
                        scholarship.status === 'active' ? "bg-[#06d6a0]/10 text-[#06d6a0] border border-[#06d6a0]/20" :
                        scholarship.status === 'draft' ? "bg-slate-800 text-slate-300 border border-slate-600" :
                        "bg-[#f72585]/10 text-[#f72585] border border-[#f72585]/20"
                      )}>
                        {scholarship.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">
                      ${scholarship.amount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Users size={14} className="text-slate-500" />
                        {scholarship.currentApplicants} {scholarship.maxApplicants > 0 && `/ ${scholarship.maxApplicants}`}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Clock size={14} className="text-slate-500" />
                        {new Date(scholarship.deadline).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-white transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
