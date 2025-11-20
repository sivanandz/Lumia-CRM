
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ClientsView } from './components/ClientsView';
import { AIChat } from './components/AIChat';
import { ClientForm } from './components/ClientForm';
import { GlassCard } from './components/GlassCard';
import { Tab, Client } from './types';
import { Search, Bell, Folder, FileText, Users, Calendar, UploadCloud, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedWrapper } from './components/AnimatedWrapper';

// Moved mock data here to be shared state
const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, MH',
    aum: 4500000,
    riskProfile: 'Aggressive',
    status: 'Active',
    lastMeeting: '2024-05-15',
    nextScheduledCall: '2024-06-01',
    goals: ['Retirement (2045)', 'Child Education'],
    tags: ['HNI', 'Referral', 'Tech Professional'],
    avatar: 'RV',
    history: [
      { id: 'h1', date: '2024-05-15', type: 'Meeting', title: 'Portfolio Review', description: 'Discussed rebalancing into Mid-cap funds.' },
      { id: 'h2', date: '2024-04-20', type: 'Transaction', title: 'SIP Executed', description: 'Monthly SIP of ₹50,000 processed successfully.' },
      { id: 'h3', date: '2024-03-10', type: 'Email', title: 'Tax Report Sent', description: 'Sent FY23-24 capital gains report.' },
      { id: 'h4', date: '2024-02-01', type: 'System', title: 'Risk Profile Updated', description: 'Changed from Moderate to Aggressive.' },
    ]
  },
  {
    id: '2',
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    phone: '+91 98989 01010',
    location: 'Bangalore, KA',
    aum: 12000000,
    riskProfile: 'Moderate',
    status: 'Active',
    lastMeeting: '2024-05-20',
    goals: ['Wealth Creation', 'Tax Saving'],
    tags: ['Doctor', 'Family Office'],
    avatar: 'PS',
    history: [
      { id: 'h1', date: '2024-05-20', type: 'Meeting', title: 'Insurance Consultation', description: 'Proposed 2Cr Term Plan.' },
      { id: 'h2', date: '2024-05-01', type: 'Call', title: 'Quick Check-in', description: 'Client asked about market volatility.' },
    ]
  },
  {
    id: '3',
    name: 'Amit Shah',
    email: 'amit.shah@example.com',
    phone: '+91 99887 77665',
    location: 'Ahmedabad, GJ',
    aum: 850000,
    riskProfile: 'Conservative',
    status: 'Onboarding',
    lastMeeting: '2024-05-10',
    nextScheduledCall: '2024-05-24',
    goals: ['Short term parking'],
    tags: ['Lead', 'Small Business'],
    avatar: 'AS',
    history: [
      { id: 'h1', date: '2024-05-10', type: 'Meeting', title: 'Onboarding Meeting', description: 'Collected KYC documents.' },
    ]
  },
  {
    id: '4',
    name: 'Sneha Patel',
    email: 'sneha.p@example.com',
    phone: '+91 98123 45678',
    location: 'Surat, GJ',
    aum: 25000000,
    riskProfile: 'Aggressive',
    status: 'Active',
    lastMeeting: '2024-01-15',
    goals: ['Estate Planning', 'Business Expansion'],
    tags: ['Ultra HNI', 'Real Estate'],
    avatar: 'SP',
    history: []
  }
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);

  const handleNewClient = (newClient: Client) => {
    setClients(prev => [newClient, ...prev]);
    // Optional: Switch to clients tab to see the new client
    setActiveTab(Tab.CLIENTS); 
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD:
        return <Dashboard />;
      case Tab.CLIENTS:
        return (
          <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
             <ClientsView 
               clients={clients} 
               onOpenForm={() => setIsClientFormOpen(true)} 
             />
          </div>
        );
      case Tab.AI_ADVISOR:
        return (
          <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
            <AIChat />
          </div>
        );
      case Tab.DRIVE:
        return (
          <AnimatedWrapper className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Secure Drive Storage</h2>
              <GlassCard className="px-4 py-2 bg-blue-500/20 border-blue-400/30 flex items-center gap-2">
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                 <span className="text-sm text-blue-100">Synced with Google Drive</span>
              </GlassCard>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Client_KYC_2024', type: 'folder', items: '24 files' },
                { name: 'Policy_Documents', type: 'folder', items: '156 files' },
                { name: 'Tax_Reports_FY23', type: 'pdf', items: '2.4 MB' },
                { name: 'Portfolio_Nav_Data', type: 'sheet', items: 'Synced 2m ago' },
              ].map((file, i) => (
                <GlassCard key={i} hoverEffect className="p-4 flex flex-col items-center justify-center gap-3 aspect-square cursor-pointer">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${file.type === 'folder' ? 'bg-amber-400/20 text-amber-300' : 'bg-blue-400/20 text-blue-300'}`}>
                    {file.type === 'folder' ? <Folder size={32} fill="currentColor" className="opacity-50" /> : <FileText size={32} />}
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium text-sm">{file.name}</p>
                    <p className="text-white/40 text-xs mt-1">{file.items}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </AnimatedWrapper>
        );
      default:
        return (
          <AnimatedWrapper className="h-full flex flex-col items-center justify-center text-white/50">
            <GlassCard className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Feature: {activeTab}</h2>
              <p>This module is being brainstormed. Switch to AI Advisor to discuss implementation.</p>
            </GlassCard>
          </AnimatedWrapper>
        );
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* Background Ambience Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/20 rounded-full blur-[130px] pointer-events-none mix-blend-screen" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-900/20 rounded-full blur-[130px] pointer-events-none mix-blend-screen" 
      />

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative z-10">
        
        {/* Top Bar (Glass Action Bar) */}
        <div className="h-20 px-8 flex items-center justify-between shrink-0">
          
          {/* Search Bar */}
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Search clients, funds, or documents..." 
              className="w-full h-12 bg-white/5 border border-white/10 rounded-full pl-12 pr-4 text-white placeholder-white/30 focus:bg-white/10 focus:border-white/30 focus:outline-none transition-all backdrop-blur-md"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-all relative"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-400 rounded-full border border-black/20" />
            </motion.button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white">Briken Desai</p>
                <p className="text-xs text-white/40">Senior Wealth Manager</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 border-2 border-white/20 shadow-lg" />
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
          <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
               className="h-full"
             >
               {renderContent()}
             </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Quick Actions Dock */}
      <motion.div 
        initial={{ y: 100, x: "-50%" }}
        animate={{ y: 0, x: "-50%" }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="absolute bottom-8 left-1/2 z-50 w-max max-w-[90vw]"
      >
        <GlassCard className="rounded-full bg-black/60 backdrop-blur-2xl border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
            {/* Flex container to ensure horizontal layout */}
            <div className="flex flex-row items-center justify-center gap-2 px-4 py-3">
              <motion.button 
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsClientFormOpen(true)}
                className="group flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all"
              >
                <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors group-hover:border-emerald-400/50">
                  <Users size={20} />
                </div>
                <span className="text-[10px] font-medium text-white/60 group-hover:text-white">Add Client</span>
              </motion.button>

              <div className="w-px h-8 bg-white/10" />

              <motion.button 
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTab(Tab.CALENDAR)}
                className="group flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all"
              >
                <div className="p-2 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-colors group-hover:border-blue-400/50">
                  <Calendar size={20} />
                </div>
                <span className="text-[10px] font-medium text-white/60 group-hover:text-white">Meeting</span>
              </motion.button>

              <div className="w-px h-8 bg-white/10" />

              <motion.button 
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTab(Tab.DRIVE)}
                className="group flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all"
              >
                <div className="p-2 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 transition-colors group-hover:border-purple-400/50">
                  <UploadCloud size={20} />
                </div>
                <span className="text-[10px] font-medium text-white/60 group-hover:text-white">Upload</span>
              </motion.button>

              <div className="w-px h-8 bg-white/10" />

              <motion.button 
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTab(Tab.AI_ADVISOR)}
                className="group flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all"
              >
                <div className="p-2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors group-hover:border-amber-400/50">
                  <Sparkles size={20} />
                </div>
                <span className="text-[10px] font-medium text-white/60 group-hover:text-white">Ask AI</span>
              </motion.button>
            </div>
        </GlassCard>
      </motion.div>

      {/* Global Modals */}
      <AnimatePresence>
        {isClientFormOpen && (
          <ClientForm 
            onClose={() => setIsClientFormOpen(false)} 
            onSubmit={handleNewClient} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
