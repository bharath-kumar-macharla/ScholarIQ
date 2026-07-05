import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../lib/api';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify/${token}`);
        setMessage(res.data.message);
        setStatus('success');
      } catch (err) {
        setMessage(err.response?.data?.error || 'Verification failed');
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="text-center py-8">
      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 size={48} className="animate-spin text-[#06d6a0]" />
          <h2 className="text-xl font-semibold text-white">Verifying your email...</h2>
          <p className="text-slate-400">Please wait while we confirm your account.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#06d6a0]/20 flex items-center justify-center mb-2">
            <CheckCircle size={32} className="text-[#06d6a0]" />
          </div>
          <h2 className="text-xl font-semibold text-white">Email Verified!</h2>
          <p className="text-slate-400 mb-6">{message}</p>
          <Link to="/login" className="px-6 py-2.5 bg-gradient-to-r from-[#06d6a0] to-[#4cc9f0] text-[#06080f] font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(6,214,160,0.4)] transition-all">
            Continue to Login
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
            <XCircle size={32} className="text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Verification Failed</h2>
          <p className="text-slate-400 mb-6">{message}</p>
          <Link to="/login" className="px-6 py-2.5 bg-[#161b22] border border-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all">
            Back to Login
          </Link>
        </div>
      )}
    </div>
  );
}
