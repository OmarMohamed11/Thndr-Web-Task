import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg";
}

const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
};

export function LoadingSpinner({
    size = "md",
    className,
    ...props
}: LoadingSpinnerProps) {
    return (
        <div
            role="status"
            aria-label="Loading"
            className={cn("flex items-center justify-center", className)}
            {...props}
        >
            <div
                className={cn(
                    "animate-spin rounded-full border-light-blue border-t-transparent",
                    sizeClasses[size]
                )}
            />
        </div>
    );
}
