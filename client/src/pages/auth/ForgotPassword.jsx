import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-slate-400 text-sm">Enter your email and we'll send you a link to reset your password</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}
      
      {message && (
        <div className="bg-[#06d6a0]/10 border border-[#06d6a0]/50 text-[#06d6a0] text-sm p-3 rounded-lg mb-6 text-center">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="email" 
              required
              className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#06d6a0] focus:ring-1 focus:ring-[#06d6a0] transition-colors"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !!message}
          className="w-full bg-gradient-to-r from-[#06d6a0] to-[#4cc9f0] text-[#06080f] font-semibold py-2.5 rounded-lg mt-6 hover:shadow-[0_0_20px_rgba(6,214,160,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <Link to="/login" className="text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2">
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </div>
    </div>
  );
}
