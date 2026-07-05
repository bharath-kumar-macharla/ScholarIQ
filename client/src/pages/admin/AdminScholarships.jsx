import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Loader2, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AdminScholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const res = await api.get('/admin/scholarships');
      setScholarships(res.data.scholarships);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (id, currentStatus) => {
    try {
      await api.put(`/admin/scholarships/${id}/approve`, { isApproved: !currentStatus });
      fetchScholarships();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteScholarship = async (id) => {
    if (!window.confirm('Delete this scholarship and all its applications?')) return;
    try {
      await api.delete(`/admin/scholarships/${id}`);
      fetchScholarships();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#06d6a0]" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">Platform Scholarships</h1>
        <p className="text-slate-400">Approve or reject scholarships created by providers.</p>
      </div>

      <div className="bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0d1117] border-b border-slate-700/50 text-slate-400 text-sm">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Provider</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Approval</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scholarships.map(scholarship => (
                <tr key={scholarship._id} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-white">{scholarship.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{scholarship.status} • {scholarship.category}</div>
                  </td>
                  <td className="p-4 text-slate-300 text-sm">
                    {scholarship.providerId?.name || 'Unknown'}
                  </td>
                  <td className="p-4 font-medium text-[#06d6a0]">
                    ${scholarship.amount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleApproval(scholarship._id, scholarship.isApproved)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors",
                        scholarship.isApproved ? "bg-[#06d6a0]/10 text-[#06d6a0] hover:bg-[#06d6a0]/20" : "bg-[#f72585]/10 text-[#f72585] hover:bg-[#f72585]/20"
                      )}
                    >
                      {scholarship.isApproved ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {scholarship.isApproved ? 'Approved' : 'Rejected'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => deleteScholarship(scholarship._id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
