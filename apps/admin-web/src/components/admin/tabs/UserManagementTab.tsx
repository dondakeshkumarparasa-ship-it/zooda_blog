import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CalendarClock, Edit, Mail, MapPin, Phone, Save, Shield, Trash2, User2, Users, X } from 'lucide-react';
import { EmptyState } from '../EmptyState';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin' | 'business_owner';
  createdAt?: string;
}

interface UserManagementTabProps {
  users: User[];
  onUpdateUser: (id: string, data: Partial<User>) => Promise<User | null>;
  onDeleteUser: (id: string) => Promise<boolean>;
}

export function UserManagementTab({ users, onUpdateUser, onDeleteUser }: UserManagementTabProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      const updated = users.find(u => u._id === selectedUser._id);
      if (updated) setSelectedUser(updated);
      else setSelectedUser(null);
    }
  }, [users]);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bDate - aDate;
    });
  }, [users]);

  const startEditing = (user: User) => {
    setSelectedUser(user);
    setEditingUserId(user._id);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      role: user.role,
    });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditForm({});
  };

  const saveUser = async () => {
    if (!selectedUser || !editingUserId) return;
    setIsSaving(true);
    const updated = await onUpdateUser(selectedUser._id, editForm);
    setIsSaving(false);
    if (updated) {
      setEditingUserId(null);
      setEditForm({});
      setSelectedUser(updated);
    }
  };

  const removeUser = async (userId: string) => {
    if (!window.confirm('Delete this user? This will also remove their related data.')) return;
    setIsDeleting(true);
    const deleted = await onDeleteUser(userId);
    setIsDeleting(false);
    if (deleted) {
      setSelectedUser(null);
      setEditingUserId(null);
    }
  };

  if (!users.length) {
    return <EmptyState icon={Users} title="No users found" description="Users will appear here once they have registered." />;
  }

  if (selectedUser) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedUser(null);
                cancelEditing();
              }}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {selectedUser.firstName} {selectedUser.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">User details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => removeUser(selectedUser._id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors text-sm font-medium disabled:opacity-50"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </button>
            {editingUserId ? (
              <>
                <button
                  onClick={cancelEditing}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors text-sm font-medium"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={saveUser}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-70"
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save changes'}
                </button>
              </>
            ) : (
              <button
                onClick={() => startEditing(selectedUser)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                <Edit className="h-4 w-4" />
                Edit user
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <User2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                {editingUserId ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      value={editForm.firstName || ''}
                      onChange={e => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="First name"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <input
                      value={editForm.lastName || ''}
                      onChange={e => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Last name"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                ) : (
                  <p className="text-foreground font-medium">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <DetailRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={editingUserId ? (
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  selectedUser.email
                )}
              />
              <DetailRow
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={editingUserId ? (
                  <input
                    value={editForm.phone || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Optional"
                  />
                ) : (
                  selectedUser.phone || 'Not provided'
                )}
              />
              <DetailRow
                icon={<MapPin className="h-4 w-4" />}
                label="Address"
                value={editingUserId ? (
                  <input
                    value={editForm.address || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Optional"
                  />
                ) : (
                  selectedUser.address || 'Not provided'
                )}
              />
              <DetailRow
                icon={<Shield className="h-4 w-4" />}
                label="Role"
                value={editingUserId ? (
                  <select
                    value={editForm.role || 'user'}
                    onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="user">User</option>
                    <option value="business_owner">Business Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  roleLabel(selectedUser.role)
                )}
              />
              <DetailRow
                icon={<CalendarClock className="h-4 w-4" />}
                label="Created"
                value={selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : '—'}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Users</h2>
        <p className="text-sm text-muted-foreground">View, edit, or remove user accounts.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedUsers.map(user => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className="group text-left rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/15">
                  <User2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{roleLabel(user.role)}</p>
                </div>
              </div>
              <Edit className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
        <div className="text-sm text-foreground mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function roleLabel(role: User['role']) {
  if (role === 'business_owner') return 'Business owner';
  if (role === 'admin') return 'Administrator';
  return 'User';
}
