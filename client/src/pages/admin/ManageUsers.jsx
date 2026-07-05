import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Loader2, Trash2, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#06d6a0]" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">Manage Users</h1>
        <p className="text-slate-400">View and manage all accounts on the platform.</p>
      </div>

      <div className="bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0d1117] border-b border-slate-700/50 text-slate-400 text-sm">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-medium text-white">{user.name} {user.role === 'admin' && <Shield size={14} className="inline text-[#f72585] ml-1" />}</td>
                  <td className="p-4 text-slate-400">{user.email}</td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
                      user.role === 'student' ? 'bg-[#06d6a0]/10 text-[#06d6a0] border border-[#06d6a0]/20' : 
                      user.role === 'provider' ? 'bg-[#4cc9f0]/10 text-[#4cc9f0] border border-[#4cc9f0]/20' : 
                      'bg-[#f72585]/10 text-[#f72585] border border-[#f72585]/20'
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    {user.role !== 'admin' && (
                      <button onClick={() => deleteUser(user._id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    )}
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
