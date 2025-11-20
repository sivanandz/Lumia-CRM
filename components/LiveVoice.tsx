import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, X, Activity } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveVoiceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveVoice: React.FC<LiveVoiceProps> = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Audio Context Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      startSession();
    } else {
      stopSession();
    }
    return () => {
      stopSession();
    };
  }, [isOpen]);

  const startSession = async () => {
    try {
      setError(null);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Setup Audio Contexts
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      // Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Connect to Gemini Live
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setupAudioInput(stream, sessionPromise);
          },
          onmessage: async (message: LiveServerMessage) => {
            await handleServerMessage(message);
          },
          onclose: () => {
            setIsConnected(false);
            setIsTalking(false);
          },
          onerror: (e: any) => {
            console.error("Live API Error", e);
            setError("Connection interrupted");
            setIsConnected(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: "You are Lumina, a sophisticated financial advisor AI assistant. Keep responses concise, professional, and helpful.",
        }
      });
      
      sessionPromiseRef.current = sessionPromise;

    } catch (err) {
      console.error("Failed to start live session", err);
      setError("Could not access microphone or connect to server.");
    }
  };

  const setupAudioInput = (stream: MediaStream, sessionPromise: Promise<any>) => {
    if (!inputAudioContextRef.current) return;

    const source = inputAudioContextRef.current.createMediaStreamSource(stream);
    const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);

    scriptProcessor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmBlob = createPcmBlob(inputData);
      
      sessionPromise.then((session) => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    };

    source.connect(scriptProcessor);
    scriptProcessor.connect(inputAudioContextRef.current.destination);
    
    sourceRef.current = source;
    scriptProcessorRef.current = scriptProcessor;
  };

  const createPcmBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: arrayBufferToBase64(int16.buffer),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const handleServerMessage = async (message: LiveServerMessage) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    // Handle Audio Output
    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      setIsTalking(true);
      const audioData = atob(base64Audio);
      const arrayBuffer = new ArrayBuffer(audioData.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i);
      }
      
      // Decode raw PCM (16-bit, 24kHz, 1 channel)
      const pcmData = new Int16Array(arrayBuffer);
      const floatData = new Float32Array(pcmData.length);
      for (let i = 0; i < pcmData.length; i++) {
        floatData[i] = pcmData[i] / 32768.0;
      }
      
      const buffer = audioContext.createBuffer(1, floatData.length, 24000);
      buffer.getChannelData(0).set(floatData);

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      
      const startTime = Math.max(audioContext.currentTime, nextStartTimeRef.current);
      source.start(startTime);
      nextStartTimeRef.current = startTime + buffer.duration;
      
      source.onended = () => {
        // Simple heuristic: if queue is empty-ish, stop talking animation
        if (audioContext.currentTime >= nextStartTimeRef.current - 0.1) {
           setIsTalking(false);
        }
      };
    }

    // Handle Interruption
    if (message.serverContent?.interrupted) {
        nextStartTimeRef.current = 0;
        setIsTalking(false);
    }
  };

  const stopSession = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    sessionPromiseRef.current?.then(session => {
        try { session.close(); } catch (e) {}
    });

    setIsConnected(false);
    setIsTalking(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-lg"
        >
          <GlassCard className="w-[90%] max-w-md p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Visualizer Orb */}
            <div className="relative mb-8 mt-4">
              <motion.div 
                animate={isTalking ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                  boxShadow: [
                    "0 0 30px rgba(6,78,59,0.4)",
                    "0 0 60px rgba(52,211,153,0.6)",
                    "0 0 30px rgba(6,78,59,0.4)"
                  ]
                } : {
                  scale: 1,
                  rotate: 0
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={`w-40 h-40 rounded-full transition-all duration-500 flex items-center justify-center
                  ${isTalking 
                    ? 'bg-gradient-to-br from-emerald-400 to-cyan-400' 
                    : 'bg-gradient-to-br from-emerald-900 to-cyan-900'}
                `}
              >
                {/* Inner Orb Layers */}
                <div className="absolute inset-2 rounded-full bg-black/20 backdrop-blur-sm" />
                <div className={`absolute inset-0 rounded-full border-2 border-white/20 ${isConnected && !isTalking ? 'animate-pulse-slow' : ''}`} />
                
                {/* Icon */}
                {isConnected ? (
                    <Activity size={48} className={`text-white drop-shadow-lg ${isTalking ? 'animate-bounce' : ''}`} />
                ) : (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full" 
                    />
                )}
              </motion.div>
            </div>

            {/* Status Text */}
            <h2 className="text-2xl font-bold text-white mb-2">Lumina Voice</h2>
            <p className="text-white/50 text-center mb-8 h-6">
              {error ? <span className="text-red-400">{error}</span> : 
              !isConnected ? "Connecting to neural network..." :
              isTalking ? "Lumina is speaking..." : "Listening..."}
            </p>

            {/* Controls */}
            <div className="flex gap-6">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-full transition-all ${isConnected ? 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                onClick={onClose}
              >
                <MicOff size={24} />
              </motion.button>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
};