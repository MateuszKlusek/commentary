import { Component, type ErrorInfo, type ReactNode } from "react";
import { COMMENTARY_NAME } from "../../../constants";
import { CommentaryIntegrationError } from "../../../utils/errors";

interface Props {
    children: ReactNode;
    fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class CommentaryErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`[${COMMENTARY_NAME}] Internal Crash:`, error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        const { hasError, error } = this.state;
        const { children, fallback } = this.props;

        if (hasError && error) {
            if (typeof fallback === "function") {
                return fallback(error, this.handleReset);
            }

            if (fallback) return fallback;

            if (CommentaryIntegrationError.is(error)) {
                return (
                    <div className="p-4 border border-red-500 rounded-md">
                        <h3 className="text-lg font-bold">Integration Setup Required</h3>
                        <p className="text-sm text-gray-500">{error.message}</p>
                    </div>
                );
            }

            return (
                <div className="p-4 border border-red-500 rounded-md">
                    <h3 className="text-lg font-bold">Something went wrong</h3>
                    <p className="text-sm text-gray-500">{JSON.stringify(error)}</p>
                </div>
            );

        }

        return children;
    }
}