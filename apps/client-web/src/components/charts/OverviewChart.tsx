import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface OverviewChartProps {
  data?: Array<{ name: string; engagement: number; products: number; promotions: number }>;
}

const defaultData = [
  { name: 'Week 1', engagement: 400, products: 24, promotions: 8 },
  { name: 'Week 2', engagement: 520, products: 32, promotions: 12 },
  { name: 'Week 3', engagement: 380, products: 28, promotions: 6 },
  { name: 'Week 4', engagement: 620, products: 38, promotions: 15 },
];

const OverviewChart = ({ data = defaultData }: OverviewChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">Monthly Overview</h2>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-sm text-muted-foreground capitalize">{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="products"
              stroke="hsl(var(--chart-3))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="promotions"
              stroke="hsl(var(--chart-4))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--chart-4))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default OverviewChart;
