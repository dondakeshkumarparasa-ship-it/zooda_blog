import { useState } from 'react';
import { Eye, BarChart2, Download, LineChart, ArrowUpDown, Trophy } from 'lucide-react';
import { StatusBadge, GrowthBadge } from '../StatusBadge';
import { EmptyState } from '../EmptyState';

interface BusinessAnalytic {
  businessId: string;
  businessName: string;
  totalPosts: number;
  totalProducts: number;
  totalPromotions: number;
  totalEngagement: number;
  revenue: number;
  growth: number;
  status: string;
}

interface AdminAnalyticsTabProps {
  businessAnalytics: BusinessAnalytic[];
}

export function AdminAnalyticsTab({ businessAnalytics }: AdminAnalyticsTabProps) {
  const [sortField, setSortField] = useState<keyof BusinessAnalytic>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedAnalytics = [...businessAnalytics].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (sortDirection === 'asc') {
      return (aValue ?? 0) > (bValue ?? 0) ? 1 : -1;
    } else {
      return (aValue ?? 0) < (bValue ?? 0) ? 1 : -1;
    }
  });

  const handleSort = (field: keyof BusinessAnalytic) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortHeader = ({ field, children }: { field: keyof BusinessAnalytic; children: React.ReactNode }) => (
    <th
      onClick={() => handleSort(field)}
      className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase cursor-pointer hover:text-foreground transition-colors group"
    >
      <span className="flex items-center gap-1">
        {children}
        <ArrowUpDown className={`h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ${sortField === field ? 'opacity-100 text-primary' : ''}`} />
        {sortField === field && (
          <span className="text-primary">{sortDirection === 'asc' ? '↑' : '↓'}</span>
        )}
      </span>
    </th>
  );

  if (businessAnalytics.length === 0) {
    return (
      <EmptyState
        icon={LineChart}
        title="No business analytics data available"
        description="Analytics data will appear here once businesses start using the platform."
      />
    );
  }

  const totalRevenue = businessAnalytics.reduce((sum, biz) => sum + (biz.revenue || 0), 0);
  const totalEngagement = businessAnalytics.reduce((sum, biz) => sum + (biz.totalEngagement || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Business Performance Analytics</h2>
        <p className="text-sm text-muted-foreground">Comprehensive metrics and performance data for all businesses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-warning" />
            <h3 className="font-semibold text-foreground">Top Performers</h3>
          </div>
          <div className="space-y-3">
            {sortedAnalytics.slice(0, 3).map((business, index) => (
              <div key={business.businessId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-warning/20 text-warning' :
                    index === 1 ? 'bg-muted text-muted-foreground' :
                    'bg-warning/10 text-warning/70'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">{business.businessName}</span>
                </div>
                <span className="text-sm font-semibold text-success">${business.revenue?.toLocaleString() || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Platform Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-foreground">{businessAnalytics.length}</p>
              <p className="text-sm text-muted-foreground">Businesses Tracked</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalEngagement.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Engagement</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Business</th>
                <SortHeader field="totalPosts">Posts</SortHeader>
                <SortHeader field="totalProducts">Products</SortHeader>
                <SortHeader field="totalPromotions">Promotions</SortHeader>
                <SortHeader field="totalEngagement">Engagement</SortHeader>
                <SortHeader field="revenue">Revenue</SortHeader>
                <SortHeader field="growth">Growth</SortHeader>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedAnalytics.map(business => (
                <tr key={business.businessId} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-foreground">{business.businessName}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{business.totalPosts || 0}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{business.totalProducts || 0}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{business.totalPromotions || 0}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{business.totalEngagement?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4 text-sm font-medium text-success">${business.revenue?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4">
                    <GrowthBadge value={business.growth || 0} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={business.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-info/10 text-info transition-colors" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors" title="View Charts">
                        <BarChart2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors" title="Download Report">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
