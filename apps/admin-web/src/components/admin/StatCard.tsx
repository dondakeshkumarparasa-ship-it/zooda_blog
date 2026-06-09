import { LucideIcon } from 'lucide-react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { MiniSparkline } from './MiniSparkline';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendType?: 'positive' | 'warning' | 'neutral';
  trendValue?: number;
  icon: LucideIcon;
  iconColor?: string;
  sparklineData?: number[];
  sparklineColor?: string;
  delay?: number;
}

export function StatCard({ 
  title, 
  value, 
  trend, 
  trendType = 'positive', 
  trendValue,
  icon: Icon, 
  iconColor = 'text-primary',
  sparklineData,
  sparklineColor,
  delay = 0
}: StatCardProps) {
  // Extract numeric value for animation
  const numericValue = typeof value === 'number' 
    ? value 
    : parseFloat(value.toString().replace(/[^0-9.-]/g, '')) || 0;
  
  const isMonetary = typeof value === 'string' && value.includes('$');
  const animatedValue = useAnimatedCounter(numericValue, { duration: 1500, delay });

  const trendColors = {
    positive: 'text-success bg-success/10 border-success/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    neutral: 'text-muted-foreground bg-muted border-border',
  };

  const TrendIcon = trendType === 'positive' ? TrendingUp : trendType === 'warning' ? TrendingDown : Minus;

  // Determine sparkline color based on iconColor
  const getSparklineColor = () => {
    if (sparklineColor) return sparklineColor;
    if (iconColor.includes('info')) return 'hsl(var(--info))';
    if (iconColor.includes('warning')) return 'hsl(var(--warning))';
    if (iconColor.includes('success')) return 'hsl(var(--success))';
    if (iconColor.includes('destructive')) return 'hsl(var(--destructive))';
    return 'hsl(var(--primary))';
  };

  const displayValue = isMonetary 
    ? `$${animatedValue.toLocaleString()}`
    : animatedValue.toLocaleString();

  return (
    <div 
      className="group bg-card rounded-xl border border-border p-5 hover:shadow-card hover:border-primary/20 transition-all duration-300"
      style={{ 
        opacity: 0,
        animation: `slideInUp 0.4s ease-out ${delay}ms forwards`
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {displayValue}
          </p>
        </div>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br from-muted to-muted/50 ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-2">
          {trend && (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${trendColors[trendType]}`}>
              <TrendIcon className="h-3 w-3" />
              {trendValue !== undefined && (
                <span>{trendValue > 0 ? '+' : ''}{trendValue}%</span>
              )}
              <span className="hidden sm:inline">{trend}</span>
            </span>
          )}
        </div>
        
        <MiniSparkline 
          data={sparklineData}
          color={getSparklineColor()}
          height={28}
          width={70}
        />
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-8 w-20 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-10 w-10 bg-muted rounded-xl animate-pulse" />
      </div>
      <div className="flex items-end justify-between">
        <div className="h-6 w-28 bg-muted rounded-lg animate-pulse" />
        <div className="h-7 w-16 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}
