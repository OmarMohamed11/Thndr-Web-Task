import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong',
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-8 text-center',
        className
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <svg
          className="h-6 w-6 text-destructive"
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
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Error</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md bg-light-blue px-4 py-2 text-sm font-medium text-white hover:bg-light-blue/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

