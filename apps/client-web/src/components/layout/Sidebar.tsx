import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Briefcase, Image, ShoppingBag, Tag, LogOut, X, Building, Bot 
} from 'lucide-react';
import logo from '../../../icon.png';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  business: any;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ currentPage, onPageChange, business, onLogout, isOpen, onClose }: SidebarProps) => {
  const navItems = [
    { name: 'Dashboard', page: 'dashboard', icon: Home },
    { name: 'Profile', page: 'business-profile', icon: Briefcase },
    { name: 'Content Posts', page: 'posts', icon: Image },
    { name: 'Products', page: 'products', icon: ShoppingBag },
    { name: 'Promotions', page: 'promotions', icon: Tag },
    
    { name: 'AI Chatbot', page: 'ai-setup', icon: Bot },   // <-- New item
  ];

  const handleNavClick = (page: string) => {
    onPageChange(page);
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-sidebar flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 lg:z-auto lg:transform-none
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl  to-info flex items-center justify-center">
                <img src={logo} alt="logo" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">Zooda</h1>
                <p className="text-xs text-sidebar-muted">Business Hub</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-sidebar-muted hover:text-sidebar-foreground rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <motion.button
                key={item.page}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavClick(item.page)}
                className={`nav-item w-full ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-8 bg-sidebar-primary rounded-r-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-4">
          {/* Business Info */}
          <div className="p-4 bg-sidebar-accent rounded-xl">
            <div className="flex items-center gap-3">
              {business?.logoUrl ? (
                <img 
                  src={business.logoUrl} 
                  alt="Business Logo" 
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-sidebar-border flex items-center justify-center">
                  <Building className="text-sidebar-muted" size={18} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {business?.businessName || 'Your Business'}
                </p>
                <p className="text-xs text-sidebar-muted capitalize truncate">
                  {business?.businessCategory || 'Category'}
                </p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-3 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl transition-colors font-medium"
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;