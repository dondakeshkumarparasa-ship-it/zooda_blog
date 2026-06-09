import { useState, useMemo } from 'react';
import { 
  Mail, 
  Phone, 
  User2, 
  MessageSquare, 
  Calendar, 
  X, 
  Search, 
  RefreshCw, 
  Clock 
} from 'lucide-react';
import { EmptyState } from '../EmptyState';

interface Feedback {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt?: string;
}

interface AdminFeedbacksTabProps {
  feedbacks: Feedback[];
  onRefresh?: () => Promise<void>;
}

export function AdminFeedbacksTab({ feedbacks, onRefresh }: AdminFeedbacksTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter feedbacks based on search query
  const filteredFeedbacks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return feedbacks;

    return feedbacks.filter(fb => 
      fb.name.toLowerCase().includes(query) ||
      fb.email.toLowerCase().includes(query) ||
      (fb.phone && fb.phone.toLowerCase().includes(query)) ||
      fb.message.toLowerCase().includes(query)
    );
  }, [feedbacks, searchQuery]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">User Feedbacks</h2>
            <p className="text-sm text-muted-foreground">Manage and review feedback submitted by platform visitors.</p>
          </div>
          {onRefresh && (
            <button 
              onClick={handleRefresh}
              className="p-2 rounded-lg bg-card border border-border text-foreground hover:bg-muted hover:border-primary/20 transition-all flex items-center gap-2 text-sm font-medium"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </div>
        <EmptyState 
          icon={MessageSquare} 
          title="No feedbacks found" 
          description="Visitor feedbacks will appear here once submitted from the home footer." 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">User Feedbacks</h2>
          <p className="text-sm text-muted-foreground">Manage and review feedback submitted by platform visitors.</p>
        </div>
        {onRefresh && (
          <button 
            onClick={handleRefresh}
            className="self-end sm:self-auto px-4 py-2 rounded-lg bg-card border border-border text-foreground hover:bg-muted hover:border-primary/20 transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-xl max-w-md focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, phone or message..."
          className="w-full text-sm bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Feedbacks Visualizer Table (Desktop) / Cards Grid (Mobile) */}
      {filteredFeedbacks.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
          No feedbacks matches your search query. Try another term.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border/80 text-muted-foreground font-semibold">
                    <th className="p-4 w-48">Date Submitted</th>
                    <th className="p-4 w-48">Submitter Name</th>
                    <th className="p-4 w-56">Email</th>
                    <th className="p-4 w-44">Phone Number</th>
                    <th className="p-4">Message Preview</th>
                    <th className="p-4 w-32 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredFeedbacks.map((fb) => (
                    <tr 
                      key={fb._id}
                      onClick={() => setSelectedFeedback(fb)}
                      className="hover:bg-muted/30 cursor-pointer transition-colors group"
                    >
                      <td className="p-4 font-medium text-foreground/80">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {formatDate(fb.createdAt)}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-foreground">
                        {fb.name}
                      </td>
                      <td className="p-4 text-muted-foreground select-all">
                        {fb.email}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {fb.phone || '—'}
                      </td>
                      <td className="p-4 text-muted-foreground/90 max-w-[240px]">
                        <p className="truncate">{fb.message}</p>
                      </td>
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedFeedback(fb)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-semibold transition-all group-hover:shadow-glow"
                        >
                          <MessageSquare className="h-3 w-3" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List View */}
          <div className="grid gap-4 md:hidden">
            {filteredFeedbacks.map((fb) => (
              <div 
                key={fb._id}
                onClick={() => setSelectedFeedback(fb)}
                className="bg-card border border-border rounded-xl p-4 space-y-3 cursor-pointer hover:border-primary/50 transition-all active:scale-[0.99]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-foreground">{fb.name}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{formatDate(fb.createdAt)}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-semibold">
                    Feedback
                  </span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground select-all">
                  <p className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {fb.email}
                  </p>
                  {fb.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      {fb.phone}
                    </p>
                  )}
                </div>
                <p className="text-sm text-foreground/80 line-clamp-2 bg-muted/40 p-2 rounded-lg border border-border/40 select-all">
                  {fb.message}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFeedback(fb);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/95 transition-all shadow-md active:scale-95"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  View Full Feedback
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Details Popup Modal */}
      {selectedFeedback && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedFeedback(null)}
        >
          <div 
            className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/80 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shadow-inner shadow-primary/10">
                  {selectedFeedback.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base tracking-tight">{selectedFeedback.name}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                    <Clock className="h-3 w-3" />
                    <span>Submitted {formatDate(selectedFeedback.createdAt)}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFeedback(null)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Contact Information Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a 
                  href={`mailto:${selectedFeedback.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/75 border border-border/50 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">Email</p>
                    <p className="text-xs font-semibold text-foreground truncate select-all">{selectedFeedback.email}</p>
                  </div>
                </a>

                <a 
                  href={selectedFeedback.phone ? `tel:${selectedFeedback.phone}` : '#'}
                  onClick={(e) => !selectedFeedback.phone && e.preventDefault()}
                  className={`flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/50 transition-colors group ${
                    selectedFeedback.phone ? 'hover:bg-muted/75' : 'opacity-60 cursor-default'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">Phone Number</p>
                    <p className="text-xs font-semibold text-foreground truncate select-all">
                      {selectedFeedback.phone || 'Not provided'}
                    </p>
                  </div>
                </a>
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Feedback Message
                </h4>
                <div className="bg-muted/30 border border-border/60 rounded-xl p-4 max-h-60 overflow-y-auto scrollbar-thin select-all">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedFeedback.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-border/80 bg-muted/10">
              <button
                onClick={() => setSelectedFeedback(null)}
                className="px-5 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted font-bold text-xs transition-colors shadow-sm active:scale-95"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
