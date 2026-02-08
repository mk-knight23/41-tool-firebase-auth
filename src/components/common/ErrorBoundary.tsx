import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ProtektMK Uncaught Error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-center">
                    <div className="max-w-md w-full glass-card rounded-[3rem] p-10 border border-red-500/20 shadow-2xl">
                        <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">System Error</h2>
                        <p className="text-slate-400 mb-6 font-medium">
                            The security protocol encountered an unexpected breach.
                            {this.state.error?.message && (
                                <code className="block mt-2 p-3 bg-white/5 rounded-2xl text-red-400 text-xs overflow-hidden text-ellipsis font-mono">
                                    {this.state.error.message}
                                </code>
                            )}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                        >
                            INITIALIZE RECOVERY
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
