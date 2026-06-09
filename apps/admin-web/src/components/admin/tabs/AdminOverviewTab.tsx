import { Building2, Clock, Newspaper, ShoppingBag, Tag, DollarSign, Download, LineChart } from 'lucide-react';
import { StatCard, StatCardSkeleton } from '../StatCard';

interface PlatformStats {
  totalBusinesses: number;
  pendingApprovals: number;
  totalPosts: number;
  totalProducts: number;
  totalPromotions: number;
  totalRevenue: number;
}

interface AdminOverviewTabProps {
  stats: PlatformStats | null;
}

export function AdminOverviewTab({ stats }: AdminOverviewTabProps) {
  if (!stats) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Businesses"
          value={stats.totalBusinesses}
          trend="Active"
          trendType="positive"
          trendValue={12}
          icon={Building2}
          iconColor="text-info"
          sparklineData={[8, 12, 15, 14, 18, 20, 22, 25, 24, 28, 30, stats.totalBusinesses]}
          delay={0}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          trend="Attention"
          trendType="warning"
          trendValue={-5}
          icon={Clock}
          iconColor="text-warning"
          sparklineData={[15, 12, 18, 14, 10, 8, 12, 9, 7, 5, 4, stats.pendingApprovals]}
          delay={100}
        />
        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          trend="Growing"
          trendType="positive"
          trendValue={24}
          icon={Newspaper}
          iconColor="text-primary"
          sparklineData={[20, 35, 45, 55, 50, 65, 80, 75, 90, 95, 110, stats.totalPosts]}
          delay={200}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          trend="Active"
          trendType="positive"
          trendValue={18}
          icon={ShoppingBag}
          iconColor="text-success"
          sparklineData={[30, 42, 55, 48, 62, 70, 85, 78, 95, 88, 102, stats.totalProducts]}
          delay={300}
        />
        <StatCard
          title="Active Promotions"
          value={stats.totalPromotions}
          trend="Running"
          trendType="positive"
          trendValue={8}
          icon={Tag}
          iconColor="text-destructive"
          sparklineData={[5, 8, 6, 10, 12, 9, 14, 11, 15, 13, 16, stats.totalPromotions]}
          delay={400}
        />
        <StatCard
          title="Platform Revenue"
          value={`$${stats.totalRevenue?.toLocaleString() || 0}`}
          trend="Revenue"
          trendType="positive"
          trendValue={32}
          icon={DollarSign}
          iconColor="text-success"
          sparklineData={[1200, 1800, 2200, 2800, 3200, 3800, 4500, 5200, 5800, 6500, 7200, stats.totalRevenue || 8000]}
          delay={500}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]">
            <Building2 className="h-5 w-5" />
            Review Pending Businesses
          </button>
          <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-card border border-border text-foreground font-medium hover:bg-muted hover:border-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <LineChart className="h-5 w-5" />
            View Business Analytics
          </button>
          <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-info/10 border border-info/20 text-info font-medium hover:bg-info/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Download className="h-5 w-5" />
            Export Reports
          </button>
        </div>
      </div>
    </div>
  );
}
