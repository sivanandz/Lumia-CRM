import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  HardDrive, 
  Bot, 
  Settings,
  LogOut
} from 'lucide-react';
import { Tab } from '../types';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  
  const menuItems = [
    { icon: LayoutDashboard, label: Tab.DASHBOARD },
    { icon: Users, label: Tab.CLIENTS },
    { icon: TrendingUp, label: Tab.FUNDS },
    { icon: ShieldCheck, label: Tab.INSURANCE },
    { icon: Calendar, label: Tab.CALENDAR },
    { icon: HardDrive, label: Tab.DRIVE },
    { icon: Bot, label: Tab.AI_ADVISOR, special: true },
  ];

  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="h-full flex flex-col justify-between py-6 pl-6 pr-2 w-20 md:w-64 transition-all duration-300 z-20"
    >
      {/* Logo Area */}
      <div className="flex items-center gap-3 mb-10 pl-2">
        <motion.div 
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-300 flex items-center justify-center shadow-lg shadow-emerald-500/30"
        >
          <span className="text-white font-bold text-xl">L</span>
        </motion.div>
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden md:block text-2xl font-semibold text-white tracking-wide drop-shadow-md"
        >
          Lumina
        </motion.span>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col gap-4">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setActiveTab(item.label)}
            className={`
              group flex items-center gap-4 p-3 rounded-full transition-all duration-300 relative
              ${activeTab !== item.label ? 'hover:bg-white/10' : ''}
            `}
          >
             {/* Active Background Animation */}
             {activeTab === item.label && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/20 rounded-full border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
             )}

            <div className="relative z-10 flex items-center gap-4">
              <item.icon 
                size={24} 
                className={`
                  transition-colors duration-200
                  ${activeTab === item.label ? 'text-emerald-300' : 'text-white/70 group-hover:text-white'}
                  ${item.special ? 'text-pink-300 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]' : ''}
                `} 
              />
              <span className={`
                hidden md:block text-sm font-medium tracking-wide
                ${activeTab === item.label ? 'text-white' : 'text-white/70 group-hover:text-white'}
              `}>
                {item.label}
              </span>
            </div>
            
            {/* Active Indicator Dot */}
            {activeTab === item.label && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] hidden md:block" 
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2 mt-auto">
        <motion.button 
          whileHover={{ scale: 1.05, x: 5 }}
          className="flex items-center gap-4 p-3 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        >
          <Settings size={24} />
          <span className="hidden md:block text-sm">Settings</span>
        </motion.button>
      </div>
    </motion.div>
  );
};