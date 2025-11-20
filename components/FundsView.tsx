import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { MutualFund } from '../types';
import { AnimatedWrapper } from './AnimatedWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, BarChart3, Info, Sparkles, Loader2, ArrowRight, Globe } from 'lucide-react';
import { sendChatQuery } from '../services/geminiService';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';

interface FundsViewProps {
  funds: MutualFund[];
}

// Mock chart data generator
const generateChartData = () => 
  Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    value: 100 + Math.random() * 50 + (i * 5)
  }));

export const FundsView: React.FC<FundsViewProps> = ({ funds }) => {
  const [selectedFund, setSelectedFund] = useState<MutualFund | null>(funds[0] || null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedFund) return;
    setIsAnalyzing(true);
    setAiAnalysis(null);

    const prompt = `Analyze the mutual fund "${selectedFund.name}" (${selectedFund.category}). 
    Current NAV: ₹${selectedFund.nav}. 
    Please provide:
    1. A brief performance review relative to Indian market benchmarks (NIFTY 50 / NIFTY Midcap).
    2. Key risk factors for this category.
    3. Suitability for a Moderate vs Aggressive investor profile.
    Use real-time data if possible via search.`;

    try {
      const response = await sendChatQuery(prompt, [], 'research');
      setAiAnalysis(response.text);
    } catch (error) {
      setAiAnalysis("Unable to generate analysis at this time.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AnimatedWrapper className="h-full flex gap-6 relative">
      {/* List Side */}
      <div className="w-1/3 flex flex-col gap-4 h-full">
        <h2 className="text-2xl font-bold text-white shrink-0">Mutual Funds</h2>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
          {funds.map((fund, index) => (
            <motion.div
              key={fund.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setSelectedFund(fund);
                setAiAnalysis(null); // Reset analysis on change
              }}
            >
              <GlassCard 
                className={`p-4 cursor-pointer transition-all border-l-4 ${
                  selectedFund?.id === fund.id 
                    ? 'bg-white/10 border-l-purple-400' 
                    : 'border-l-transparent hover:bg-white/5'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-medium">{fund.name}</h3>
                    <p className="text-xs text-white/50 mt-1">{fund.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">₹{fund.nav}</p>
                    <span className="text-[10px] text-emerald-400">+12.4% 1Y</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Side */}
      <div className="flex-1 h-full min-w-0">
        <AnimatePresence mode="wait">
          {selectedFund ? (
            <motion.div
              key={selectedFund.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full flex flex-col gap-6"
            >
              {/* Header Card */}
              <GlassCard className="p-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                        <TrendingUp size={24} />
                      </div>
                      <h1 className="text-2xl font-bold text-white">{selectedFund.name}</h1>
                    </div>
                    <div className="flex gap-4 text-sm text-white/60">
                      <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10">{selectedFund.category}</span>
                      <span className="flex items-center gap-1"><Globe size={14}/> Large Cap Focus</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/40 uppercase tracking-widest">Current NAV</p>
                    <p className="text-4xl font-bold text-white">₹{selectedFund.nav}</p>
                  </div>
                </div>
              </GlassCard>

              {/* Chart Section */}
              <GlassCard className="p-6 h-64 flex flex-col">
                 <h3 className="text-white/70 text-sm font-semibold mb-4 flex items-center gap-2">
                   <BarChart3 size={16} /> Performance History (1Y)
                 </h3>
                 <div className="flex-1 w-full min-h-0">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={generateChartData()}>
                       <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                       <Tooltip 
                         contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                         itemStyle={{ color: '#a78bfa' }}
                       />
                       <Line type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={3} dot={false} />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
              </GlassCard>

              {/* AI Analysis Section */}
              <div className="flex-1 min-h-0 flex flex-col">
                <GlassCard className="flex-1 p-6 bg-gradient-to-br from-emerald-900/10 to-black/20 border-emerald-500/20 flex flex-col relative overflow-hidden">
                   <div className="flex justify-between items-center mb-4 relative z-10">
                      <h3 className="text-emerald-300 font-bold flex items-center gap-2">
                        <Sparkles size={18} /> Gemini Fund Insight
                      </h3>
                      {!aiAnalysis && !isAnalyzing && (
                        <button 
                          onClick={handleAnalyze}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold transition-all flex items-center gap-2"
                        >
                          Analyze Fund <ArrowRight size={16} />
                        </button>
                      )}
                   </div>

                   <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                      {isAnalyzing ? (
                        <div className="h-full flex flex-col items-center justify-center text-emerald-400/60 gap-3">
                          <Loader2 size={32} className="animate-spin" />
                          <p className="text-sm animate-pulse">Analyzing market trends & performance...</p>
                        </div>
                      ) : aiAnalysis ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-white/80 leading-relaxed">
                            {aiAnalysis}
                          </div>
                          <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                             <button onClick={handleAnalyze} className="text-xs text-emerald-400 hover:text-emerald-300 underline">
                               Refresh Analysis
                             </button>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-white/30 text-center p-4">
                          <Info size={48} className="mb-3 opacity-50" />
                          <p>Click "Analyze Fund" to get a comprehensive AI-generated report on this scheme's performance, risk, and suitability using real-time market data.</p>
                        </div>
                      )}
                   </div>
                   
                   {/* Background Decor */}
                   <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
                </GlassCard>
              </div>

            </motion.div>
          ) : (
             <div className="h-full flex items-center justify-center text-white/30">Select a fund to view details</div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedWrapper>
  );
};
