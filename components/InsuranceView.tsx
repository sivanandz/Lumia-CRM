import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { InsurancePolicy } from '../types';
import { AnimatedWrapper } from './AnimatedWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldCheck, AlertCircle, Sparkles, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { sendChatQuery } from '../services/geminiService';

interface InsuranceViewProps {
  policies: InsurancePolicy[];
}

export const InsuranceView: React.FC<InsuranceViewProps> = ({ policies }) => {
  const [selectedPolicy, setSelectedPolicy] = useState<InsurancePolicy | null>(policies[0] || null);
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const handleReview = async () => {
    if (!selectedPolicy) return;
    setIsReviewing(true);
    setAiReview(null);

    const prompt = `Act as an expert insurance advisor. Review the following policy:
    
    Name: ${selectedPolicy.name}
    Provider: ${selectedPolicy.provider}
    Type: ${selectedPolicy.type}
    Annual Premium: ₹${selectedPolicy.premium}
    Cover Amount: ₹${selectedPolicy.cover}
    Key Features: ${selectedPolicy.features.join(', ')}

    Please provide:
    1. A "Plain English" explanation of what this policy actually covers.
    2. Is the premium-to-cover ratio competitive for the Indian market?
    3. Potential hidden exclusions or things to watch out for with ${selectedPolicy.type} policies.
    4. Verdict: Who is this policy best suited for?`;

    try {
      const response = await sendChatQuery(prompt, [], 'thinking');
      setAiReview(response.text);
    } catch (error) {
      setAiReview("Unable to complete policy review.");
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <AnimatedWrapper className="h-full flex gap-6 relative">
      {/* List Side */}
      <div className="w-1/3 flex flex-col gap-4 h-full">
        <h2 className="text-2xl font-bold text-white shrink-0">Insurance Products</h2>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
          {policies.map((policy, index) => (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setSelectedPolicy(policy);
                setAiReview(null);
              }}
            >
              <GlassCard 
                className={`p-4 cursor-pointer transition-all border-l-4 ${
                  selectedPolicy?.id === policy.id 
                    ? 'bg-white/10 border-l-blue-400' 
                    : 'border-l-transparent hover:bg-white/5'
                }`}
              >
                <div className="flex items-start gap-3">
                   <div className={`p-2 rounded-lg ${policy.type === 'Health' ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'}`}>
                      <Shield size={20} />
                   </div>
                   <div className="flex-1">
                      <h3 className="text-white font-medium text-sm">{policy.name}</h3>
                      <p className="text-xs text-white/50">{policy.provider}</p>
                   </div>
                </div>
                <div className="mt-3 flex justify-between items-end">
                   <span className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white/60">{policy.type}</span>
                   <span className="text-sm font-bold text-white">₹{(policy.cover/100000).toFixed(0)} L Cover</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Side */}
      <div className="flex-1 h-full min-w-0">
        <AnimatePresence mode="wait">
          {selectedPolicy ? (
            <motion.div
              key={selectedPolicy.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full flex flex-col gap-6"
            >
              {/* Header */}
              <GlassCard className="p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-10">
                    <ShieldCheck size={120} />
                 </div>
                 <div className="relative z-10">
                    <span className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-1 block">{selectedPolicy.provider}</span>
                    <h1 className="text-3xl font-bold text-white mb-4">{selectedPolicy.name}</h1>
                    
                    <div className="flex gap-8">
                       <div>
                          <p className="text-xs text-white/40 uppercase">Annual Premium</p>
                          <p className="text-xl font-semibold text-white">₹{selectedPolicy.premium.toLocaleString('en-IN')}</p>
                       </div>
                       <div>
                          <p className="text-xs text-white/40 uppercase">Cover Amount</p>
                          <p className="text-xl font-semibold text-emerald-400">₹{selectedPolicy.cover.toLocaleString('en-IN')}</p>
                       </div>
                    </div>
                 </div>
              </GlassCard>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                 {selectedPolicy.features.map((feature, i) => (
                    <GlassCard key={i} className="p-3 flex items-center gap-3 bg-white/5">
                       <CheckCircle2 size={16} className="text-emerald-400" />
                       <span className="text-sm text-white/80">{feature}</span>
                    </GlassCard>
                 ))}
              </div>

              {/* AI Review Section */}
              <div className="flex-1 min-h-0 flex flex-col">
                 <GlassCard className="flex-1 p-0 overflow-hidden bg-gradient-to-b from-blue-900/20 to-black/40 border-blue-500/20 flex flex-col">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                       <h3 className="text-blue-300 font-bold flex items-center gap-2">
                          <Sparkles size={18} /> AI Policy Decoder
                       </h3>
                       {!aiReview && !isReviewing && (
                          <button 
                            onClick={handleReview}
                            className="text-xs bg-blue-500/20 hover:bg-blue-500 hover:text-white text-blue-300 px-3 py-1.5 rounded-lg transition-all border border-blue-500/30"
                          >
                            Review Policy
                          </button>
                       )}
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                       {isReviewing ? (
                          <div className="h-full flex flex-col items-center justify-center text-blue-400/60 gap-4">
                             <Loader2 size={40} className="animate-spin" />
                             <div className="text-center">
                                <p className="text-sm font-medium animate-pulse">Analyzing terms & conditions...</p>
                                <p className="text-xs text-white/30 mt-1">Checking against market standards</p>
                             </div>
                          </div>
                       ) : aiReview ? (
                          <div className="prose prose-invert prose-sm max-w-none">
                             <div className="whitespace-pre-wrap text-white/80 leading-relaxed">
                                {aiReview}
                             </div>
                          </div>
                       ) : (
                          <div className="h-full flex flex-col items-center justify-center text-white/30 text-center">
                             <FileText size={48} className="mb-3 opacity-50" />
                             <p className="max-w-md">Tap "Review Policy" to let Gemini 3 Pro analyze this plan's suitability, decode complex terms, and highlight potential red flags.</p>
                          </div>
                       )}
                    </div>
                 </GlassCard>
              </div>
            </motion.div>
          ) : (
             <div className="h-full flex items-center justify-center text-white/30">Select a policy to view details</div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedWrapper>
  );
};
