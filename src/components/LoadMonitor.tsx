import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface LoadMonitorProps {
  percentage: number;
  threshold: number;
}

export default function LoadMonitor({ percentage, threshold }: LoadMonitorProps) {
  const getColor = (pct: number) => {
    if (pct >= threshold) return '#FF003C';
    if (pct >= threshold * 0.7) return '#FFD700';
    return '#00F0FF';
  };

  const color = getColor(percentage);
  const segments = 20;
  const activeSegments = Math.round((percentage / 100) * segments);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity size={14} style={{ color }} />
          <span className="text-[#8A8A9E] text-[10px] font-bold uppercase tracking-widest">
            Load Intensity
          </span>
        </div>
        <span className="font-mono text-sm font-bold" style={{ color }}>
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="flex gap-1.5 h-4">
        {Array.from({ length: segments }).map((_, i) => {
          const isActive = i < activeSegments;
          const segmentPct = (i / segments) * 100;
          let segColor = '#00F0FF';
          if (segmentPct >= threshold) segColor = '#FF003C';
          else if (segmentPct >= threshold * 0.7) segColor = '#FFD700';

          return (
            <motion.div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                backgroundColor: isActive ? segColor : 'rgba(255,255,255,0.05)',
                boxShadow: isActive ? `0 0 8px ${segColor}40` : 'none',
              }}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: isActive ? 1 : 0.3 }}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[#4A4A5E] text-[9px] font-bold uppercase">Safe</span>
        <span className="text-[#FFD700] text-[9px] font-bold uppercase">Warning</span>
        <span className="text-[#FF003C] text-[9px] font-bold uppercase">Critical</span>
      </div>
    </div>
  );
}
