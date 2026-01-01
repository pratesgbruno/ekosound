"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f4f6f0] p-6 text-center">
                    <div className="w-20 h-20 bg-[#ebdcdb] rounded-full flex items-center justify-center mb-6 shadow-soft">
                        <AlertCircle size={40} className="text-[#a05e46]" />
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-[#1a3c34] mb-2">Ops, algo deu errado.</h2>
                    <p className="text-[#5c6b65] mb-8 max-w-xs">
                        Encontramos um erro inesperado. Tente recarregar a página para continuar sua experiência.
                    </p>

                    <button
                        onClick={this.handleReload}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1a3c34] text-white rounded-full font-medium shadow-lg active:scale-95 transition-all hover:bg-[#2a4c44]"
                    >
                        <RefreshCw size={18} />
                        Recarregar App
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
