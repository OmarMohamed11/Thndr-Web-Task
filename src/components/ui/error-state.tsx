import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";

interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
    readonly message?: string;
    readonly onRetry?: () => void;
}

export function ErrorState({
    message = "Something went wrong",
    onRetry,
    className,
    ...props
}: ErrorStateProps) {
    return (
        <div
            data-testid="error-state"
            className={cn(
                "flex flex-col items-center justify-center gap-6 p-8 text-center min-h-[400px]",
                className
            )}
            {...props}
        >
            <Alert variant="destructive" className="max-w-md w-full">
                <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                </svg>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
            {onRetry && (
                <Button
                    onClick={onRetry}
                    variant="outline"
                    className="bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/70 hover:border-slate-500/70 hover:shadow-lg transition-all duration-300"
                >
                    Try Again
                </Button>
            )}
        </div>
    );
}
