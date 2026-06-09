import { motion } from 'framer-motion';
import { Hourglass, XCircle, LogOut } from 'lucide-react';

interface BusinessPendingScreenProps {
  business: any;
  onLogout: () => void;
}

const BusinessPendingScreen = ({ business, onLogout }: BusinessPendingScreenProps) => {
  const getStatusMessage = () => {
    if (business?.status === 'inactive') {
      return {
        icon: <XCircle size={48} className="text-destructive" />,
        title: 'Business Rejected',
        message: `Your business listing was rejected. Reason: ${business?.rejectionReason || 'Not specified'}`,
        bgColor: 'bg-destructive/5',
        borderColor: 'border-destructive/20',
      };
    }
    if (business?.status === 'suspended') {
      return {
        icon: <XCircle size={48} className="text-destructive" />,
        title: 'Business Suspended',
        message: `Your business account has been suspended. Reason: ${business?.suspensionReason || 'Not specified'}`,
        bgColor: 'bg-destructive/5',
        borderColor: 'border-destructive/20',
      };
    }
    return {
      icon: <Hourglass size={48} className="text-warning" />,
      title: 'Under Review',
      message: 'Thank you for registering. Your business listing is currently under review. We will notify you once approved.',
      bgColor: 'bg-warning/5',
      borderColor: 'border-warning/20',
    };
  };

  const status = getStatusMessage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div className={`${status.bgColor} border ${status.borderColor} rounded-2xl p-8 text-center`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            {status.icon}
          </motion.div>

          <h2 className="text-2xl font-bold text-foreground mb-3">{status.title}</h2>
          <p className="text-muted-foreground mb-8">{status.message}</p>

          {business?.status === 'pending' && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>Checking status automatically...</span>
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="w-full mt-6 btn-danger flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </motion.button>
      </motion.div>
    </div>
  );
};

export default BusinessPendingScreen;
