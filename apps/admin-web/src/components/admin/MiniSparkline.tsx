import { useMemo } from 'react';

interface MiniSparklineProps {
  data?: number[];
  color?: string;
  height?: number;
  width?: number;
}

export function MiniSparkline({ 
  data, 
  color = 'hsl(var(--primary))', 
  height = 32, 
  width = 80 
}: MiniSparklineProps) {
  // Generate random but consistent data if none provided
  const chartData = useMemo(() => {
    if (data && data.length > 0) return data;
    // Generate some sample data points
    return [4, 6, 8, 5, 9, 7, 10, 8, 12, 9, 11, 14];
  }, [data]);

  const points = useMemo(() => {
    const max = Math.max(...chartData);
    const min = Math.min(...chartData);
    const range = max - min || 1;
    
    return chartData.map((value, index) => {
      const x = (index / (chartData.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    }).join(' ');
  }, [chartData, height, width]);

  const areaPoints = useMemo(() => {
    return `0,${height} ${points} ${width},${height}`;
  }, [points, height, width]);

  return (
    <svg 
      width={width} 
      height={height} 
      className="overflow-visible"
      style={{ opacity: 0, animation: 'fadeIn 0.5s ease-out 0.3s forwards' }}
    >
      <defs>
        <linearGradient id={`gradient-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      <polygon
        points={areaPoints}
        fill={`url(#gradient-${color.replace(/[^a-z0-9]/gi, '')})`}
      />
      
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 200,
          strokeDashoffset: 200,
          animation: 'drawLine 1s ease-out 0.2s forwards'
        }}
      />
      
      {/* End dot */}
      <circle
        cx={width}
        cy={points.split(' ').pop()?.split(',')[1]}
        r="3"
        fill={color}
        style={{ opacity: 0, animation: 'fadeIn 0.3s ease-out 1s forwards' }}
      />
      
      <style>{`
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
    </svg>
  );
}
