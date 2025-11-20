
import React, { useState } from 'react';
import { X, Save, Tag, User, Briefcase, MapPin, Mail, Phone, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Client } from '../types';

interface ClientFormProps {
  onClose: () => void;
  onSubmit: (client: Client) => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    location: '',
    aum: 0,
    riskProfile: 'Moderate',
    status: 'Onboarding',
    tags: [],
    goals: []
  });
  const [currentTag, setCurrentTag] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'aum' ? parseFloat(value) : value
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(currentTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), currentTag.trim()]
        }));
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newClient: Client = {
      id: Date.now().toString(),
      name: formData.name || 'New Client',
      email: formData.email || '',
      phone: formData.phone || '',
      location: formData.location || '',
      aum: formData.aum || 0,
      riskProfile: formData.riskProfile as any,
      status: formData.status as any,
      lastMeeting: new Date().toISOString().split('T')[0],
      goals: formData.goals || [],
      tags: formData.tags || [],
      avatar: formData.name ? formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'NC',
      history: [
        {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          type: 'System',
          title: 'Client Created',
          description: 'New client profile created via onboarding form.'
        }
      ]
    };

    onSubmit(newClient);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <GlassCard className="w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-2xl font-bold text-white">New Client Onboarding</h2>
            <p className="text-white/50 text-sm">Enter client details and tags</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-300 flex items-center gap-2">
              <User size={20} /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-white/60 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/60 ml-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Mumbai, MH"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/60 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="client@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/60 ml-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Financial Profile */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
              <Briefcase size={20} /> Financial Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-white/60 ml-1">Initial AUM (₹)</label>
                <input
                  type="number"
                  name="aum"
                  placeholder="0"
                  value={formData.aum}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/60 ml-1">Risk Profile</label>
                <select
                  name="riskProfile"
                  value={formData.riskProfile}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all appearance-none"
                >
                  <option value="Conservative" className="bg-gray-900">Conservative</option>
                  <option value="Moderate" className="bg-gray-900">Moderate</option>
                  <option value="Aggressive" className="bg-gray-900">Aggressive</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/60 ml-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all appearance-none"
                >
                  <option value="Lead" className="bg-gray-900">Lead</option>
                  <option value="Onboarding" className="bg-gray-900">Onboarding</option>
                  <option value="Active" className="bg-gray-900">Active</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tagging Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-300 flex items-center gap-2">
              <Hash size={20} /> Tags & Categories
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="text-white/30" size={18} />
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type a tag and press Enter (e.g. 'HNI', 'Referral', 'Golfer')"
                  className="flex-1 bg-transparent text-white placeholder-white/30 outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                <AnimatePresence>
                  {formData.tags?.map(tag => (
                    <motion.span
                      key={tag}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-sm"
                    >
                      {tag}
                      <button 
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-white transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </motion.span>
                  ))}
                  {(!formData.tags || formData.tags.length === 0) && (
                    <span className="text-white/30 text-sm italic">No tags added yet.</span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </form>

        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="px-8 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
          >
            <Save size={18} />
            Save Client
          </motion.button>
        </div>
      </GlassCard>
    </motion.div>
  );
};
