import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      className={`h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};