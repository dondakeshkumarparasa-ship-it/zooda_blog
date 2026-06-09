import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  gradient: 'primary' | 'success' | 'warning' | 'purple' | 'pink';
  delay?: number;
}

const gradientClasses = {
  primary: 'bg-gradient-to-br from-primary to-info',
  success: 'bg-gradient-to-br from-success to-emerald-600',
  warning: 'bg-gradient-to-br from-warning to-orange-500',
  purple: 'bg-gradient-to-br from-violet-500 to-purple-600',
  pink: 'bg-gradient-to-br from-pink-500 to-rose-500',
};

const StatCard = ({ title, value, icon, gradient, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`stat-card ${gradientClasses[gradient]} text-white`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          {icon}
        </div>
      </div>
      <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
    </motion.div>
  );
};

export default StatCard;
