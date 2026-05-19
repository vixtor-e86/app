import { LayoutDashboard, BarChart3, Settings, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div
      className="w-[180px] h-full flex flex-col py-6 gap-2 z-10"
      style={{
        background: '#0A0A10',
        borderRight: '1px solid #1A1A24',
      }}
    >
      <div className="flex items-center gap-3 px-6 mb-8">
        <div className="bg-[#00F0FF] p-1.5 rounded-lg">
          <Zap size={18} className="text-[#050508]" />
        </div>
        <span className="font-rajdhani font-bold text-white text-sm tracking-wider">METER v2</span>
      </div>

      <div className="flex-1 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all"
              style={{
                color: isActive ? '#00F0FF' : '#8A8A9E',
                background: isActive ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
              }}
              onClick={() => onTabChange(item.id)}
              whileHover={{ scale: 1.02, background: 'rgba(255, 255, 255, 0.03)' }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
              {isActive && (
                <motion.div
                  className="ml-auto w-1 h-4 rounded-full"
                  style={{ background: '#00F0FF' }}
                  layoutId="sidebar-indicator"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="px-6 py-4 mt-auto border-t border-[#1A1A24]">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: '#00FF9D', boxShadow: '0 0 6px #00FF9D' }}
          />
          <span className="text-[#8A8A9E] text-[10px] uppercase font-bold tracking-tighter">System Online</span>
        </div>
        <div className="text-[#4A4A5E] text-[9px] uppercase tracking-tighter">Connected via Serial</div>
      </div>
    </div>
  );
}
