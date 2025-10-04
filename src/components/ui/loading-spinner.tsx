import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg";
}

const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
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
            data-testid="loading-spinner"
            className={cn("flex items-center justify-center", className)}
            {...props}
        >
            <Skeleton
                className={cn("rounded-full animate-pulse", sizeClasses[size])}
            />
        </div>
    );
}
