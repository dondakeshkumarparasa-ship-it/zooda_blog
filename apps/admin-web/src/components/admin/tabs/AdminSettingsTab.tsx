import { useState } from "react";
import { Key, LogOut, Info, Shield, X } from "lucide-react";

interface AdminSettingsTabProps {
  onResetPassword: (current: string, next: string) => { success: boolean; error?: string };
  onLogout: () => void;
}

export function AdminSettingsTab({ onResetPassword, onLogout }: AdminSettingsTabProps) {
  const [openReset, setOpenReset] = useState(false);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleReset = () => {
    if (!current || !next || !confirm) {
      alert("Please fill all fields");
      return;
    }
    if (next !== confirm) {
      alert("New passwords do not match");
      return;
    }

    const result = onResetPassword(current, next);
    if (!result.success) {
      alert(result.error || "Reset failed");
      return;
    }

    alert("Password updated successfully!");
    setOpenReset(false);
    setCurrent("");
    setNext("");
    setConfirm("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Admin Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your admin account settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Password */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-warning/10">
              <Key className="h-5 w-5 text-warning" />
            </div>
            <h3 className="font-semibold text-foreground">Password Management</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Change your admin password. You'll need to enter your current password first.
          </p>

          <button
            onClick={() => setOpenReset(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-warning text-warning-foreground font-medium text-sm hover:bg-warning/90 transition-all"
          >
            <Key className="h-4 w-4" />
            Reset Password
          </button>
        </div>

        {/* Session */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-muted">
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground">Session Management</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Log out from the admin panel. You'll need to enter your password again to log back in.
          </p>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground font-medium text-sm hover:bg-muted/80 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Info */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-info/10">
              <Info className="h-5 w-5 text-info" />
            </div>
            <h3 className="font-semibold text-foreground">Admin Panel Information</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Storage Location:</span>
              <span className="text-foreground font-medium">Local Browser Storage</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Password Security:</span>
              <span className="text-foreground font-medium">Stored locally</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Session:</span>
              <span className="text-foreground font-medium">Until logout</span>
            </p>
          </div>
        </div>
      </div>

      {/* Security notice */}
      <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
        <div className="flex gap-4">
          <div className="p-2 rounded-lg bg-primary/10 h-fit">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Security Notice</h4>
            <p className="text-sm text-muted-foreground">
              Your admin password is stored locally in your browser. For security reasons,
              avoid using this admin panel on shared computers. If you suspect unauthorized access,
              reset your password immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Reset Password Modal (simple local modal) */}
      {openReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Reset Password</h3>
              <button
                onClick={() => setOpenReset(false)}
                className="p-2 rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background"
              />
              <input
                type="password"
                placeholder="New password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background"
              />

              <button
                onClick={handleReset}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all"
              >
                <Key className="h-4 w-4" />
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
