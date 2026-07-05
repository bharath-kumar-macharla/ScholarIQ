import { Outlet, Link } from 'react-router-dom';
import ParticleBackground from '../shared/ParticleBackground';
import { motion } from 'framer-motion';
import logoImg from '../../assets/logo.jpg';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#06080f] relative overflow-hidden text-slate-200">
      <ParticleBackground />
      
      {/* Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#06d6a0] rounded-full blur-[120px] opacity-20 pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#f72585] rounded-full blur-[120px] opacity-15 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="z-10 w-full max-w-md p-6">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImg} alt="ScholarIQ Logo" className="w-10 h-10 rounded-xl object-cover" />
            <span className="text-2xl font-bold font-heading tracking-tight text-white">ScholarIQ</span>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#161b22]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(6,214,160,0.1)] relative"
        >
          {/* Subtle top border gradient */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#06d6a0] to-transparent opacity-50" />
          
          <Outlet />
        </motion.div>
        
        <div className="text-center mt-8 text-sm text-slate-500">
          &copy; {new Date().getFullYear()} ScholarIQ. All rights reserved.
        </div>
      </div>
    </div>
  );
}
