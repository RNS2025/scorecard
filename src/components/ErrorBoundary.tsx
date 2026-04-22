import { Component, type ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    message: string;
}

class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, message: "" };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, message: error.message };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
                    <span className="text-5xl">⛳</span>
                    <h1 className="text-2xl font-bold text-gray-800">Noget gik galt</h1>
                    <p className="text-gray-500 text-sm max-w-xs">{this.state.message || "En uventet fejl opstod. Prøv at genindlæse siden."}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-5 py-2 bg-green-600 text-white rounded-lg font-semibold"
                    >
                        Genindlæs
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;

