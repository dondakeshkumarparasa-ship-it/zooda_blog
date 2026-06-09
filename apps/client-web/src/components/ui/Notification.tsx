import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Notification = ({ message, type, onClose }: NotificationProps) => {
  const configs = {
    success: {
      bg: 'bg-success',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-destructive',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-info',
      icon: Info,
    },
  };

  const config = configs[type] || configs.info;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.9 }}
        className={`${config.bg} px-5 py-4 rounded-xl shadow-xl flex items-center gap-3 text-white min-w-[300px]`}
      >
        <Icon size={20} className="flex-shrink-0" />
        <p className="flex-1 font-medium text-sm">{message}</p>
        <button 
          onClick={onClose} 
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;
