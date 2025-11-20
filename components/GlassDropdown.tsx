import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface GlassDropdownProps {
  options: (string | Option)[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  icon?: React.ElementType;
  placeholder?: string;
}

export const GlassDropdown: React.FC<GlassDropdownProps> = ({ 
  options, 
  value, 
  onChange, 
  className = '',
  icon: Icon,
  placeholder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options to objects
  const normalizedOptions: Option[] = options.map(opt => 
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const selectedOption = normalizedOptions.find(o => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder || value;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <motion.button
        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full h-full flex items-center justify-between 
          bg-white/5 border border-white/10 backdrop-blur-md
          text-white transition-all outline-none
          ${Icon ? 'pl-10 pr-4' : 'px-4'} py-2 rounded-2xl
          ${isOpen ? 'border-white/30 bg-white/10' : ''}
        `}
      >
        {Icon && (
          <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        )}
        
        <span className="text-sm font-medium truncate mr-2 opacity-90">
          {displayLabel}
        </span>
        
        <ChevronDown 
          size={16} 
          className={`text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full mt-2 left-0 w-full min-w-[180px] z-50 origin-top"
          >
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden p-1.5">
              <div className="max-h-[240px] overflow-y-auto custom-scrollbar space-y-1">
                {normalizedOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between group
                      ${option.value === value 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : 'text-white/70 hover:bg-white/10 hover:text-white'}
                    `}
                  >
                    <span>{option.label}</span>
                    {option.value === value && (
                      <Check size={14} className="text-emerald-400" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};