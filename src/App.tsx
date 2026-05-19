import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Activity,
  Gauge,
  Thermometer,
  Droplets,
  Wifi,
  Clock,
  Battery,
  ShieldCheck,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import MetricCard from './components/MetricCard';
import LoadMonitor from './components/LoadMonitor';
import OverloadPanel from './components/OverloadPanel';
import PowerHistoryChart from './components/PowerHistoryChart';
import SettingsPanel from './components/SettingsPanel';
import { useEnergyData } from './hooks/useEnergyData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { data, history, setOverloadThreshold, resetRelay } = useEnergyData();

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div
      className="w-screen h-screen flex overflow-hidden"
      style={{
        background: '#050508',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Background image */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'url(/bg-dark.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Sidebar */}
      <div className="relative z-10">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Top Header Bar */}
        <div
          className="h-14 flex items-center justify-between px-6 border-b"
          style={{
            background: 'rgba(10, 10, 16, 0.9)',
            borderColor: '#1A1A24',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-3">
            <h1
              className="font-rajdhani text-xl font-bold tracking-widest uppercase"
              style={{ color: '#00F0FF' }}
            >
              Smart Energy Meter
            </h1>
            <span className="text-[#4A4A5E] text-[10px] font-inter px-2 py-0.5 rounded border border-[#1A1A24]">
              STUDENT PROJECT
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#1A1A24] px-3 py-1 rounded-full">
              <Wifi size={14} style={{ color: '#00FF9D' }} />
              <span className="text-[#00FF9D] text-xs font-medium">Connected to ESP32</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} style={{ color: '#8A8A9E' }} />
              <span className="text-[#8A8A9E] text-xs font-mono">
                {formatTime(data.timestamp)}
              </span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                className="grid grid-cols-12 gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Main Metrics Row */}
                <div className="col-span-12 grid grid-cols-4 gap-4">
                  <MetricCard
                    label="Voltage"
                    value={data.voltage}
                    unit="Volts (V)"
                    icon={<Zap size={20} />}
                    color="#00F0FF"
                    pulse
                  />
                  <MetricCard
                    label="Current"
                    value={data.current}
                    unit="Amps (A)"
                    icon={<Activity size={20} />}
                    color="#FF00FF"
                  />
                  <MetricCard
                    label="Power"
                    value={data.power}
                    unit="Watts (W)"
                    icon={<Gauge size={20} />}
                    color="#FFD700"
                    pulse
                  />
                  <MetricCard
                    label="Energy"
                    value={data.energyToday}
                    unit="kWh"
                    icon={<Battery size={20} />}
                    color="#00FF9D"
                  />
                </div>

                {/* Left Column: Protection & Monitor */}
                <div className="col-span-4 flex flex-col gap-6">
                   <div
                    className="rounded-xl p-5 border border-[#1A1A24]"
                    style={{
                      background: 'rgba(15, 15, 25, 0.6)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldCheck size={18} className="text-[#00F0FF]" />
                      <h3 className="text-white font-rajdhani font-bold text-sm uppercase tracking-wider">
                        Protection System
                      </h3>
                    </div>
                    <OverloadPanel data={data} onResetRelay={resetRelay} />
                  </div>

                  <div
                    className="rounded-xl p-5 border border-[#1A1A24]"
                    style={{
                      background: 'rgba(15, 15, 25, 0.6)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Activity size={18} className="text-[#FF00FF]" />
                      <h3 className="text-white font-rajdhani font-bold text-sm uppercase tracking-wider">
                        Load Monitoring
                      </h3>
                    </div>
                    <LoadMonitor
                      percentage={data.loadPercentage}
                      threshold={data.overloadThreshold}
                    />
                  </div>
                </div>

                {/* Center Column: Charts */}
                <div className="col-span-5 flex flex-col gap-6">
                  <div
                    className="rounded-xl border border-[#1A1A24] overflow-hidden"
                    style={{
                      background: 'rgba(15, 15, 25, 0.4)',
                    }}
                  >
                    <div className="px-5 py-3 flex items-center justify-between border-b border-[#1A1A24] bg-[rgba(20,20,30,0.5)]">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} style={{ color: '#00F0FF' }} />
                        <span className="text-white text-xs font-bold font-rajdhani tracking-wider uppercase">
                          Power Usage Trends
                        </span>
                      </div>
                    </div>
                    <div className="h-[300px] p-4">
                      <PowerHistoryChart
                        voltage={history.voltage}
                        current={history.current}
                        timestamps={history.timestamps}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard
                      label="Power Factor"
                      value={data.powerFactor}
                      unit=""
                      icon={<Cpu size={16} />}
                      color="#8A8A9E"
                    />
                    <MetricCard
                      label="Frequency"
                      value={data.frequency}
                      unit="Hz"
                      icon={<Activity size={16} />}
                      color="#8A8A9E"
                    />
                  </div>
                </div>

                {/* Right Column: Environment & Info */}
                <div className="col-span-3 flex flex-col gap-6">
                  <div
                    className="rounded-xl p-5 border border-[#1A1A24]"
                    style={{
                      background: 'rgba(15, 15, 25, 0.6)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Thermometer size={18} className="text-[#FF8C00]" />
                      <h3 className="text-white font-rajdhani font-bold text-sm uppercase tracking-wider">
                        Device Status
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Thermometer size={16} className="text-[#FF8C00]" />
                          <span className="text-[#8A8A9E] text-xs">Temperature</span>
                        </div>
                        <span className="text-white font-mono">{data.temperature}°C</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Droplets size={16} className="text-[#00BFFF]" />
                          <span className="text-[#8A8A9E] text-xs">Humidity</span>
                        </div>
                        <span className="text-white font-mono">{data.humidity}%</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-xl p-5 border border-[#1A1A24] flex-1"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.05) 0%, rgba(15, 15, 25, 0.6) 100%)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <h3 className="text-white font-rajdhani font-bold text-sm uppercase tracking-widest mb-3">
                      Project Info
                    </h3>
                    <p className="text-[#8A8A9E] text-[11px] leading-relaxed mb-4">
                      Smart energy meter with real-time monitoring and automated overload protection.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                        <span className="text-[#8A8A9E] text-[10px] uppercase">ESP32 Controller</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9D]" />
                        <span className="text-[#8A8A9E] text-[10px] uppercase">Relay Protection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF00FF]" />
                        <span className="text-[#8A8A9E] text-[10px] uppercase">IoT Dashboard</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                className="flex items-start justify-center pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SettingsPanel
                  overloadThreshold={data.overloadThreshold}
                  onSetThreshold={setOverloadThreshold}
                />
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                className="flex flex-col items-center justify-center h-full gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="rounded-xl p-8 border border-[#1A1A24] w-full max-w-4xl"
                  style={{
                    background: 'rgba(15, 15, 25, 0.6)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <h2 className="font-rajdhani text-2xl font-bold text-white mb-6 tracking-widest text-center">
                    SYSTEM ANALYTICS
                  </h2>
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="text-center p-5 rounded-lg border border-[#1A1A24] bg-[rgba(10,10,20,0.4)]">
                      <div className="text-[#4A4A5E] text-[10px] uppercase tracking-widest mb-2">Peak Voltage</div>
                      <div className="font-mono text-2xl text-[#00F0FF]">
                        {Math.max(...history.voltage, 0).toFixed(1)}V
                      </div>
                    </div>
                    <div className="text-center p-5 rounded-lg border border-[#1A1A24] bg-[rgba(10,10,20,0.4)]">
                      <div className="text-[#4A4A5E] text-[10px] uppercase tracking-widest mb-2">Peak Current</div>
                      <div className="font-mono text-2xl text-[#FF00FF]">
                        {Math.max(...history.current, 0).toFixed(2)}A
                      </div>
                    </div>
                    <div className="text-center p-5 rounded-lg border border-[#1A1A24] bg-[rgba(10,10,20,0.4)]">
                      <div className="text-[#4A4A5E] text-[10px] uppercase tracking-widest mb-2">Avg Power</div>
                      <div className="font-mono text-2xl text-[#FFD700]">
                        {history.power.length > 0
                          ? (history.power.reduce((a, b) => a + b, 0) / history.power.length).toFixed(0)
                          : '0'}W
                      </div>
                    </div>
                    <div className="text-center p-5 rounded-lg border border-[#1A1A24] bg-[rgba(10,10,20,0.4)]">
                      <div className="text-[#4A4A5E] text-[10px] uppercase tracking-widest mb-2">Samples</div>
                      <div className="font-mono text-2xl text-[#00FF9D]">
                        {history.voltage.length}
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-xl border border-[#1A1A24] overflow-hidden"
                    style={{ height: '350px' }}
                  >
                    <PowerHistoryChart
                      voltage={history.voltage}
                      current={history.current}
                      timestamps={history.timestamps}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
