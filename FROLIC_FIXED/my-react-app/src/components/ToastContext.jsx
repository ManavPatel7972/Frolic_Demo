import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="pointer-events-auto min-w-[300px] glass-dark border border-white/10 p-5 rounded-3xl shadow-2xl animate-in slide-in-from-right-10 fade-in duration-300 flex items-center gap-4 group"
                    >
                        <div className={`p-2 rounded-2xl ${toast.type === 'success' ? 'bg-green-500/10 text-green-500' :
                            toast.type === 'error' ? 'bg-red-500/10 text-red-500' :
                                'bg-primary/10 text-primary'
                            }`}>
                            {toast.type === 'success' && <CheckCircle size={24} />}
                            {toast.type === 'error' && <AlertCircle size={24} />}
                            {toast.type === 'info' && <Info size={24} />}
                        </div>

                        <div className="flex-grow">
                            <p className="text-white font-medium text-sm">{toast.message}</p>
                        </div>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-500 hover:text-white transition-colors p-1"
                        >
                            <X size={18} />
                        </button>

                        {/* Progress Bar Animation */}
                        <div className="absolute bottom-0 left-0 h-1 bg-primary rounded-full transition-all duration-[4000ms] ease-linear w-full origin-left scale-x-0 group-hover:scale-x-100" />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};
