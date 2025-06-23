import React from 'react';

export default function GlassCard({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white/60 dark:bg-[#181c23]/60 backdrop-blur-xl border border-border shadow-xl rounded-3xl transition-colors duration-500 hover:shadow-2xl focus-within:ring-2 focus-within:ring-primary outline-none ${className}`}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
} 