import React from 'react';

export const Badge = ({ children, variant = 'info', className = '', ...props }) => {
  const styles = {
    // Status badges
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    
    // Default info/blue
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
    custom: '',
  };

  const selectedStyle = styles[variant] || styles.info;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors select-none ${selectedStyle} ${className}`}
      {...props}
    >
      {/* Small glowing bullet for status badges */}
      {['pending', 'approved', 'rejected'].includes(variant) && (
        <span className={`h-1.5 w-1.5 rounded-full ${
          variant === 'approved' ? 'bg-emerald-500 shadow-sm shadow-emerald-400' :
          variant === 'rejected' ? 'bg-rose-500 shadow-sm shadow-rose-400' :
          'bg-amber-500 shadow-sm shadow-amber-400'
        }`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
