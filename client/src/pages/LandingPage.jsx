import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { ArrowRight, GraduationCap, Building2, Twitter, Linkedin, Instagram, Youtube, ChevronRight, Mail, Phone, MapPin, Sparkles, Send } from 'lucide-react';

export default function LandingPage() {
  const canvasRef = useRef(null);

  // Particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6,214,160,${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#06080f] text-white overflow-x-hidden">
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* ───────────────── NAVBAR ───────────────── */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-12 py-4 border-b border-slate-800/50 bg-[#06080f]/80 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#06d6a0] to-[#4cc9f0] flex items-center justify-center font-bold text-[#06080f] text-base">S</div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">ScholarIQ</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="flex items-center gap-2 px-5 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all text-sm font-medium"
          >
            <ArrowRight size={15} /> Sign In
          </Link>
          <Link
            to="/register"
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all text-sm font-semibold"
          >
            <GraduationCap size={15} /> Sign Up
          </Link>
        </div>
      </header>

      {/* ───────────────── HERO SECTION ───────────────── */}
      <main className="relative z-10 min-h-[calc(100vh-65px)] flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#06d6a0]/10 border border-[#06d6a0]/30 rounded-full text-[#06d6a0] text-xs font-semibold tracking-wide">
              <Sparkles size={14} />
              AI-Powered Scholarship Platform
            </div>

            <div className="space-y-3">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
                Discover<br />Opportunities.<br />
                Build Your{' '}
                <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                  Future.
                </span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                ScholarIQ connects students with the best scholarship opportunities and helps providers empower future leaders. Intelligent, efficient, and made for you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Student CTA */}
              <Link
                to="/register"
                className="group flex items-center gap-4 p-5 rounded-2xl border border-[#06d6a0]/30 bg-[#06d6a0]/5 hover:bg-[#06d6a0]/10 hover:border-[#06d6a0]/60 hover:shadow-[0_0_25px_rgba(6,214,160,0.1)] transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[#06d6a0]/15 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="text-[#06d6a0]" size={22} />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-white">I'm a Student</div>
                  <div className="text-slate-400 text-sm">Find and apply for scholarships</div>
                </div>
                <ArrowRight className="text-slate-500 group-hover:text-[#06d6a0] group-hover:translate-x-1 transition-all" size={18} />
              </Link>

              {/* Provider CTA */}
              <Link
                to="/register/provider"
                className="group flex items-center gap-4 p-5 rounded-2xl border border-[#7c3aed]/30 bg-[#7c3aed]/5 hover:bg-[#7c3aed]/10 hover:border-[#7c3aed]/60 hover:shadow-[0_0_25px_rgba(124,58,237,0.1)] transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[#7c3aed]/15 flex items-center justify-center flex-shrink-0">
                  <Building2 className="text-[#a855f7]" size={22} />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-white">I'm a Provider</div>
                  <div className="text-slate-400 text-sm">Create scholarships and manage applications</div>
                </div>
                <ArrowRight className="text-slate-500 group-hover:text-[#a855f7] group-hover:translate-x-1 transition-all" size={18} />
              </Link>
            </div>
          </div>

          {/* Right column — Dashboard Mockup */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Glow behind the card */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[480px] h-[320px] rounded-full bg-gradient-to-br from-[#7c3aed]/30 via-[#06d6a0]/20 to-transparent blur-3xl" />
            </div>

            <div className="relative w-full max-w-[580px] rounded-2xl border border-slate-700/60 bg-[#0d1117]/90 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Mock Window Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <div className="ml-3 flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#06d6a0] to-[#4cc9f0] flex items-center justify-center text-[#06080f] font-bold text-[9px]">S</div>
                  ScholarIQ
                </div>
              </div>

              <div className="flex">
                {/* Sidebar */}
                <div className="w-36 border-r border-slate-800 p-3 space-y-1">
                  {['Dashboard', 'Scholarships', 'Applications', 'Messages', 'Profile', 'Settings'].map((item, i) => (
                    <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${i === 0 ? 'bg-[#06d6a0]/10 text-[#06d6a0]' : 'text-slate-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#06d6a0]' : 'bg-slate-700'}`} />
                      {item}
                    </div>
                  ))}
                </div>

                {/* Dashboard Content */}
                <div className="flex-1 p-4 space-y-3">
                  <div className="text-sm font-semibold text-white">Welcome back, Arjun 👋</div>
                  <div className="text-xs text-slate-500 mb-3">Here's what's happening with your profile</div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Recommended', val: '24', color: 'text-[#06d6a0]', bg: 'bg-[#06d6a0]/10' },
                      { label: 'Applications', val: '8', color: 'text-[#a855f7]', bg: 'bg-[#a855f7]/10' },
                      { label: 'Shortlisted', val: '3', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                      { label: 'Awarded', val: '2', color: 'text-[#4cc9f0]', bg: 'bg-[#4cc9f0]/10' },
                    ].map(s => (
                      <div key={s.label} className={`${s.bg} rounded-xl p-2 text-center`}>
                        <div className={`text-lg font-bold ${s.color}`}>{s.val}</div>
                        <div className="text-[9px] text-slate-400">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Top Scholarships */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-medium text-slate-300">Top Scholarships for You</div>
                      <div className="text-[9px] text-[#06d6a0]">View All</div>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { name: 'AICTE Pragati Scholarship', amount: '₹50,000', match: '89%', deadline: 'Deadline: 20 May 2025' },
                        { name: 'Google Generation Scholarship', amount: '₹1,00,000', match: '92%', deadline: 'Deadline: 31 May 2025' },
                        { name: 'Reliance Foundation UG', amount: '₹60,000', match: '80%', deadline: 'Deadline: 15 Jun 2025' },
                      ].map(s => (
                        <div key={s.name} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-2 py-1.5">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#06d6a0] to-[#4cc9f0] flex items-center justify-center text-[#06080f] font-bold text-[8px] flex-shrink-0">G</div>
                          <div className="flex-1 ml-2">
                            <div className="text-[10px] font-medium text-white">{s.name}</div>
                            <div className="text-[8px] text-slate-500">{s.amount} · {s.deadline}</div>
                          </div>
                          <div className="text-[9px] font-bold text-[#06d6a0]">{s.match}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ───────────────── FOOTER ───────────────── */}
      <footer className="relative z-10 border-t border-slate-800/60 bg-[#06080f]/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#06d6a0] to-[#4cc9f0] flex items-center justify-center font-bold text-[#06080f] text-base">S</div>
                <span className="text-xl font-bold tracking-tight">ScholarIQ</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empowering students. Enabling providers.<br />Building a smarter scholarship ecosystem<br />for a brighter future.
              </p>
              <div className="flex items-center gap-3">
                {[Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 rounded-lg border border-slate-700 flex items-center justify-center text-slate-500 hover:text-white hover:border-slate-500 transition-colors">
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-5">Quick Links</h3>
              <ul className="space-y-3">
                {['About Us', 'How It Works', 'Scholarships', 'For Providers', 'FAQs', 'Contact Us'].map(item => (
                  <li key={item}>
                    <button className="flex items-center justify-between w-full text-slate-400 hover:text-white transition-colors text-sm group">
                      {item}
                      <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold mb-5">Resources</h3>
              <ul className="space-y-3">
                {['Blog', 'Success Stories', 'Guidelines', 'Help Center', 'Privacy Policy', 'Terms & Conditions'].map(item => (
                  <li key={item}>
                    <button className="flex items-center justify-between w-full text-slate-400 hover:text-white transition-colors text-sm group">
                      {item}
                      <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-5">Contact Us</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-400 text-sm">
                    <Mail size={14} className="text-[#06d6a0] flex-shrink-0" />
                    support@scholariq.com
                  </li>
                  <li className="flex items-center gap-3 text-slate-400 text-sm">
                    <Phone size={14} className="text-[#06d6a0] flex-shrink-0" />
                    +91 98765 43210
                  </li>
                  <li className="flex items-center gap-3 text-slate-400 text-sm">
                    <MapPin size={14} className="text-[#06d6a0] flex-shrink-0" />
                    Bengaluru, Karnataka, India
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Newsletter</h3>
                <p className="text-slate-500 text-xs mb-3">Stay updated with the latest scholarships and opportunities.</p>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-[#0d1117] border border-slate-700/50 rounded-lg py-2 px-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-[#06d6a0]"
                  />
                  <button className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-[#06d6a0] to-[#4cc9f0] rounded-lg text-[#06080f] hover:shadow-[0_0_15px_rgba(6,214,160,0.4)] transition-all flex-shrink-0">
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 mt-12 pt-6 text-center text-slate-500 text-sm">
            © 2025 ScholarIQ. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
