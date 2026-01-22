/* eslint-disable react/prop-types */
import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends Component {
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
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = "/";
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="bg-red-50 p-6 flex justify-center">
                            <div className="bg-red-100 p-3 rounded-full">
                                <AlertTriangle className="w-10 h-10 text-red-600" />
                            </div>
                        </div>

                        <div className="p-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                            <p className="text-gray-600 mb-6">
                                We encountered an unexpected error. Please try reloading the page.
                            </p>

                            <div className="flex flex-col gap-3 sm:flex-row justify-center">
                                <button
                                    onClick={this.handleReload}
                                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Reload Page
                                </button>

                                <button
                                    onClick={this.handleGoHome}
                                    className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                                >
                                    Go Home
                                </button>
                            </div>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="mt-8 text-left">
                                    <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-48 text-xs text-red-300 font-mono">
                                        <p className="font-bold border-b border-gray-700 pb-2 mb-2">
                                            {this.state.error.toString()}
                                        </p>
                                        <pre className="whitespace-pre-wrap">
                                            {this.state.errorInfo?.componentStack}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
