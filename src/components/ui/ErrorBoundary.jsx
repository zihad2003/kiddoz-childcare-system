import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught Error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100">
                        <div className="bg-red-50 p-6 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                                <AlertTriangle size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h2>
                            <p className="text-slate-500">
                                We encountered an unexpected error. Our team has been notified.
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-slate-100 p-4 rounded-lg overflow-auto max-h-40 text-xs font-mono text-slate-600 border border-slate-200">
                                {this.state.error && this.state.error.toString()}
                            </div>

                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={18} />
                                Reload Application
                            </button>

                            <button
                                onClick={() => {
                                    this.setState({ hasError: false });
                                    window.location.href = '/';
                                }}
                                className="w-full py-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                            >
                                Go to Homepage
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
