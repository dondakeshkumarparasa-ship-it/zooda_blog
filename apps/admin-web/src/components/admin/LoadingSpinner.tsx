import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "Loading admin data..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <Loader2 className="h-10 w-10 text-primary animate-spin-slow" />
      <p className="mt-4 text-muted-foreground font-medium">{message}</p>
    </div>
  );
}
