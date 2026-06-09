import { useState } from 'react';
import { Check, X, Mail, Phone, Tag, MapPin, Calendar, User, Pause, Play, Eye } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import { EmptyState } from '../EmptyState';
import { Modal } from '../Modal';
import { CheckCircle } from 'lucide-react';

interface Business {
  _id: string;
  businessName: string;
  businessCategory: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessDescription: string;
  status: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface AdminApprovalsTabProps {
  pendingBusinesses: Business[];
  approvedBusinesses: Business[];
  onApproveBusiness: (id: string) => void;
  onRejectBusiness: (id: string, reason: string) => void;
  onSuspendBusiness: (id: string, reason: string) => void;
  onActivateBusiness: (id: string) => void;
  showRejectModal: string | null;
  setShowRejectModal: (id: string | null) => void;
  rejectReason: string;
  setRejectReason: (reason: string) => void;
  showSuspendModal: string | null;
  setShowSuspendModal: (id: string | null) => void;
  suspendReason: string;
  setSuspendReason: (reason: string) => void;
}

export function AdminApprovalsTab({
  pendingBusinesses,
  approvedBusinesses,
  onApproveBusiness,
  onRejectBusiness,
  onSuspendBusiness,
  onActivateBusiness,
  showRejectModal,
  setShowRejectModal,
  rejectReason,
  setRejectReason,
  showSuspendModal,
  setShowSuspendModal,
  suspendReason,
  setSuspendReason,
}: AdminApprovalsTabProps) {
  const [view, setView] = useState<'pending' | 'approved'>('pending');

  const handleReject = (businessId: string) => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    onRejectBusiness(businessId, rejectReason);
    setShowRejectModal(null);
    setRejectReason('');
  };

  const handleSuspend = (businessId: string) => {
    if (!suspendReason.trim()) {
      alert('Please provide a suspension reason');
      return;
    }
    onSuspendBusiness(businessId, suspendReason);
    setShowSuspendModal(null);
    setSuspendReason('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Business Management</h2>
          <p className="text-sm text-muted-foreground">Review and manage business applications</p>
        </div>
        <div className="flex rounded-lg bg-muted p-1">
          <button
            onClick={() => setView('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              view === 'pending'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Pending ({pendingBusinesses.length})
          </button>
          <button
            onClick={() => setView('approved')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              view === 'approved'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Approved ({approvedBusinesses.length})
          </button>
        </div>
      </div>

      {view === 'pending' ? (
        pendingBusinesses.length === 0 ? (
          <EmptyState
            icon={CheckCircle}
            title="No pending business approvals"
            description="All businesses have been reviewed and processed."
          />
        ) : (
          <div className="space-y-4">
            {pendingBusinesses.map(business => (
              <div key={business._id} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-foreground">{business.businessName}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Tag className="h-4 w-4" />
                          {business.businessCategory}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-4 w-4" />
                          {business.businessEmail}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-4 w-4" />
                          {business.businessPhone}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onApproveBusiness(business._id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success text-success-foreground font-medium text-sm hover:bg-success/90 transition-all"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => setShowRejectModal(business._id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium text-sm hover:bg-destructive/90 transition-all"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Address</p>
                      <p className="text-sm text-foreground flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        {business.businessAddress}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Registered by</p>
                      <p className="text-sm text-foreground flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {business.user?.firstName} {business.user?.lastName} ({business.user?.email})
                      </p>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Description</p>
                      <p className="text-sm text-foreground">{business.businessDescription}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Submitted on</p>
                      <p className="text-sm text-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(business.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <Modal
                  isOpen={showRejectModal === business._id}
                  onClose={() => setShowRejectModal(null)}
                  title="Reject Business Application"
                >
                  <p className="text-sm text-muted-foreground mb-4">
                    Please provide a reason for rejecting {business.businessName}:
                  </p>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter detailed rejection reason..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => setShowRejectModal(null)}
                      className="px-4 py-2 rounded-lg bg-muted text-foreground font-medium text-sm hover:bg-muted/80 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReject(business._id)}
                      className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium text-sm hover:bg-destructive/90 transition-all"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </Modal>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Business Name</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Contact Email</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">Owner</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Registered</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {approvedBusinesses.map(business => (
                  <tr key={business._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">{business.businessName}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{business.businessCategory}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">{business.businessEmail}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">
                      {business.user?.firstName} {business.user?.lastName}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={business.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                      {new Date(business.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-info/10 text-info transition-colors" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        {business.status === 'approved' ? (
                          <button
                            onClick={() => setShowSuspendModal(business._id)}
                            className="p-2 rounded-lg hover:bg-warning/10 text-warning transition-colors"
                            title="Suspend Business"
                          >
                            <Pause className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onActivateBusiness(business._id)}
                            className="p-2 rounded-lg hover:bg-success/10 text-success transition-colors"
                            title="Activate Business"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={!!showSuspendModal}
        onClose={() => setShowSuspendModal(null)}
        title="Suspend Business"
      >
        <p className="text-sm text-muted-foreground mb-4">
          Please provide a reason for suspending this business:
        </p>
        <textarea
          value={suspendReason}
          onChange={(e) => setSuspendReason(e.target.value)}
          placeholder="Enter suspension reason..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setShowSuspendModal(null)}
            className="px-4 py-2 rounded-lg bg-muted text-foreground font-medium text-sm hover:bg-muted/80 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => showSuspendModal && handleSuspend(showSuspendModal)}
            className="px-4 py-2 rounded-lg bg-warning text-warning-foreground font-medium text-sm hover:bg-warning/90 transition-all"
          >
            Confirm Suspension
          </button>
        </div>
      </Modal>
    </div>
  );
}
