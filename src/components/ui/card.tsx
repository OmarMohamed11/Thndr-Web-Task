import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-lg border border-border bg-black p-6 transition-colors hover:border-light-blue/50",
                className
            )}
            {...props}
        />
    )
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("flex flex-col space-y-1.5", className)}
            {...props}
        />
    )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
    HTMLParagraphElement,
    HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-xl font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("pt-0", className)} {...props} />
    )
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
