import { motion } from 'framer-motion';
import { Shield, ShieldAlert, RotateCcw, Zap, AlertTriangle, Activity } from 'lucide-react';
import type { EnergyData } from '../hooks/useEnergyData';

interface OverloadPanelProps {
  data: EnergyData;
  onResetRelay: () => void;
}

export default function OverloadPanel({ data, onResetRelay }: OverloadPanelProps) {
  const isTripped = data.relayStatus === 'tripped';
  const statusColor = isTripped ? '#FF003C' : '#00FF9D';
  const statusText = isTripped ? 'OVERLOAD TRIPPED' : 'SYSTEM ACTIVE';

  return (
    <motion.div
      className="rounded-lg p-4 border border-[#1A1A24]"
      style={{
        background: 'rgba(10, 10, 20, 0.4)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isTripped ? (
            <div className="bg-[#FF003C]/20 p-1.5 rounded-full">
              <ShieldAlert size={16} style={{ color: '#FF003C' }} />
            </div>
          ) : (
            <div className="bg-[#00FF9D]/20 p-1.5 rounded-full">
              <Shield size={16} style={{ color: '#00FF9D' }} />
            </div>
          )}
          <span className="text-[#8A8A9E] text-[10px] font-bold uppercase tracking-widest">
            Relay Protection
          </span>
        </div>
        {isTripped && (
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex items-center gap-1 text-[#FF003C] text-[9px] font-bold"
          >
            <AlertTriangle size={10} />
            DANGER
          </motion.div>
        )}
      </div>

      <motion.div
        className="font-rajdhani text-2xl font-bold tracking-widest mb-4 flex items-center gap-3"
        style={{ color: statusColor }}
      >
        {statusText}
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-[#1A1A24]/50 p-3 rounded border border-[#1A1A24]">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={10} className="text-[#FFD700]" />
            <span className="text-[#4A4A5E] text-[9px] uppercase font-bold tracking-tighter">Limit</span>
          </div>
          <div className="font-mono text-xl font-bold text-white">
            {data.overloadThreshold}%
          </div>
        </div>
        <div className="bg-[#1A1A24]/50 p-3 rounded border border-[#1A1A24]">
          <div className="flex items-center gap-1.5 mb-1">
            <Activity size={10} className="text-[#00F0FF]" />
            <span className="text-[#4A4A5E] text-[9px] uppercase font-bold tracking-tighter">Current</span>
          </div>
          <div
            className="font-mono text-xl font-bold"
            style={{ color: data.loadPercentage > data.overloadThreshold ? '#FF003C' : '#00F0FF' }}
          >
            {data.loadPercentage.toFixed(1)}%
          </div>
        </div>
      </div>

      {isTripped ? (
        <motion.button
          className="w-full py-3 px-4 rounded-lg font-rajdhani font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2"
          style={{
            background: '#FF003C',
            color: 'white',
          }}
          onClick={onResetRelay}
          whileHover={{ scale: 1.02, background: '#FF2E5B' }}
          whileTap={{ scale: 0.98 }}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <RotateCcw size={16} />
          Reset Relay & Power
        </motion.button>
      ) : (
        <div className="text-center py-2 px-3 rounded bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.1)]">
           <span className="text-[#00FF9D] text-[10px] font-bold uppercase tracking-widest">
            Safe Operating Zone
           </span>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-[#1A1A24]">
        <p className="text-[#4A4A5E] text-[10px] leading-relaxed italic">
          {isTripped 
            ? "Safety relay has cut power because the load exceeded the set limit. Remove excess load before resetting." 
            : "The system is monitoring power flow. If load exceeds the limit, the relay will automatically trip to protect the circuit."}
        </p>
      </div>
    </motion.div>
  );
}
