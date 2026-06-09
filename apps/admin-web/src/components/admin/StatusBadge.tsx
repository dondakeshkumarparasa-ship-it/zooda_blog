interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles: Record<string, string> = {
    approved: 'bg-success/10 text-success border-success/20',
    pending: 'bg-warning/10 text-warning border-warning/20',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
    suspended: 'bg-destructive/10 text-destructive border-destructive/20',
    active: 'bg-success/10 text-success border-success/20',
    inactive: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status] || statusStyles.inactive}`}>
      {status}
    </span>
  );
}

interface GrowthBadgeProps {
  value: number;
}

export function GrowthBadge({ value }: GrowthBadgeProps) {
  const isPositive = value >= 0;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
    }`}>
      {isPositive ? '+' : ''}{value}%
    </span>
  );
}
