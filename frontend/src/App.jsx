import React from 'react';
import { useRoute } from './hooks/useRoute';
import Navbar from './layouts/Navbar';
import ApplyPage from './pages/ApplyPage';
import DashboardPage from './pages/DashboardPage';
import { ToastProvider } from './hooks/useToast';

function App() {
  const [route] = useRoute();

  // Simple and highly effective path-based page switching
  const renderPage = () => {
    switch (route) {
      case '/':
        return <ApplyPage />;
      case '/dashboard':
        return <DashboardPage />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">404</h1>
            <p className="text-slate-500 mb-6">The page you are looking for does not exist.</p>
            <a 
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new Event('pushstate-change'));
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              Go to Form
            </a>
          </div>
        );
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-brand-bg flex flex-col">
        {/* Navigation Header */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-1 pb-16">
          {renderPage()}
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;
