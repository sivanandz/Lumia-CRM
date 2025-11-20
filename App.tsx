
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ClientsView } from './components/ClientsView';
import { AIChat } from './components/AIChat';
import { ClientForm } from './components/ClientForm';
import { GlassCard } from './components/GlassCard';
import { CalendarView } from './components/CalendarView';
import { FundsView } from './components/FundsView';
import { InsuranceView } from './components/InsuranceView';
import { Tab, Client, Task, InsurancePolicy } from './types';
import { Search, Bell, Folder, FileText, Users, Calendar, UploadCloud, Sparkles, TrendingUp, ArrowRight, X, CheckSquare, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedWrapper } from './components/AnimatedWrapper';

// Shared Data
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

const MOCK_FILES = [
  { id: 'f1', name: 'Client_KYC_2024', type: 'folder', items: '24 files' },
  { id: 'f2', name: 'Policy_Documents', type: 'folder', items: '156 files' },
  { id: 'f3', name: 'Tax_Reports_FY23', type: 'pdf', items: '2.4 MB' },
  { id: 'f4', name: 'Portfolio_Nav_Data', type: 'sheet', items: 'Synced 2m ago' },
];

const MOCK_FUNDS = [
  { id: 'mf1', name: 'HDFC Mid-Cap Opportunities', nav: 145.2, category: 'Equity', rating: 4, returns1Y: 28.5 },
  { id: 'mf2', name: 'SBI Bluechip Fund', nav: 88.5, category: 'Equity', rating: 5, returns1Y: 15.2 },
  { id: 'mf3', name: 'ICICI Prudential Balanced', nav: 42.1, category: 'Hybrid', rating: 4, returns1Y: 18.1 },
  { id: 'mf4', name: 'Axis Small Cap Fund', nav: 92.3, category: 'Equity', rating: 5, returns1Y: 35.6 },
  { id: 'mf5', name: 'Parag Parikh Flexi Cap', nav: 65.4, category: 'Equity', rating: 5, returns1Y: 22.3 },
];

const MOCK_INSURANCE: InsurancePolicy[] = [
  { id: 'ins1', name: 'iSelect Star Term Plan', provider: 'Canara HSBC', type: 'Term', premium: 15000, cover: 10000000, features: ['Critical Illness', 'Accidental Death', 'Return of Premium'] },
  { id: 'ins2', name: 'Optima Restore', provider: 'HDFC ERGO', type: 'Health', premium: 22000, cover: 500000, features: ['100% Restoration', 'No Claim Bonus', 'Cashless Network'] },
  { id: 'ins3', name: 'Smart Wealth Plan', provider: 'Max Life', type: 'ULIP', premium: 100000, cover: 1000000, features: ['Market Linked Returns', 'Tax Benefits', 'Partial Withdrawal'] },
  { id: 'ins4', name: 'LIC Jeevan Umang', provider: 'LIC', type: 'Endowment', premium: 45000, cover: 500000, features: ['Guaranteed Survival Benefit', 'Life Coverage', 'Loan Facility'] },
];

