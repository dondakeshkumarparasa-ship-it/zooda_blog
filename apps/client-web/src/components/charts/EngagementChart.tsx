import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface EngagementChartProps {
  data?: Array<{ name: string; engagement: number; posts: number }>;
}

const defaultData = [
  { name: 'Mon', engagement: 120, posts: 4 },
  { name: 'Tue', engagement: 180, posts: 6 },
  { name: 'Wed', engagement: 150, posts: 5 },
  { name: 'Thu', engagement: 280, posts: 8 },
  { name: 'Fri', engagement: 320, posts: 10 },
  { name: 'Sat', engagement: 250, posts: 7 },
  { name: 'Sun', engagement: 200, posts: 6 },
];

const EngagementChart = ({ data = defaultData }: EngagementChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">Engagement Trends</h2>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
              itemStyle={{ color: 'hsl(var(--muted-foreground))' }}
            />
            <Area
              type="monotone"
              dataKey="engagement"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="url(#engagementGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default EngagementChart;
