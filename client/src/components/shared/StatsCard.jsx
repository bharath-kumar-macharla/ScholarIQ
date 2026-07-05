import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function StatsCard({ title, value, icon: Icon, trend, trendValue, color = 'primary', delay = 0 }) {
  
  const colorMap = {
    primary: 'from-[#06d6a0]/20 to-transparent border-[#06d6a0]/30 text-[#06d6a0]',
    secondary: 'from-[#4cc9f0]/20 to-transparent border-[#4cc9f0]/30 text-[#4cc9f0]',
    accent: 'from-[#f72585]/20 to-transparent border-[#f72585]/30 text-[#f72585]',
    warning: 'from-[#ffd166]/20 to-transparent border-[#ffd166]/30 text-[#ffd166]',
  };

  const selectedColor = colorMap[color] || colorMap.primary;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-[#161b22]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-600 transition-colors"
    >
      {/* Background Glow */}
      <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl rounded-bl-full opacity-20 transition-opacity group-hover:opacity-40", selectedColor.split(' ')[0])} />

      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold font-heading text-white">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs">
              <span className={cn(
                "font-medium",
                trend === 'up' ? "text-[#06d6a0]" : trend === 'down' ? "text-[#f72585]" : "text-slate-400"
              )}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
              </span>
              <span className="text-slate-500">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-[#0d1117] border border-slate-700", selectedColor.split(' ')[2])}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
}
