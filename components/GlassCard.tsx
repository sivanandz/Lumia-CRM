import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = false,
  onClick 
}) => {
  return (
    <motion.div 
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={hoverEffect ? { scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.15)" } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        relative overflow-hidden isolate
        bg-white/10 
        backdrop-blur-xl 
        border border-white/20 
        shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
        rounded-3xl
        text-white
        ${hoverEffect || onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Shine/Reflection effect - z-[-1] ensures it sits behind content (static/block) but on top of background */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-50 -z-10" />
      
      {/* Content rendered directly to preserve flex/grid layout context from className */}
      {children}
    </motion.div>
  );
};