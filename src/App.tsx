import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Activity,
  Gauge,
  Wifi,
  Clock,
  Battery,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Menu
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import MetricCard from './components/MetricCard';
import LoadMonitor from './components/LoadMonitor';
import OverloadPanel from './components/OverloadPanel';
import PowerHistoryChart from './components/PowerHistoryChart';
import SettingsPanel from './components/SettingsPanel';
import { useEnergyData } from './hooks/useEnergyData';
import { useIsMobile } from './hooks/use-mobile';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { 
    data, 
    history, 
    loading,
    activeSensorId, 
    setActiveSensorId, 
    settings, 
    allSettings, 
    allReadings, 
    resetRelay, 
    updateSensorSettings 
  } = useEnergyData();
  const isMobile = useIsMobile();

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#050508]">
        <div className="text-[#00F0FF] font-rajdhani text-lg uppercase tracking-widest animate-pulse">
          Connecting to Smart Energy Database...
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-screen h-screen flex flex-col md:flex-row overflow-hidden"
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

      {/* Sidebar - Desktop */}
      {!isMobile && (
        <div className="relative z-20">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && (
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: -200 }}
                animate={{ x: 0 }}
                exit={{ x: -200 }}
                className="fixed inset-y-0 left-0 z-50"
              >
                <Sidebar 
                  activeTab={activeTab} 
                  onTabChange={(tab) => {
                    setActiveTab(tab);
                    setIsSidebarOpen(false);
                  }} 
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Top Header Bar */}
        <div
          className="h-14 flex items-center justify-between px-4 md:px-6 border-b"
          style={{
            background: 'rgba(10, 10, 16, 0.9)',
            borderColor: '#1A1A24',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-3">
            {isMobile && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded-lg bg-[#1A1A24] text-[#00F0FF]"
              >
                <Menu size={20} />
              </button>
            )}
            <h1
              className="font-rajdhani text-lg md:text-xl font-bold tracking-widest uppercase"
              style={{ color: '#00F0FF' }}
            >
              {isMobile ? 'Smart Meter' : 'Smart Energy Meter'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1A1A24] px-2 md:px-3 py-1 rounded-full">
              <Wifi size={12} className="md:size-[14px]" style={{ color: '#00FF9D' }} />
              <span className="text-[#00FF9D] text-[10px] md:text-xs font-medium">Database Connected</span>
            </div>
            {!isMobile && (
              <div className="flex items-center gap-2">
                <Clock size={14} style={{ color: '#8A8A9E' }} />
                <span className="text-[#8A8A9E] text-xs font-mono">
                  {formatTime(data.timestamp)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                className="flex flex-col gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* 3-Channel Grid Switcher */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((id) => {
                    const reading = allReadings[id];
                    const setting = allSettings[id];
                    const isActive = activeSensorId === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setActiveSensorId(id)}
                        className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-[100px] cursor-pointer ${
                          isActive 
                            ? 'border-[#00F0FF] bg-[rgba(0,240,255,0.05)]' 
                            : 'border-[#1A1A24] bg-[rgba(15,15,25,0.4)] hover:border-[rgba(0,240,255,0.2)]'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className={`text-[10px] uppercase font-bold tracking-widest ${isActive ? 'text-[#00F0FF]' : 'text-[#8A8A9E]'}`}>
                            Channel {id}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="text-[10px] text-[#8A8A9E]">{setting?.relay_state ? 'RELAY ON' : 'TRIPPED'}</span>
                            <span className={`w-2.5 h-2.5 rounded-full ${setting?.relay_state ? 'bg-[#00FF9D]' : 'bg-[#FF0055]'}`} />
                          </span>
                        </div>
                        <div>
                          <div className="text-2xl font-bold font-mono text-white">
                            {reading ? `${Math.round(reading.power)} W` : '0 W'}
                          </div>
                          <div className="text-[10px] text-[#8A8A9E] mt-1 font-mono">
                            {reading ? `${reading.voltage.toFixed(1)}V | ${reading.current.toFixed(2)}A` : 'No readings received'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Channel Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

                {/* Adaptive Grid for charts and controls */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Protection & Monitor */}
                  <div className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
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
                          Channel {activeSensorId} Protection Status
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
                          Channel {activeSensorId} Current Load
                        </h3>
                      </div>
                      <LoadMonitor
                        percentage={data.loadPercentage}
                        threshold={data.overloadThreshold}
                      />
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="lg:col-span-5 flex flex-col gap-6 order-1 lg:order-2">
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
                            Channel {activeSensorId} Usage Trends
                          </span>
                        </div>
                      </div>
                      <div className="h-[250px] md:h-[300px] p-4">
                        <PowerHistoryChart
                          voltage={history.voltage}
                          current={history.current}
                          timestamps={history.timestamps}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <MetricCard
                        label="P. Factor"
                        value={data.powerFactor}
                        unit=""
                        icon={<Cpu size={16} />}
                        color="#8A8A9E"
                      />
                      <MetricCard
                        label="Freq"
                        value={data.frequency}
                        unit="Hz"
                        icon={<Activity size={16} />}
                        color="#8A8A9E"
                      />
                    </div>
                  </div>

                  {/* Project Info & Status */}
                  <div className="lg:col-span-3 flex flex-col gap-6 order-3">
                    <div
                      className="rounded-xl p-5 border border-[#1A1A24]"
                      style={{
                        background: 'rgba(15, 15, 25, 0.6)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <h3 className="text-white font-rajdhani font-bold text-sm uppercase tracking-widest mb-3">
                        System Setup
                      </h3>
                      <p className="text-[#8A8A9E] text-[11px] leading-relaxed mb-4">
                        Real-time monitoring and automated protection system across 3 independent output channels.
                      </p>
                      <div className="space-y-3 font-mono text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-[#6A6A7E]">PZEM #1:</span>
                          <span className="text-[#00F0FF]">Pins G12/G14</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6A6A7E]">Relay #1:</span>
                          <span className="text-[#00FF9D]">Pin G27</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6A6A7E]">PZEM Serial:</span>
                          <span className="text-[#FFD700]">Pins G15/G2</span>
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
                        Diagnostics
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9D]" />
                          <span className="text-[#8A8A9E] text-[9px] uppercase font-bold">SQL Database Online</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                          <span className="text-[#8A8A9E] text-[9px] uppercase font-bold">Auto Refresh Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                className="flex flex-col items-center justify-start md:pt-4 h-full gap-6 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Channel Selector for Settings */}
                <div className="flex bg-[#0A0A10] border border-[#1A1A24] p-1.5 rounded-lg">
                  {[1, 2, 3].map((id) => (
                    <button
                      key={id}
                      onClick={() => setActiveSensorId(id)}
                      className={`px-6 py-2 rounded font-rajdhani text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                        activeSensorId === id 
                          ? 'bg-[#00F0FF] text-[#050508]' 
                          : 'text-[#8A8A9E] hover:text-white'
                      }`}
                    >
                      Channel {id} Settings
                    </button>
                  ))}
                </div>

                <SettingsPanel
                  activeSensorId={activeSensorId}
                  settings={settings}
                  onUpdateSettings={updateSensorSettings}
                />
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                className="flex flex-col items-center justify-start h-full gap-6 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="rounded-xl p-4 md:p-8 border border-[#1A1A24] w-full max-w-4xl"
                  style={{
                    background: 'rgba(15, 15, 25, 0.6)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-rajdhani text-xl md:text-2xl font-bold text-white tracking-widest uppercase">
                      Channel {activeSensorId} Analytics
                    </h2>
                    {/* Settings Switcher for Analytics */}
                    <div className="flex bg-[#0A0A10] border border-[#1A1A24] p-1 rounded-lg">
                      {[1, 2, 3].map((id) => (
                        <button
                          key={id}
                          onClick={() => setActiveSensorId(id)}
                          className={`px-3 py-1.5 rounded font-rajdhani text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            activeSensorId === id 
                              ? 'bg-[#00F0FF] text-[#050508]' 
                              : 'text-[#8A8A9E] hover:text-white'
                          }`}
                        >
                          Ch {id}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                    <div className="text-center p-3 md:p-5 rounded-lg border border-[#1A1A24] bg-[rgba(10,10,20,0.4)]">
                      <div className="text-[#4A4A5E] text-[9px] md:text-[10px] uppercase tracking-widest mb-1 md:mb-2">Peak Volts</div>
                      <div className="font-mono text-lg md:text-2xl text-[#00F0FF]">
                        {history.voltage.length > 0 ? Math.max(...history.voltage, 0).toFixed(1) : '0.0'}V
                      </div>
                    </div>
                    <div className="text-center p-3 md:p-5 rounded-lg border border-[#1A1A24] bg-[rgba(10,10,20,0.4)]">
                      <div className="text-[#4A4A5E] text-[9px] md:text-[10px] uppercase tracking-widest mb-1 md:mb-2">Peak Amps</div>
                      <div className="font-mono text-lg md:text-2xl text-[#FF00FF]">
                        {history.current.length > 0 ? Math.max(...history.current, 0).toFixed(2) : '0.00'}A
                      </div>
                    </div>
                    <div className="text-center p-3 md:p-5 rounded-lg border border-[#1A1A24] bg-[rgba(10,10,20,0.4)]">
                      <div className="text-[#4A4A5E] text-[9px] md:text-[10px] uppercase tracking-widest mb-1 md:mb-2">Avg Power</div>
                      <div className="font-mono text-lg md:text-2xl text-[#FFD700]">
                        {history.power.length > 0
                          ? (history.power.reduce((a, b) => a + b, 0) / history.power.length).toFixed(0)
                          : '0'}W
                      </div>
                    </div>
                    <div className="text-center p-3 md:p-5 rounded-lg border border-[#1A1A24] bg-[rgba(10,10,20,0.4)]">
                      <div className="text-[#4A4A5E] text-[9px] md:text-[10px] uppercase tracking-widest mb-1 md:mb-2">Samples</div>
                      <div className="font-mono text-lg md:text-2xl text-[#00FF9D]">
                        {history.voltage.length}
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-xl border border-[#1A1A24] overflow-hidden"
                    style={{ height: isMobile ? '250px' : '350px' }}
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
