import { useState, useEffect, useRef } from 'react';

interface UseAnimatedCounterOptions {
  duration?: number;
  delay?: number;
}

export function useAnimatedCounter(
  endValue: number,
  options: UseAnimatedCounterOptions = {}
): number {
  const { duration = 1500, delay = 0 } = options;
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = 0;
    const endVal = endValue || 0;

    const timeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }

        const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (endVal - startValue) * easeOutQuart);

        if (currentValue !== countRef.current) {
          countRef.current = currentValue;
          setCount(currentValue);
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(endVal);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      startTimeRef.current = null;
    };
  }, [endValue, duration, delay]);

  return count;
}
