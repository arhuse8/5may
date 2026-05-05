import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Plus, Lock } from 'lucide-react';

export const CreateMatchAuthModal: React.FC<{ isOpen: boolean; onClose: () => void; onSuccess: () => void }> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'select' | 'new' | 'old'>('select');

  useEffect(() => {
    if (isOpen) setMode('select');
  }, [isOpen]);

  const inputClass = "w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 font-bold text-zinc-900 dark:text-white outline-none focus:border-emerald-500 transition-colors mb-3 placeholder:text-zinc-400";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 rounded-full p-2 transition-colors">
              <X size={20} />
            </button>
            
            {mode === 'select' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                 <Shield className="mx-auto text-emerald-500 mb-4" size={48} />
                 <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2 uppercase tracking-wider">Creator Studio</h2>
                 <p className="text-sm text-zinc-500 font-medium mb-8">Access your dashboard to manage tournaments and live scoring.</p>
                 <div className="flex flex-col gap-4">
                    <motion.button 
                      whileTap={{ scale: 0.95 }} 
                      onClick={() => setMode('new')} 
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-500/30 uppercase tracking-wide text-sm transition-all"
                    >
                      New Organizer (Register)
                    </motion.button>
                    <motion.button 
                      whileTap={{ scale: 0.95 }} 
                      onClick={() => setMode('old')} 
                      className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-black py-4 rounded-xl border border-zinc-200 dark:border-zinc-700 uppercase tracking-wide text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                    >
                      Existing Organizer (Login)
                    </motion.button>
                 </div>
              </motion.div>
            )}

            {(mode === 'new' || mode === 'old') && (
               <motion.div initial={{ opacity: 0, x: mode === 'new' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2 pt-2">
                 <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                   {mode === 'new' ? <Plus className="text-emerald-500" size={24} /> : <Lock className="text-emerald-500" size={24} />}
                   {mode === 'new' ? 'Register Profile' : 'Organizer Login'}
                 </h2>
                 {mode === 'new' && <input placeholder="Full Name (e.g. Ramesh Singh)" className={inputClass} />}
                 <div className="flex bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden focus-within:border-emerald-500 transition-colors mb-3">
                   <span className="inline-flex items-center px-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 font-bold border-r border-zinc-200 dark:border-zinc-800">+91</span>
                   <input type="tel" className="flex-1 bg-transparent px-4 py-3 text-zinc-900 dark:text-white font-bold outline-none" placeholder="Mobile Number" />
                 </div>
                 <input placeholder={mode === 'new' ? "Create 4-Digit PIN" : "Enter 4-Digit PIN"} type="password" maxLength={4} className={inputClass} />
                 <motion.button 
                    whileTap={{ scale: 0.95 }} 
                    onClick={onSuccess} 
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-xl mt-4 shadow-lg shadow-emerald-500/30 uppercase tracking-wide text-sm transition-all"
                  >
                    {mode === 'new' ? 'Create Account' : 'Access Dashboard'}
                  </motion.button>
                 <button onClick={() => setMode('select')} className="w-full text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white mt-4 uppercase tracking-wider transition-colors underline-offset-4 hover:underline">
                    ← Back to Selection
                 </button>
               </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
