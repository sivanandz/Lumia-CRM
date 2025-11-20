import React from 'react';
import { GlassCard } from './GlassCard';
import { ArrowUpRight, ArrowDownRight, IndianRupee, Activity, PieChart as PieIcon, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AnimatedWrapper } from './AnimatedWrapper';
import { motion } from 'framer-motion';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 7500 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const Dashboard: React.FC = () => {
  return (
    <AnimatedWrapper className="space-y-6">
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-md">Good morning, Advisor</h1>
            <p className="text-white/60">Market update: NIFTY 50 is up by 0.8% today.</p>
          </div>
          <GlassCard className="px-4 py-2 flex items-center gap-2 bg-emerald-500/20 border-emerald-500/30">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-emerald-400" 
            />
            <span className="text-sm font-medium text-emerald-100">System Online • Sync Active</span>
          </GlassCard>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6" hoverEffect>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300">
                  <IndianRupee size={24} />
                </div>
                <span className="flex items-center text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-lg">
                  +12.5% <ArrowUpRight size={14} className="ml-1" />
                </span>
              </div>
              <h3 className="text-white/60 text-sm font-medium">Total AUM</h3>
              <p className="text-3xl font-bold text-white mt-1">₹42.5 Cr</p>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard className="p-6" hoverEffect>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-300">
                  <Users size={24} />
                </div>
                <span className="flex items-center text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-lg">
                  +4 New
                </span>
              </div>
              <h3 className="text-white/60 text-sm font-medium">Active Clients</h3>
              <p className="text-3xl font-bold text-white mt-1">142</p>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard className="p-6" hoverEffect>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300">
                  <Activity size={24} />
                </div>
                <span className="flex items-center text-rose-400 text-sm font-medium bg-rose-400/10 px-2 py-1 rounded-lg">
                  -2.1% <ArrowDownRight size={14} className="ml-1" />
                </span>
              </div>
              <h3 className="text-white/60 text-sm font-medium">Monthly SIP Flow</h3>
              <p className="text-3xl font-bold text-white mt-1">₹85.2 Lakh</p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Charts & Lists Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
          {/* Main Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2 h-full">
            <GlassCard className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Portfolio Growth</h3>
                <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-white/80 outline-none">
                  <option value="6m" className="bg-gray-900">Last 6 Months</option>
                  <option value="1y" className="bg-gray-900">Last Year</option>
                </select>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white' }}
                      itemStyle={{ color: '#34d399' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Actions / Recent */}
          <motion.div variants={itemVariants} className="h-full">
            <GlassCard className="p-6 overflow-hidden relative h-full">
               <h3 className="text-lg font-semibold text-white mb-4">Upcoming Meetings</h3>
               <div className="space-y-4">
                 {[
                   { name: 'Rahul Verma', time: '14:00', type: 'Portfolio Review', date: 'Today' },
                   { name: 'Priya Singh', time: '16:30', type: 'New Insurance Policy', date: 'Today' },
                   { name: 'Amit Shah', time: '10:00', type: 'Tax Planning', date: 'Tomorrow' },
                 ].map((meeting, idx) => (
                   <motion.div 
                     key={idx} 
                     whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                     className="flex items-center gap-4 p-3 rounded-xl transition-colors cursor-pointer group"
                   >
                     <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400/20 to-red-400/20 flex flex-col items-center justify-center border border-white/10 group-hover:border-white/30 transition-colors">
                        <span className="text-xs font-bold text-white">{meeting.time}</span>
                     </div>
                     <div>
                       <h4 className="text-white font-medium">{meeting.name}</h4>
                       <p className="text-white/50 text-xs">{meeting.type}</p>
                     </div>
                     <div className="ml-auto text-xs text-white/40">{meeting.date}</div>
                   </motion.div>
                 ))}
               </div>
               
               {/* Decorative Blur */}
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/30 rounded-full blur-[50px]" />
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </AnimatedWrapper>
  );
};