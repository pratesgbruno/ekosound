"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

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

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 3s
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-[90%] pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center justify-between p-3 rounded-xl shadow-lg backdrop-blur-md border animate-[slideDown_0.3s_ease-out]
                            ${toast.type === 'success' ? 'bg-[#dbece0]/90 border-[#5c7a64]/20 text-[#5c7a64]' :
                                toast.type === 'error' ? 'bg-[#ebdcdb]/90 border-[#9c6e6e]/20 text-[#9c6e6e]' :
                                    'bg-white/90 border-stone-200 text-stone-600'}`}
                    >
                        <div className="flex items-center gap-2">
                            {toast.type === 'success' && <CheckCircle size={16} />}
                            {toast.type === 'error' && <AlertCircle size={16} />}
                            <span className="text-sm font-medium">{toast.message}</span>
                        </div>
                        <button onClick={() => removeToast(toast.id)} className="opacity-60 hover:opacity-100">
                            <X size={14} />
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
