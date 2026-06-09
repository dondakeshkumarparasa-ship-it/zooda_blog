import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface ProductsChartProps {
  data?: Array<{ name: string; products: number; sales: number }>;
}

const defaultData = [
  { name: 'Jan', products: 12, sales: 45 },
  { name: 'Feb', products: 18, sales: 62 },
  { name: 'Mar', products: 15, sales: 58 },
  { name: 'Apr', products: 22, sales: 78 },
  { name: 'May', products: 28, sales: 95 },
  { name: 'Jun', products: 24, sales: 88 },
];

const ProductsChart = ({ data = defaultData }: ProductsChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">Products & Sales</h2>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
            <Bar 
              dataKey="products" 
              fill="hsl(var(--chart-1))" 
              radius={[6, 6, 0, 0]}
              name="Products"
            />
            <Bar 
              dataKey="sales" 
              fill="hsl(var(--chart-2))" 
              radius={[6, 6, 0, 0]}
              name="Sales"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chart-1" />
          <span className="text-sm text-muted-foreground">Products</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chart-2" />
          <span className="text-sm text-muted-foreground">Sales</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductsChart;
