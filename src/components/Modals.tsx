import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Plus, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const CreateMatchAuthModal: React.FC<{ isOpen: boolean; onClose: () => void; onSuccess: () => void }> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'select' | 'new' | 'old'>('select');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    pin: ""
  });

  useEffect(() => {
    if (isOpen) {
      setMode('select');
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [isOpen]);

  const handleAction = async () => {
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (!isSupabaseConfigured) {
        // Simulation for Demo
        await new Promise(r => setTimeout(r, 1000));
        setSuccessMsg(mode === 'new' ? "Profile created successfully!" : "Logged in successfully!");
        setTimeout(() => onSuccess(), 1500);
        return;
      }

      const { data: { user }, error: authError } = await supabase.auth.signInAnonymously();
      if (authError) throw authError;

      if (mode === 'new') {
        const { error: dbError } = await supabase
          .from('organizers')
          .insert([{
            id: user?.id,
            name: formData.name,
            mobile: formData.mobile,
            pin: formData.pin
          }]);
        if (dbError) throw dbError;
      } else {
        const { data, error: dbError } = await supabase
          .from('organizers')
          .select('*')
          .eq('mobile', formData.mobile)
          .eq('pin', formData.pin)
          .single();
        if (dbError || !data) throw new Error("Invalid mobile number or PIN.");
      }

      setSuccessMsg(mode === 'new' ? "Account Registered! 🔥" : "Welcome back! 🏏");
      setTimeout(() => onSuccess(), 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-[2.5rem]">
                <Loader2 className="animate-spin text-emerald-500" size={48} />
              </div>
            )}

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

                 {errorMsg && (
                   <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl flex items-center gap-2 text-rose-500 text-xs font-bold mb-4">
                     <AlertCircle size={16} /> {errorMsg}
                   </div>
                 )}

                 {successMsg && (
                   <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-2 text-emerald-500 text-xs font-bold mb-4">
                     <CheckCircle size={16} /> {successMsg}
                   </div>
                 )}

                 {mode === 'new' && (
                   <input 
                    placeholder="Full Name (e.g. Ramesh Singh)" 
                    className={inputClass} 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                   />
                 )}
                 
                 <div className="flex bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden focus-within:border-emerald-500 transition-colors mb-3">
                   <span className="inline-flex items-center px-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 font-bold border-r border-zinc-200 dark:border-zinc-800">+91</span>
                   <input 
                    type="tel" 
                    className="flex-1 bg-transparent px-4 py-3 text-zinc-900 dark:text-white font-bold outline-none" 
                    placeholder="Mobile Number" 
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                   />
                 </div>
                 
                 <input 
                  placeholder={mode === 'new' ? "Create 4-Digit PIN" : "Enter 4-Digit PIN"} 
                  type="password" 
                  maxLength={4} 
                  className={inputClass} 
                  value={formData.pin}
                  onChange={(e) => setFormData({...formData, pin: e.target.value})}
                 />

                 <motion.button 
                    whileTap={{ scale: 0.95 }} 
                    onClick={handleAction} 
                    disabled={isLoading || successMsg !== ""}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-xl mt-4 shadow-lg shadow-emerald-500/30 uppercase tracking-wide text-sm transition-all disabled:opacity-50"
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
