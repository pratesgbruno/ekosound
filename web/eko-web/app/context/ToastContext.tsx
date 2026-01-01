"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Date.now();
        // Prevent duplicate messages in short succession (debounce)
        setToasts(prev => {
            if (prev.some(t => t.message === message && t.type === type)) return prev;
            return [...prev, { id, message, type }];
        });

        // Auto remove after 3s
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-[360px] pointer-events-none px-4">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-xl backdrop-blur-xl border border-white/40 animate-[slideDown_0.4s_cubic-bezier(0.16,1,0.3,1)]
                            ${toast.type === 'success' ? 'bg-[#dbece0]/95 text-[#1a3c34]' :
                                toast.type === 'error' ? 'bg-[#ebdcdb]/95 text-[#5c1a1a]' :
                                    'bg-white/90 text-[#1a3c34]'}`}
                    >
                        <div className="flex items-center gap-3">
                            {toast.type === 'success' && <CheckCircle size={20} className="stroke-[#5c7a64]" />}
                            {toast.type === 'error' && <AlertCircle size={20} className="stroke-[#9c6e6e]" />}
                            {toast.type === 'info' && <Info size={20} className="stroke-[#5c6b65]" />}
                            <span className="text-sm font-semibold leading-tight">{toast.message}</span>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 opacity-60 hover:opacity-100 hover:bg-black/5 rounded-full transition-all"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
}
