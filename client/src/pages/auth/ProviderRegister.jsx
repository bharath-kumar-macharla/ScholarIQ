import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Mail, Lock, User, Building2 } from 'lucide-react';

export default function ProviderRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register({ name, email, password, orgName }, true);
      setSuccess('Registration successful! Redirecting to Provider Dashboard...');
      setTimeout(() => navigate('/provider/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register as provider');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-block px-3 py-1 bg-[#4cc9f0]/10 border border-[#4cc9f0]/30 rounded-full text-[#4cc9f0] text-xs font-semibold mb-4 tracking-wide">ORGANIZATION REGISTRATION</div>
        <h1 className="text-2xl font-bold text-white mb-2">Partner with ScholarIQ</h1>
        <p className="text-slate-400 text-sm">Create an account to manage your scholarships</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-[#06d6a0]/10 border border-[#06d6a0]/50 text-[#06d6a0] text-sm p-3 rounded-lg mb-6 text-center">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Organization Name</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              required
              className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#4cc9f0] focus:ring-1 focus:ring-[#4cc9f0] transition-colors"
              placeholder="Foundation Name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Your Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              required
              className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#4cc9f0] focus:ring-1 focus:ring-[#4cc9f0] transition-colors"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Work Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="email" 
              required
              className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#4cc9f0] focus:ring-1 focus:ring-[#4cc9f0] transition-colors"
              placeholder="jane@foundation.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="password" 
              required minLength={6}
              className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#4cc9f0] focus:ring-1 focus:ring-[#4cc9f0] transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !!success}
          className="w-full bg-gradient-to-r from-[#4cc9f0] to-[#f72585] text-white font-semibold py-2.5 rounded-lg mt-6 hover:shadow-[0_0_20px_rgba(76,201,240,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Register Organization'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-[#4cc9f0] hover:text-[#f72585] font-medium transition-colors">Sign in</Link>
      </div>
    </div>
  );
}
