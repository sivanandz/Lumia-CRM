
import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Client } from '../types';
import { AnimatedWrapper } from './AnimatedWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Shield, 
  MoreHorizontal, 
  Plus,
  ChevronRight,
  Clock,
  ArrowUpRight,
  Filter,
  Tag,
  ChevronDown
} from 'lucide-react';

interface ClientsViewProps {
  clients: Client[];
  onOpenForm: () => void;
}

// Internal Animated Status Component
const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'Active') {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
        <div className="relative flex h-2 w-2 items-center justify-center">
          <motion.span 
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" 
          />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </div>
        <span className="text-[10px] font-semibold text-emerald-300 tracking-wide uppercase leading-none">{status}</span>
      </div>
    );
  }
  if (status === 'Onboarding') {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-2.5 h-2.5 border-2 border-blue-400/30 border-t-blue-400 rounded-full"
        />
        <span className="text-[10px] font-semibold text-blue-300 tracking-wide uppercase leading-none">{status}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
      <span className="text-[10px] font-semibold text-amber-300 tracking-wide uppercase leading-none">{status}</span>
    </div>
  );
};

export const ClientsView: React.FC<ClientsViewProps> = ({ clients, onOpenForm }) => {
  // Use the first client as default selected if available, or null
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients.length > 0 ? clients[0] : null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Active', 'Onboarding', 'Lead', 'High Value', 'Aggressive', 'Moderate', 'Conservative', 'Recent Activity'];

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesFilter = true;
    
    if (activeFilter === 'All') {
      matchesFilter = true;
    } else if (['Active', 'Onboarding', 'Lead'].includes(activeFilter)) {
      matchesFilter = c.status === activeFilter;
    } else if (activeFilter === 'High Value') {
      matchesFilter = c.aum > 10000000; // > 1 Cr
    } else if (['Aggressive', 'Moderate', 'Conservative'].includes(activeFilter)) {
      matchesFilter = c.riskProfile === activeFilter;
    } else if (activeFilter === 'Recent Activity') {
      const lastMeeting = new Date(c.lastMeeting);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      matchesFilter = lastMeeting > thirtyDaysAgo;
    }

    return matchesSearch && matchesFilter;
  });

  const getHistoryIcon = (type: string) => {
    switch(type) {
      case 'Meeting': return <Calendar size={16} className="text-blue-300" />;
      case 'Call': return <Phone size={16} className="text-green-300" />;
      case 'Email': return <Mail size={16} className="text-purple-300" />;
      case 'Transaction': return <ArrowUpRight size={16} className="text-emerald-300" />;
      default: return <Clock size={16} className="text-gray-300" />;
    }
  };

  return (
    <AnimatedWrapper className="h-full flex gap-6 relative">
      
      {/* Client List Sidebar */}
      <div className="w-1/3 flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Clients</h2>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onOpenForm}
            className="p-2 rounded-full bg-emerald-500 text-black shadow-lg shadow-emerald-500/30"
          >
            <Plus size={20} />
          </motion.button>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Search name, email, tag..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder-white/30 focus:bg-white/10 focus:border-white/30 focus:outline-none transition-all"
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-10 text-white appearance-none focus:bg-white/10 focus:border-white/30 outline-none transition-all cursor-pointer"
            >
              {filters.map(filter => (
                <option key={filter} value={filter} className="bg-gray-900 text-white">
                  {filter}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          <div className="flex justify-between items-center px-2 pb-2 text-xs text-white/40">
            <span>{filteredClients.length} Clients found</span>
            <span>{activeFilter}</span>
          </div>
          <AnimatePresence>
            {filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedClient(client)}
              >
                <GlassCard 
                  className={`p-4 cursor-pointer transition-all border-l-4 ${selectedClient?.id === client.id ? 'bg-white/10 border-l-emerald-400' : 'border-l-transparent hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-medium border border-white/10 shrink-0">
                      {client.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                         <h3 className="text-white font-medium truncate text-sm">{client.name}</h3>
                         <span className="text-[10px] text-white/30 whitespace-nowrap ml-2">{client.location.split(',')[0]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={client.status} />
                      </div>
                    </div>
                    <ChevronRight size={16} className={`text-white/30 transition-transform shrink-0 ${selectedClient?.id === client.id ? 'rotate-90' : ''}`} />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
            {filteredClients.length === 0 && (
              <div className="text-center py-10 text-white/30 text-sm">
                No clients found matching "{activeFilter}" filter.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Detailed View */}
      <div className="flex-1 h-full">
        <AnimatePresence mode="wait">
          {selectedClient ? (
            <motion.div 
              key={selectedClient.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full"
            >
              <GlassCard className="h-full flex flex-col p-0 overflow-hidden">
                
                {/* Header Banner */}
                <div className="relative h-32 bg-gradient-to-r from-emerald-900/50 to-cyan-900/50 shrink-0">
                  <div className="absolute -bottom-10 left-8 flex items-end gap-6">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 p-0.5 shadow-xl shrink-0"
                    >
                      <div className="w-full h-full bg-black/40 backdrop-blur-md rounded-[14px] flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{selectedClient.avatar}</span>
                      </div>
                    </motion.div>
                    <div className="mb-2">
                      <h1 className="text-2xl font-bold text-white">{selectedClient.name}</h1>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <MapPin size={14} /> {selectedClient.location}
                      </div>
                    </div>
                  </div>
                  
                  {/* Top Actions */}
                  <div className="absolute top-6 right-6 flex gap-3">
                    <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-md transition-all border border-white/10">
                      Log Meeting
                    </button>
                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>

                {/* Content Scroll */}
                <div className="flex-1 overflow-y-auto pt-14 px-8 pb-8 space-y-8 custom-scrollbar">
                  
                  {/* Tags Section */}
                  {selectedClient.tags && selectedClient.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.tags.map((tag, i) => (
                        <motion.span 
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + (i * 0.05) }}
                          className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-200 border border-amber-500/20 text-xs font-medium flex items-center gap-1"
                        >
                          <Tag size={10} /> {tag}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <GlassCard className="p-4 bg-emerald-500/5 border-emerald-500/10" hoverEffect>
                      <div className="flex items-center gap-2 text-emerald-300 mb-1">
                        <TrendingUp size={16} />
                        <span className="text-xs font-medium uppercase tracking-wider">Total AUM</span>
                      </div>
                      <p className="text-2xl font-bold text-white">₹{(selectedClient.aum / 100000).toFixed(1)} L</p>
                    </GlassCard>
                    
                    <GlassCard className="p-4 bg-blue-500/5 border-blue-500/10" hoverEffect>
                      <div className="flex items-center gap-2 text-blue-300 mb-1">
                        <Shield size={16} />
                        <span className="text-xs font-medium uppercase tracking-wider">Risk Profile</span>
                      </div>
                      <p className="text-xl font-bold text-white">{selectedClient.riskProfile}</p>
                    </GlassCard>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setActiveFilter(selectedClient.status)}
                      className={`p-4 rounded-3xl border flex flex-col justify-center transition-all cursor-pointer
                        ${selectedClient.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20' : 
                          selectedClient.status === 'Onboarding' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-amber-500/10 border-amber-500/20'}
                      `}
                    >
                      <div className={`flex items-center gap-2 mb-1 ${selectedClient.status === 'Active' ? 'text-emerald-300' : selectedClient.status === 'Onboarding' ? 'text-blue-300' : 'text-amber-300'}`}>
                        <Shield size={16} />
                        <span className="text-xs font-medium uppercase tracking-wider">Status</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-bold text-white">{selectedClient.status}</p>
                        <div className="scale-75 origin-left">
                           <StatusBadge status={selectedClient.status} />
                        </div>
                      </div>
                    </motion.button>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <a href={`mailto:${selectedClient.email}`} className="block">
                      <GlassCard className="p-4 flex items-center gap-4" hoverEffect>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 shrink-0">
                          <Mail size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-white/40 uppercase tracking-wider">Email Address</p>
                          <p className="text-white truncate">{selectedClient.email}</p>
                        </div>
                      </GlassCard>
                    </a>
                    <a href={`tel:${selectedClient.phone}`} className="block">
                      <GlassCard className="p-4 flex items-center gap-4" hoverEffect>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 shrink-0">
                          <Phone size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-white/40 uppercase tracking-wider">Phone Number</p>
                          <p className="text-white truncate">{selectedClient.phone}</p>
                        </div>
                      </GlassCard>
                    </a>
                  </div>

                  {/* Timeline / History */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Clock size={20} className="text-emerald-400" /> Recent Activity
                    </h3>
                    <div className="relative pl-4 border-l border-white/10 space-y-8">
                      {selectedClient.history && selectedClient.history.length > 0 ? (
                        selectedClient.history.map((item, i) => (
                          <div key={item.id} className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black" />
                            <GlassCard className="p-4 ml-4 bg-white/5">
                              <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                  {getHistoryIcon(item.type)}
                                  <span className="text-white font-medium">{item.title}</span>
                                </div>
                                <span className="text-xs text-white/40">{item.date}</span>
                              </div>
                              <p className="text-sm text-white/60">{item.description}</p>
                            </GlassCard>
                          </div>
                        ))
                      ) : (
                        <div className="text-white/30 text-sm italic ml-4">No recent history available.</div>
                      )}
                    </div>
                  </div>

                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-white/30">
              Select a client to view details
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedWrapper>
  );
};
