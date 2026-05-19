import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Server, RefreshCw } from 'lucide-react';

interface SettingsPanelProps {
  overloadThreshold: number;
  onSetThreshold: (t: number) => void;
}

export default function SettingsPanel({ overloadThreshold, onSetThreshold }: SettingsPanelProps) {
  const [threshold, setThreshold] = useState(overloadThreshold);
  const [endpoint, setEndpoint] = useState('http://192.168.1.100/api');
  const [interval, setInterval] = useState(1000);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSetThreshold(threshold);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      className="rounded p-6 border border-[#1A1A24] max-w-lg"
      style={{
        background: 'rgba(15, 15, 25, 0.6)',
        backdropFilter: 'blur(8px)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="font-rajdhani text-xl font-semibold text-white mb-6 tracking-wider">
        ESP32 CONFIGURATION
      </h3>

      <div className="space-y-5">
        {/* API Endpoint */}
        <div>
          <label className="text-[#4A4A5E] text-xs font-inter tracking-wider uppercase block mb-2">
            ESP32 API Endpoint
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Server size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A5E]" />
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="w-full bg-[#0A0A10] border border-[#1A1A24] rounded py-2.5 pl-10 pr-3 text-sm font-mono text-white focus:outline-none focus:border-[rgba(0,240,255,0.3)] transition-colors"
                placeholder="http://192.168.1.100/api"
              />
            </div>
            <button
              className="px-3 py-2.5 rounded border border-[#1A1A24] text-[#8A8A9E] hover:text-[#00F0FF] hover:border-[rgba(0,240,255,0.2)] transition-colors"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Update Interval */}
        <div>
          <label className="text-[#4A4A5E] text-xs font-inter tracking-wider uppercase block mb-2">
            Update Interval (ms)
          </label>
          <input
            type="range"
            min={500}
            max={5000}
            step={100}
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            className="w-full accent-[#00F0FF]"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[#4A4A5E] text-xs">500ms</span>
            <span className="font-mono text-sm text-[#00F0FF]">{interval}ms</span>
            <span className="text-[#4A4A5E] text-xs">5000ms</span>
          </div>
        </div>

        {/* Overload Threshold */}
        <div>
          <label className="text-[#4A4A5E] text-xs font-inter tracking-wider uppercase block mb-2">
            Overload Threshold (%)
          </label>
          <input
            type="range"
            min={50}
            max={100}
            step={1}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: threshold > 85 ? '#FF003C' : threshold > 70 ? '#FFD700' : '#00F0FF' }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[#4A4A5E] text-xs">50%</span>
            <span
              className="font-mono text-sm"
              style={{ color: threshold > 85 ? '#FF003C' : threshold > 70 ? '#FFD700' : '#00F0FF' }}
            >
              {threshold}%
            </span>
            <span className="text-[#4A4A5E] text-xs">100%</span>
          </div>
        </div>

        {/* Connection Status */}
        <div className="pt-4 border-t border-[#1A1A24]">
          <div className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: '#00FF9D', boxShadow: '0 0 8px #00FF9D' }}
            />
            <span className="text-[#8A8A9E] text-sm">Simulated Data Mode</span>
            <span className="text-[#4A4A5E] text-xs ml-auto font-mono">
              Demo Stream
            </span>
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          className="w-full py-3 px-4 rounded font-rajdhani font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2"
          style={{
            background: saved ? 'rgba(0, 255, 157, 0.15)' : 'rgba(0, 240, 255, 0.1)',
            border: `1px solid ${saved ? 'rgba(0, 255, 157, 0.3)' : 'rgba(0, 240, 255, 0.2)'}`,
            color: saved ? '#00FF9D' : '#00F0FF',
          }}
          onClick={handleSave}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Save size={16} />
          {saved ? 'Saved Successfully' : 'Apply Settings'}
        </motion.button>
      </div>
    </motion.div>
  );
}