const MOCK_TASKS: Task[] = [
  { id: 1, text: 'Send Tax Reports to Priya Singh', done: false, due: 'Today' },
  { id: 2, text: 'Update KYC documents for new leads', done: true, due: 'Yesterday' },
  { id: 3, text: 'Research new NFOs in Mid-cap segment', done: false, due: 'Tomorrow' },
  { id: 4, text: 'Call insurance provider regarding claim #482', done: false, due: 'Fri' }
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  
  // Modals State
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [quickTaskInput, setQuickTaskInput] = useState('');
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery) return { clients: [], funds: [], files: [], policies: [] };
    const lowerQuery = searchQuery.toLowerCase();
    
    return {
      clients: clients.filter(c => 
        c.name.toLowerCase().includes(lowerQuery) || 
        c.email.toLowerCase().includes(lowerQuery) ||
        c.tags?.some(t => t.toLowerCase().includes(lowerQuery))
      ),
      funds: MOCK_FUNDS.filter(f => 
        f.name.toLowerCase().includes(lowerQuery) ||
        f.category.toLowerCase().includes(lowerQuery)
      ),
      files: MOCK_FILES.filter(f => 
        f.name.toLowerCase().replace(/_/g, ' ').includes(lowerQuery)
      ),
      policies: MOCK_INSURANCE.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.provider.toLowerCase().includes(lowerQuery)
      )
    };
  }, [searchQuery, clients]);

  const hasResults = searchResults.clients.length > 0 || searchResults.funds.length > 0 || searchResults.files.length > 0 || searchResults.policies.length > 0;

  const handleNewClient = (newClient: Client) => {
    setClients(prev => [newClient, ...prev]);
    setActiveTab(Tab.CLIENTS); 
  };

  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddTask = (text: string) => {
    if (!text.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      text,
      done: false,
      due: 'Today'
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleQuickTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddTask(quickTaskInput);
    setQuickTaskInput('');
    setIsTaskModalOpen(false);
  };

  const handleSearchResultClick = (type: 'client' | 'fund' | 'file' | 'policy', id: string) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    if (type === 'client') setActiveTab(Tab.CLIENTS);
    if (type === 'fund') setActiveTab(Tab.FUNDS);
    if (type === 'file') setActiveTab(Tab.DRIVE);
    if (type === 'policy') setActiveTab(Tab.INSURANCE);
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
      case Tab.FUNDS:
        return (
          <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
             <FundsView funds={MOCK_FUNDS} />
          </div>
        );
      case Tab.INSURANCE:
        return (
          <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
             <InsuranceView policies={MOCK_INSURANCE} />
          </div>
        );
      case Tab.AI_ADVISOR:
        return (
          <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
            <AIChat />
          </div>
        );
      case Tab.CALENDAR:
        return (
          <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
             <CalendarView 
               tasks={tasks}
               onToggleTask={handleToggleTask}
               onAddTask={handleAddTask}
             />
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
              {MOCK_FILES.map((file) => (
                <GlassCard key={file.id} hoverEffect className="p-4 flex flex-col items-center justify-center gap-3 aspect-square cursor-pointer">
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
          <div ref={searchRef} className="relative w-96 hidden md:block z-50">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search clients, funds, or documents..." 
              className="w-full h-12 bg-white/5 border border-white/10 rounded-full pl-12 pr-10 text-white placeholder-white/30 focus:bg-white/10 focus:border-white/30 focus:outline-none transition-all backdrop-blur-md"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X size={14} />
              </button>
            )}

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {isSearchFocused && searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-14 left-0 w-full bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto custom-scrollbar"
                >
                  {!hasResults ? (
                    <div className="p-8 text-center text-white/40 text-sm">
                      No results found for "{searchQuery}"
                    </div>
                  ) : (
                    <div className="p-2">
                      {/* Clients Section */}
                      {searchResults.clients.length > 0 && (
                        <div className="mb-2">
                          <h4 className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">Clients</h4>
                          {searchResults.clients.map(client => (
                            <div 
                              key={client.id}
                              onClick={() => handleSearchResultClick('client', client.id)}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer group transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-xs text-white font-medium border border-white/10">
                                {client.avatar}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white group-hover:text-emerald-300 transition-colors truncate">{client.name}</p>
                                <p className="text-xs text-white/40 truncate">{client.email}</p>
                              </div>
                              <ArrowRight size={14} className="text-white/20 group-hover:text-white transition-colors" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Funds Section */}
                      {searchResults.funds.length > 0 && (
                        <div className="mb-2">
                          <h4 className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">Mutual Funds</h4>
                          {searchResults.funds.map(fund => (
                            <div 
                              key={fund.id}
                              onClick={() => handleSearchResultClick('fund', fund.id)}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer group transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                                <TrendingUp size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white group-hover:text-purple-300 transition-colors truncate">{fund.name}</p>
                                <p className="text-xs text-white/40">{fund.category} • NAV: {fund.nav}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Policies Section */}
                      {searchResults.policies.length > 0 && (
                        <div className="mb-2">
                          <h4 className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">Insurance</h4>
                          {searchResults.policies.map(policy => (
                            <div 
                              key={policy.id}
                              onClick={() => handleSearchResultClick('policy', policy.id)}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer group transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                <Users size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white group-hover:text-blue-300 transition-colors truncate">{policy.name}</p>
                                <p className="text-xs text-white/40">{policy.provider} • {policy.type}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Files Section */}
                      {searchResults.files.length > 0 && (
                        <div>
                          <h4 className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">Drive Files</h4>
                          {searchResults.files.map(file => (
                            <div 
                              key={file.id}
                              onClick={() => handleSearchResultClick('file', file.id)}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer group transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                {file.type === 'folder' ? <Folder size={14} fill="currentColor" className="opacity-70" /> : <FileText size={14} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white group-hover:text-blue-300 transition-colors truncate">{file.name}</p>
                                <p className="text-xs text-white/40">{file.items}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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

              {/* Create Task Button - Replaces Meeting */}
              <motion.button 
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsTaskModalOpen(true)}
                className="group flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all"
              >
                <div className="p-2 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-colors group-hover:border-blue-400/50">
                  <CheckSquare size={20} />
                </div>
                <span className="text-[10px] font-medium text-white/60 group-hover:text-white">Task</span>
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
        {isTaskModalOpen && (
           <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
           >
              <GlassCard className="w-full max-w-md overflow-hidden">
                 <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                       <CheckSquare className="text-blue-400" /> Create Task
                    </h3>
                    <button onClick={() => setIsTaskModalOpen(false)} className="hover:text-white text-white/50">
                       <X size={20} />
                    </button>
                 </div>
                 <form onSubmit={handleQuickTaskSubmit} className="p-6 space-y-4">
                    <input 
                       type="text"
                       autoFocus
                       value={quickTaskInput}
                       onChange={(e) => setQuickTaskInput(e.target.value)}
                       placeholder="What needs to be done?"
                       className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50"
                    />
                    <div className="flex justify-end">
                       <button 
                          type="submit" 
                          disabled={!quickTaskInput.trim()}
                          className="px-6 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-medium transition-colors disabled:opacity-50"
                       >
                          Add Task
                       </button>
                    </div>
                 </form>
              </GlassCard>
           </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
