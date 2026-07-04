import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Shield, Power, ShieldAlert } from 'lucide-react';
import { MeterSettings } from '../lib/supabase';

interface SettingsPanelProps {
  activeSensorId: number;
  settings: MeterSettings | undefined;
  onUpdateSettings: (sensorId: number, data: Partial<Omit<MeterSettings, 'sensor_id'>>) => Promise<boolean>;
}

export default function SettingsPanel({ activeSensorId, settings, onUpdateSettings }: SettingsPanelProps) {
  const [minVoltage, setMinVoltage] = useState(180);
  const [maxVoltage, setMaxVoltage] = useState(260);
  const [maxPower, setMaxPower] = useState(3000);
  const [relayState, setRelayState] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync state with settings prop when it changes
  useEffect(() => {
    if (settings) {
      setMinVoltage(settings.min_voltage);
      setMaxVoltage(settings.max_voltage);
      setMaxPower(settings.max_power);
      setRelayState(settings.relay_state);
    }
  }, [settings, activeSensorId]);

  const handleSave = async () => {
    setSaving(true);
    const success = await onUpdateSettings(activeSensorId, {
      min_voltage: minVoltage,
      max_voltage: maxVoltage,
      max_power: maxPower,
      relay_state: relayState,
    });
    setSaving(false);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <motion.div
      className="rounded-xl p-6 border border-[#1A1A24] w-full max-w-lg"
      style={{
        background: 'rgba(15, 15, 25, 0.6)',
        backdropFilter: 'blur(8px)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-rajdhani text-xl font-bold text-white tracking-widest uppercase">
          Sensor {activeSensorId} Configuration
        </h3>
        <span className="text-[10px] uppercase font-bold tracking-widest bg-[rgba(0,240,255,0.1)] text-[#00F0FF] border border-[rgba(0,240,255,0.2)] px-2.5 py-1 rounded">
          Channel {activeSensorId}
        </span>
      </div>

      <div className="space-y-6">
        {/* Relay State Toggle */}
        <div className="p-4 rounded-lg border border-[#1A1A24] bg-[rgba(10,10,20,0.4)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Power size={18} className={relayState ? "text-[#00FF9D]" : "text-[#FF0055]"} />
            <div>
              <div className="text-white text-sm font-semibold">Relay Switch</div>
              <div className="text-[#6A6A7E] text-[10px]">Manually switch load ON or OFF</div>
            </div>
          </div>
          <button
            onClick={() => setRelayState(!relayState)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
              relayState ? 'bg-[#00FF9D]' : 'bg-[#FF0055]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-[#050508] transform transition-transform duration-200 ${
                relayState ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Min Voltage */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[#8A8A9E] text-xs font-inter tracking-wider uppercase">
              Under-Voltage Threshold
            </label>
            <span className="font-mono text-xs text-[#00F0FF]">{minVoltage}V</span>
          </div>
          <input
            type="range"
            min={100}
            max={220}
            step={1}
            value={minVoltage}
            onChange={(e) => setMinVoltage(Number(e.target.value))}
            className="w-full accent-[#00F0FF]"
          />
          <div className="flex justify-between text-[10px] text-[#4A4A5E] mt-1">
            <span>100V</span>
            <span>Recommended: 180V</span>
            <span>220V</span>
          </div>
        </div>

        {/* Max Voltage */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[#8A8A9E] text-xs font-inter tracking-wider uppercase">
              Over-Voltage Threshold
            </label>
            <span className="font-mono text-xs text-[#FF0055]">{maxVoltage}V</span>
          </div>
          <input
            type="range"
            min={220}
            max={280}
            step={1}
            value={maxVoltage}
            onChange={(e) => setMaxVoltage(Number(e.target.value))}
            className="w-full accent-[#FF0055]"
          />
          <div className="flex justify-between text-[10px] text-[#4A4A5E] mt-1">
            <span>220V</span>
            <span>Recommended: 260V</span>
            <span>280V</span>
          </div>
        </div>

        {/* Max Power Limit */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[#8A8A9E] text-xs font-inter tracking-wider uppercase">
              Max Power Limit (Overload)
            </label>
            <span className="font-mono text-xs text-[#FFD700]">{maxPower} Watts</span>
          </div>
          <input
            type="range"
            min={500}
            max={10000}
            step={100}
            value={maxPower}
            onChange={(e) => setMaxPower(Number(e.target.value))}
            className="w-full accent-[#FFD700]"
          />
          <div className="flex justify-between text-[10px] text-[#4A4A5E] mt-1">
            <span>500W</span>
            <span>Recommended: 3000W</span>
            <span>10kW</span>
          </div>
        </div>

        {/* System Warnings Info */}
        <div className="pt-4 border-t border-[#1A1A24] space-y-2">
          <div className="flex items-start gap-2 text-[10px] text-[#8A8A9E]">
            <Shield size={12} className="text-[#00F0FF] mt-0.5 shrink-0" />
            <span>If voltage goes below {minVoltage}V or exceeds {maxVoltage}V, the ESP32 will auto-trip the relay.</span>
          </div>
          <div className="flex items-start gap-2 text-[10px] text-[#8A8A9E]">
            <ShieldAlert size={12} className="text-[#FFD700] mt-0.5 shrink-0" />
            <span>If active power exceeds {maxPower}W, an overload event is logged and power will be cut off.</span>
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          disabled={saving}
          className="w-full py-3 px-4 rounded font-rajdhani font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
          style={{
            background: saved 
              ? 'rgba(0, 255, 157, 0.15)' 
              : saving 
                ? 'rgba(255, 215, 0, 0.1)' 
                : 'rgba(0, 240, 255, 0.1)',
            border: `1px solid ${
              saved 
                ? 'rgba(0, 255, 157, 0.3)' 
                : saving 
                  ? 'rgba(255, 215, 0, 0.2)' 
                  : 'rgba(0, 240, 255, 0.2)'
            }`,
            color: saved 
              ? '#00FF9D' 
              : saving 
                ? '#FFD700' 
                : '#00F0FF',
          }}
          onClick={handleSave}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Save size={16} />
          {saving ? 'Updating Database...' : saved ? 'Settings Saved' : 'Save Configuration'}
        </motion.button>
      </div>
    </motion.div>
  );
}
