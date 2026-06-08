import React from 'react';
import { useRoute } from '../hooks/useRoute';
import { Sparkles, LayoutDashboard, FileText } from 'lucide-react';

export const Navbar = () => {
  const [currentRoute, navigate] = useRoute();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary to-blue-500 text-white shadow-md shadow-brand-primary/25 transition-transform group-hover:scale-105">
              <Sparkles className="h-5.5 w-5.5 animate-pulse-subtle" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                Vitto
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-brand-primary uppercase mt-0.5">
                FinTech Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentRoute === '/'
                  ? 'bg-blue-50 text-brand-primary shadow-sm shadow-brand-primary/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Apply for Loan</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentRoute === '/dashboard'
                  ? 'bg-blue-50 text-brand-primary shadow-sm shadow-brand-primary/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
