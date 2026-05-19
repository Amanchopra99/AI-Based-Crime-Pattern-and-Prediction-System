import React from 'react';
import { motion } from 'framer-motion';

const KPICard = ({ icon: Icon, label, value, trend, trendDirection = 'up', color = '#00F0FF', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.01, y: -2, transition: { type: 'spring', stiffness: 300 } }}
      className="relative overflow-hidden bg-[#0A0A0A] border border-white/5 rounded-lg p-5
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]"
      data-testid={`kpi-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-md" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} strokeWidth={2} />
        </div>
        {trend && (
          <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded ${
            trendDirection === 'up' ? 'bg-[#34C759]/15 text-[#34C759]' : 'bg-[#FF3B30]/15 text-[#FF3B30]'
          }`}>
            {trendDirection === 'up' ? '+' : ''}{trend}
          </span>
        )}
      </div>
      <div className="text-3xl sm:text-4xl font-mono tracking-tighter text-white font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-xs font-medium uppercase tracking-[0.1em] text-[#52525B] mt-1" style={{ fontFamily: "'Manrope', sans-serif" }}>
        {label}
      </div>
      {/* Subtle glow line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
    </motion.div>
  );
};

export default KPICard;
