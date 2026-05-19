import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent";

  if (type === 'kpi') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`bg-[#0A0A0A] border border-white/5 rounded-lg p-5 ${shimmer}`}>
            <div className="w-10 h-10 bg-white/5 rounded-md mb-3" />
            <div className="w-24 h-8 bg-white/5 rounded mb-2" />
            <div className="w-16 h-3 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`bg-[#0A0A0A] border border-white/5 rounded-lg p-6 ${shimmer}`}>
        <div className="w-40 h-5 bg-white/5 rounded mb-6" />
        <div className="h-[300px] flex items-end gap-2 px-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex-1 bg-white/5 rounded-t" style={{ height: `${20 + Math.random() * 60}%` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#0A0A0A] border border-white/5 rounded-lg p-6 ${shimmer}`}>
      <div className="w-32 h-5 bg-white/5 rounded mb-4" />
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-full h-4 bg-white/5 rounded" />
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
