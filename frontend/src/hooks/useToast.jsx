import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start p-4 rounded-xl border shadow-lg animate-slide-up transform transition-all duration-300 ${
              t.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : t.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : t.type === 'warning'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}
          >
            {/* Icon */}
            <div className="flex-shrink-0 mr-3 mt-0.5">
              {t.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
            </div>

            {/* Content */}
            <div className="flex-1 text-sm font-medium pr-2">{t.message}</div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-lg hover:bg-black/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
