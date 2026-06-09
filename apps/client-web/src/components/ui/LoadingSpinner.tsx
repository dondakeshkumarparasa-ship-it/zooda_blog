import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({ text = "Loading...", size = 'md' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8"
    >
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-[3px] border-border`} />
        <div 
          className={`${sizeClasses[size]} rounded-full border-[3px] border-transparent border-t-primary absolute top-0 left-0 animate-spin`}
        />
      </div>
      {text && (
        <p className="mt-4 text-muted-foreground font-medium text-sm">{text}</p>
      )}
    </motion.div>
  );
};

export default LoadingSpinner;
