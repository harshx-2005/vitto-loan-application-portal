import React from 'react';
import { SearchX, Inbox } from 'lucide-react';

export const EmptyState = ({ 
  title = 'No applications found', 
  description = 'There are no loan applications submitted that match your selection.',
  isSearch = false,
  actionButton = null 
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-2xl border border-slate-200/80 shadow-premium max-w-lg mx-auto my-6 animate-fade-in">
      <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-50 text-brand-primary mb-5 shadow-sm shadow-blue-100">
        {isSearch ? (
          <SearchX className="h-8 w-8 text-brand-primary/80" />
        ) : (
          <Inbox className="h-8 w-8 text-brand-primary/80" />
        )}
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionButton}
    </div>
  );
};

export default EmptyState;
