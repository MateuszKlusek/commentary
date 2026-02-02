import { Component, type ErrorInfo, type ReactNode } from "react";
import { COMMENTARY_NAME } from "../../../constants";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class CommentaryErrorBoundary extends Component<Props, State> {
    public state: State = { hasError: false };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`[${COMMENTARY_NAME}] Crashed:`, error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-4 border border-red-500 rounded-md">
                    <h4>Something went wrong with Commentary.</h4>
                </div>
            );
        }

        return this.props.children;
    }
}