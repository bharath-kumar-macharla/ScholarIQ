import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../lib/api';
import { Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const navigate = useNavigate();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Resend Timer State
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Resend Timer Logic
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    // Only accept numbers
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Keep only the last character entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace back-navigation
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    
    // Check if pasted value is numeric and is 6 digits
    if (/^\d{6}$/.test(pasteData)) {
      const pasteArray = pasteData.split('');
      setOtp(pasteArray);
      // Focus the last input box
      inputRefs[5].current.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp: otpCode });
      setSuccess(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setError('');
    setSuccess('');
    setResending(true);
    try {
      const res = await api.post('/auth/resend-otp', { email });
      setSuccess(res.data.message);
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Verify Your Account</h1>
        <p className="text-slate-400 text-sm">
          We sent a 6-digit OTP code to <br />
          <span className="text-[#06d6a0] font-semibold">{email}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-sm p-3 rounded-lg mb-6 text-center">
          {success}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        {/* OTP Input Boxes */}
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 bg-[#0d1117] border border-slate-700/50 rounded-xl text-center text-xl font-bold text-[#06d6a0] focus:outline-none focus:border-[#06d6a0] focus:ring-1 focus:ring-[#06d6a0] transition-colors"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#06d6a0] to-[#4cc9f0] text-[#06080f] font-semibold py-2.5 rounded-lg hover:shadow-[0_0_20px_rgba(6,214,160,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify Account'}
        </button>
      </form>

      {/* Resend Logic */}
      <div className="mt-8 text-center">
        <button
          onClick={handleResend}
          disabled={!canResend || resending}
          className={cn(
            "inline-flex items-center gap-2 text-sm font-medium transition-colors focus:outline-none",
            canResend 
              ? "text-[#06d6a0] hover:text-[#4cc9f0] cursor-pointer" 
              : "text-slate-600 cursor-not-allowed"
          )}
        >
          {resending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          {canResend ? 'Resend Verification Code' : `Resend code in ${timer}s`}
        </button>
      </div>

      <div className="mt-6 text-center text-xs">
        <button 
          onClick={() => navigate('/login')}
          className="text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={12} /> Back to Sign In
        </button>
      </div>
    </div>
  );
}
