import { 
  BarChart3, 
  Building2, 
  LineChart, 
  Tags, 
  Store, 
  Settings, 
  Shield, 
  X,
  Zap,
  ChevronRight,
  Bot,
  BookOpen,
  MessageSquare,
  FileText
} from 'lucide-react';
import logo from '../../../icon.png';
const iconMap: Record<string, React.ReactNode> = {
  'fa-chart-bar': <BarChart3 className="h-5 w-5" />,
  'fa-building': <Building2 className="h-5 w-5" />,
  'fa-chart-line': <LineChart className="h-5 w-5" />,
  'fa-tags': <Tags className="h-5 w-5" />,
  'fa-store': <Store className="h-5 w-5" />,
  'fa-cog': <Settings className="h-5 w-5" />,
  'fa-robot': <Bot className="h-5 w-5" />,
  'fa-book': <BookOpen className="h-5 w-5" />,
  'fa-comments': <MessageSquare className="h-5 w-5" />,
  'fa-file-alt': <FileText className="h-5 w-5" />,
};

interface AdminTab {
  id: string;
  name: string;
  icon: string;
}

interface AdminSidebarProps {
  tabs: AdminTab[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function AdminSidebar({ tabs, activeTab, setActiveTab, sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  return (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)} 
        />
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-sidebar flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-sidebar-border
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl  to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">

            <img src={logo} alt="logo" />
              </div>
            <div>
              <h1 className="font-bold text-sidebar-accent-foreground text-base tracking-tight">Admin Panel</h1>
              <p className="text-[11px] text-sidebar-foreground/50 font-medium">Management Console</p>
            </div>
          </div>
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* User Card */}
        <div className="p-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-sidebar-accent to-sidebar-accent/50 border border-sidebar-border/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm ring-2 ring-primary/20">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sidebar-accent-foreground text-sm truncate">Administrator</p>
              <p className="text-[11px] text-sidebar-foreground/50 font-medium">Super Admin</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2">
          <p className="px-3 mb-3 text-[10px] font-bold text-sidebar-foreground/30 uppercase tracking-widest">
            Navigation
          </p>
          <nav className="space-y-1">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`
                    nav-tab-indicator w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200 group animate-fade-in
                    ${isActive 
                      ? 'active bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }
                  `}
                >
                  <span className={`
                    flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-foreground/20' 
                      : 'bg-sidebar-accent group-hover:bg-sidebar-border'
                    }
                  `}>
                    {iconMap[tab.icon]}
                  </span>
                  <span className="flex-1 text-left">{tab.name}</span>
                  <ChevronRight className={`
                    h-4 w-4 transition-all duration-200
                    ${isActive 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
                    }
                  `} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-primary/20">
                <Zap className="h-3.5 w-3.5 text-primary" />
              </div>
              <h3 className="font-semibold text-sidebar-accent-foreground text-xs">System Status</h3>
            </div>
            <p className="text-[11px] text-sidebar-foreground/60 mb-3">All services running smoothly</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-[11px] text-success font-semibold">Operational</span>
              </div>
              <span className="text-[10px] text-sidebar-foreground/40">v2.0</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
