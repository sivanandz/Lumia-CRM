import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BrainCircuit, Loader2, Globe, ExternalLink, Mic } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { ChatMessage } from '../types';
import { sendChatQuery } from '../services/geminiService';
import { LiveVoice } from './LiveVoice';
import { AnimatedWrapper } from './AnimatedWrapper';
import { motion, AnimatePresence } from 'framer-motion';

export const AIChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'thinking' | 'research'>('thinking');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello! I am your Lumina Advisor. \n\nSelect "Deep Think" for complex strategy brainstorming (Gemini 3 Pro) or "Market Research" for up-to-date web information (Gemini 2.5 Flash).',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Convert internal message format to Gemini API format history
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const { text, groundingMetadata } = await sendChatQuery(userMsg.text, history, mode);

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: text,
        timestamp: new Date(),
        groundingMetadata: groundingMetadata
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatedWrapper className="h-full">
      <GlassCard className="flex flex-col h-full p-0 overflow-hidden bg-black/20">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <motion.div 
              key={mode}
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${mode === 'thinking' ? 'bg-gradient-to-br from-pink-500 to-violet-600 shadow-pink-500/20' : 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-500/20'}`}
            >
              {mode === 'thinking' ? <BrainCircuit className="text-white w-6 h-6" /> : <Globe className="text-white w-6 h-6" />}
            </motion.div>
            <div>
              <h2 className="text-lg font-semibold text-white">Lumina Brain</h2>
              <p className="text-xs text-white/50 flex items-center gap-1">
                <Sparkles size={10} className={mode === 'thinking' ? "text-amber-300" : "text-cyan-300"} />
                {mode === 'thinking' ? 'Gemini 3 Pro • Thinking Mode' : 'Gemini 2.5 Flash • Live Search'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
             <motion.button 
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               onClick={() => setIsVoiceOpen(true)}
               className="p-2 rounded-full bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 transition-all"
               title="Start Voice Session"
             >
               <Mic size={20} />
             </motion.button>
          </div>
        </div>

        {/* Mode Toggle Bar */}
        <div className="flex p-2 bg-black/20 gap-2">
          <button
            onClick={() => setMode('thinking')}
            className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all ${mode === 'thinking' ? 'bg-white/10 text-white border border-white/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            Deep Think
          </button>
          <button
            onClick={() => setMode('research')}
            className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all ${mode === 'research' ? 'bg-white/10 text-white border border-white/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            Market Research
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id} 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`
                  max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-md
                  ${msg.role === 'user' 
                    ? 'bg-emerald-600/80 text-white rounded-tr-none border border-emerald-400/30' 
                    : 'bg-white/10 text-white/90 rounded-tl-none border border-white/10'}
                `}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                
                {/* Grounding Sources Display */}
                {msg.groundingMetadata?.groundingChunks && msg.groundingMetadata.groundingChunks.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-2">Sources</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.groundingMetadata.groundingChunks.map((chunk, idx) => {
                        if (chunk.web?.uri) {
                          return (
                            <a 
                              key={idx}
                              href={chunk.web.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/20 hover:bg-white/10 border border-white/10 text-xs text-blue-300 hover:text-blue-200 transition-colors"
                            >
                              <ExternalLink size={10} />
                              <span className="max-w-[150px] truncate">{chunk.web.title || 'Source'}</span>
                            </a>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}

                <div className="text-[10px] opacity-40 mt-2 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
               <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10 flex items-center gap-3">
                  <Loader2 className={`w-5 h-5 animate-spin ${mode === 'thinking' ? 'text-pink-400' : 'text-cyan-400'}`} />
                  <span className="text-sm text-white/60 animate-pulse">
                    {mode === 'thinking' ? 'Thinking deeply about market conditions...' : 'Searching global indices...'}
                  </span>
               </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/20 border-t border-white/10 backdrop-blur-xl">
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:bg-white/10 focus-within:border-white/30 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={mode === 'thinking' ? "Ask complex questions requiring deep reasoning..." : "Search for latest NAV, news, or market trends..."}
              className="w-full bg-transparent text-white placeholder-white/40 px-4 py-4 outline-none resize-none h-[60px]"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-3 mr-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </motion.button>
          </div>
          <p className="text-[10px] text-white/30 text-center mt-2">
            {mode === 'thinking' ? 'Using Thinking Budget: 32k tokens' : 'Using Google Search Grounding'}
          </p>
        </div>
      </GlassCard>

      {/* Live Voice Overlay */}
      <LiveVoice isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </AnimatedWrapper>
  );
};