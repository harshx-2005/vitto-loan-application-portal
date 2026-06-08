import React from 'react';

export const Card = ({ children, className = '', hoverEffect = false, ...props }) => {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-6 shadow-premium transition-all duration-300 ${
        hoverEffect ? 'hover:-translate-y-1 hover:shadow-lg hover:border-slate-300/80' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
