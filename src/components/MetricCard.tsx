import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
  pulse?: boolean;
}

export default function MetricCard({ label, value, unit, icon, color = '#00F0FF', className, pulse = false }: MetricCardProps) {
  const [flash, setFlash] = useState(false);
  const prevValue = useRef<string | number>(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 300);
      prevValue.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  const displayValue = typeof value === 'number' ? value.toFixed(2) : value;

  return (
    <motion.div
      className={cn(
        "relative rounded p-4 transition-all duration-300 cursor-default",
        "border border-[#1A1A24]",
        "hover:bg-[rgba(15,15,25,0.8)] hover:border-[rgba(0,240,255,0.1)]",
        className
      )}
      style={{
        background: 'rgba(15, 15, 25, 0.6)',
        backdropFilter: 'blur(8px)',
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#4A4A5E] text-xs font-inter tracking-wider uppercase">
          {label}
        </span>
        {icon && <div style={{ color }}>{icon}</div>}
        {pulse && (
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
          />
        )}
      </div>
      <motion.div
        className="font-mono text-2xl tracking-tight"
        style={{ color: flash ? '#ffffff' : '#FFFFFF' }}
        animate={{ color: flash ? '#ffffff' : '#FFFFFF' }}
        transition={{ duration: 0.3 }}
      >
        {displayValue}
        <span className="text-sm ml-1" style={{ color: '#8A8A9E' }}>{unit}</span>
      </motion.div>
    </motion.div>
  );
}
