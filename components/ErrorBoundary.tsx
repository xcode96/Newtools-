import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="p-3 bg-red-50 rounded-full">
                 <AlertTriangle size={32} />
              </div>
              <h1 className="text-2xl font-bold">Something went wrong</h1>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200 overflow-auto max-h-48">
              <p className="font-mono text-sm text-red-600 font-medium">
                {this.state.error && this.state.error.toString()}
              </p>
              {this.state.errorInfo && (
                <pre className="font-mono text-xs text-slate-500 mt-2 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            <p className="text-slate-600 mb-6 leading-relaxed">
              The application encountered a critical error. This is often caused by missing configuration or network issues loading external modules.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}