import { Menu, RefreshCw, LogOut, ChevronDown, Bell } from 'lucide-react';
import { useState } from 'react';

interface AdminHeaderProps {
  onMenuClick: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}

export function AdminHeader({ onMenuClick, onRefresh, onLogout }: AdminHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Manage your platform</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="relative p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
          </button>
          
          <button 
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-sm hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-muted transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm">
                A
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground hidden md:block transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-56 bg-card rounded-xl shadow-lg border border-border py-2 z-50 animate-slide-in-up">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="font-semibold text-foreground text-sm">Admin User</p>
                    <p className="text-xs text-muted-foreground">Administrator</p>
                  </div>
                  <div className="p-1">
                    <button 
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
