import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleCallback = async (response) => {
    setError('');
    setLoading(true);
    try {
      const decoded = decodeJwt(response.credential);
      if (!decoded) throw new Error("Failed to decode token");
      
      const res = await googleLogin({
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        avatar: decoded.picture,
        role: 'student' // Default role for Google SSO
      });
      
      if (res.user.role === 'provider') navigate('/provider/dashboard');
      else if (res.user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Google Login failed');
    } finally {
      setLoading(false);
    }
  };

  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: "906854398851-dtlbovssr8re6s0m2skkfmdtkopkinu8.apps.googleusercontent.com",
        callback: handleGoogleCallback,
      });
      google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "dark", size: "large", type: "standard", shape: "rectangular", text: "signin_with", logo_alignment: "left" }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.user.role === 'provider') navigate('/provider/dashboard');
      else if (res.user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-slate-400 text-sm">Sign in to continue to ScholarIQ</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
          {error}
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

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <Link to="/forgot-password" className="text-xs text-[#06d6a0] hover:text-[#4cc9f0] transition-colors">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="password" 
              required
              className="w-full bg-[#0d1117] border border-slate-700/50 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#06d6a0] focus:ring-1 focus:ring-[#06d6a0] transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#06d6a0] to-[#4cc9f0] text-[#06080f] font-semibold py-2.5 rounded-lg mt-6 hover:shadow-[0_0_20px_rgba(6,214,160,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 flex items-center">
        <div className="flex-1 border-t border-slate-700/50"></div>
        <span className="px-3 text-xs text-slate-500">OR</span>
        <div className="flex-1 border-t border-slate-700/50"></div>
      </div>

      <div className="mt-6 flex justify-center">
        <div id="google-signin-btn"></div>
      </div>

      <div className="mt-8 text-center text-sm text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#06d6a0] hover:text-[#4cc9f0] font-medium transition-colors">Sign up as Student</Link>
        <div className="mt-2">
          <Link to="/register/provider" className="text-slate-500 hover:text-slate-300 transition-colors text-xs border-b border-dashed border-slate-600 pb-0.5">Register as a Scholarship Provider</Link>
        </div>
      </div>
    </div>
  );
}
