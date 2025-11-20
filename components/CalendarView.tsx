
import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { AnimatedWrapper } from './AnimatedWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Video, MapPin, CheckSquare, Square, MoreHorizontal, Plus, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { Task } from '../types';

// Mock Data
const EVENTS = [
  { id: 1, title: 'Portfolio Review - Rahul Verma', time: '10:00 AM - 11:30 AM', type: 'video', location: 'Google Meet' },
  { id: 2, title: 'Lunch with HDFC Fund Manager', time: '12:30 PM - 02:00 PM', type: 'in-person', location: 'Oberoi, Mumbai' },
  { id: 3, title: 'Team Sync', time: '03:00 PM - 03:30 PM', type: 'video', location: 'Google Meet' },
  { id: 4, title: 'Client Onboarding - Amit Shah', time: '04:30 PM - 05:30 PM', type: 'video', location: 'Google Meet' }
];

interface CalendarViewProps {
  tasks: Task[];
  onToggleTask: (id: number) => void;
  onAddTask: (text: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onToggleTask, onAddTask }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleInternalAddTask = () => {
    if (newTaskText.trim()) {
      onAddTask(newTaskText);
      setNewTaskText('');
      setIsAddingTask(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleInternalAddTask();
    if (e.key === 'Escape') {
      setIsAddingTask(false);
      setNewTaskText('');
    }
  };

  const daysInMonth = new Array(31).fill(null).map((_, i) => i + 1);
  const startOffset = 3; // Random offset for visual

  return (
    <AnimatedWrapper className="h-full flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center shrink-0">
            <div>
                <h2 className="text-2xl font-bold text-white">Calendar & Tasks</h2>
                <p className="text-white/50 text-sm">Manage your schedule and to-dos</p>
            </div>
             <GlassCard className="px-4 py-2 bg-blue-500/20 border-blue-400/30 flex items-center gap-2">
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                 <span className="text-sm text-blue-100">Synced with Google Calendar</span>
              </GlassCard>
        </div>

        <div className="flex-1 flex gap-6 min-h-0">
            {/* Left: Schedule */}
            <div className="flex-1 flex flex-col gap-4 min-h-0">
                <div className="flex justify-between items-center">
                     <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <CalendarIcon className="text-emerald-400" size={20}/> Today's Schedule
                     </h3>
                     <button className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                        <Plus size={20} />
                     </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                    {EVENTS.map((event, i) => (
                        <motion.div 
                            key={event.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <GlassCard className="p-4 border-l-4 border-l-emerald-500 flex gap-4 items-start group" hoverEffect>
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <span className="text-sm font-semibold text-white">{event.time.split('-')[0]}</span>
                                    <span className="text-xs text-white/40">{event.time.split('-')[1]}</span>
                                </div>
                                <div className="w-px bg-white/10 self-stretch" />
                                <div className="flex-1">
                                    <h4 className="text-white font-medium text-lg">{event.title}</h4>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                                        <span className="flex items-center gap-1">
                                            {event.type === 'video' ? <Video size={14} /> : <MapPin size={14} />}
                                            {event.location}
                                        </span>
                                    </div>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all">
                                    <MoreHorizontal size={16} className="text-white" />
                                </button>
                            </GlassCard>
                        </motion.div>
                    ))}
                     
                     {/* Time Slot Gap */}
                     <div className="flex items-center gap-4 opacity-50 py-4">
                        <div className="w-[80px] text-right text-xs text-white/30">02:00 PM</div>
                        <div className="flex-1 h-px bg-dashed border-b border-white/10 border-dashed" />
                     </div>
                </div>
            </div>

            {/* Right: Calendar & Tasks */}
            <div className="w-80 flex flex-col gap-6 shrink-0">
                {/* Mini Calendar */}
                <GlassCard className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-white font-semibold">May 2024</h4>
                        <div className="flex gap-1">
                            <button className="p-1 hover:bg-white/10 rounded"><ChevronLeft size={16} className="text-white/70" /></button>
                            <button className="p-1 hover:bg-white/10 rounded"><ChevronRight size={16} className="text-white/70" /></button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 text-center text-xs gap-y-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                            <span key={d} className="text-white/40 font-medium">{d}</span>
                        ))}
                        {Array(startOffset).fill(null).map((_, i) => <span key={`empty-${i}`} />)}
                        {daysInMonth.map(d => {
                            const isToday = d === 24;
                            const hasEvent = [15, 20, 24, 28].includes(d);
                            return (
                                <div key={d} className="flex flex-col items-center gap-1 cursor-pointer group">
                                    <span className={`
                                        w-7 h-7 flex items-center justify-center rounded-full transition-colors
                                        ${isToday ? 'bg-emerald-500 text-black font-bold' : 'text-white group-hover:bg-white/10'}
                                    `}>
                                        {d}
                                    </span>
                                    {hasEvent && !isToday && <div className="w-1 h-1 rounded-full bg-blue-400" />}
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>

                {/* Tasks */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <CheckSquare size={18} className="text-blue-400" /> Tasks
                        </h3>
                         <span className="text-xs text-white/40">{tasks.filter(t => !t.done).length} pending</span>
                    </div>
                    
                    {/* Task List - Scrollable */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 mb-2">
                        <AnimatePresence initial={false}>
                        {tasks.map(task => (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                                <GlassCard 
                                    className={`p-3 flex gap-3 items-start cursor-pointer transition-all ${task.done ? 'opacity-50' : ''}`}
                                    onClick={() => onToggleTask(task.id)}
                                >
                                    <div className={`
                                        mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors
                                        ${task.done ? 'bg-blue-500 border-blue-500' : 'border-white/30 group-hover:border-blue-400'}
                                    `}>
                                        {task.done && <Check size={12} className="text-white" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm text-white ${task.done ? 'line-through text-white/40' : ''}`}>{task.text}</p>
                                        <p className="text-[10px] text-white/30 mt-1">Due: {task.due}</p>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>

                    {/* Add Task - Persistent at Bottom */}
                    {isAddingTask ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/10 border border-white/20 rounded-xl p-2 flex items-center gap-2"
                        >
                            <input 
                                type="text" 
                                autoFocus
                                value={newTaskText}
                                onChange={(e) => setNewTaskText(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Task name..." 
                                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-white/30"
                            />
                            <button onClick={handleInternalAddTask} className="p-1.5 bg-blue-500 rounded-lg text-white hover:bg-blue-400">
                                <Check size={14} />
                            </button>
                            <button onClick={() => setIsAddingTask(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white">
                                <X size={14} />
                            </button>
                        </motion.div>
                    ) : (
                        <button 
                            onClick={() => setIsAddingTask(true)}
                            className="w-full py-3 rounded-xl border border-dashed border-white/20 text-white/40 text-sm hover:bg-white/5 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2 shrink-0"
                        >
                            <Plus size={16} /> Add Task
                        </button>
                    )}
                </div>
            </div>
        </div>
    </AnimatedWrapper>
  );
};
