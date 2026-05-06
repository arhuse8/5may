import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Plus, Lock, CheckCircle, AlertCircle, Loader2, Trophy } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import bcrypt from 'bcryptjs';

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
      setFormData({ name: "", mobile: "", pin: "" });
    }
  }, [isOpen]);

  const handleAction = async () => {
    if (!formData.mobile || formData.mobile.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!formData.pin || formData.pin.length !== 4) {
      setErrorMsg("PIN must be exactly 4 digits.");
      return;
    }

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

      if (mode === 'new') {
        if (!formData.name) {
          throw new Error("Please enter your name.");
        }

        let authUser;
        try {
          const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
          if (authError) throw authError;
          authUser = authData.user;
        } catch (authErr: any) {
          if (authErr.message?.includes('Anonymous sign-ins are disabled')) {
            throw new Error("ERROR: Anonymous login is disabled in Supabase. Please enable it in Auth > Providers.");
          }
          throw authErr;
        }

        // Hash the PIN
        const salt = bcrypt.genSaltSync(10);
        const hashedPin = bcrypt.hashSync(formData.pin, salt);

        const { error: dbError } = await supabase
          .from('organizers')
          .insert([{
            id: authUser?.id,
            name: formData.name,
            mobile: formData.mobile,
            pin_hash: hashedPin
          }]);
        
        if (dbError) {
          if (dbError.code === '23505') throw new Error("This mobile number is already registered.");
          throw dbError;
        }
      } else {
        // Login: Fetch by mobile
        const { data, error: dbError } = await supabase
          .from('organizers')
          .select('*')
          .eq('mobile', formData.mobile)
          .single();
        
        if (dbError || !data) throw new Error("Account not found. Please register first.");

        // Compare hash
        const isMatch = bcrypt.compareSync(formData.pin, data.pin_hash);
        if (!isMatch) throw new Error("Incorrect PIN. Please try again.");

        // Persist mobile for profile fetching if they switch devices
        localStorage.setItem('apna_logged_mobile', formData.mobile);

        // If matched, sign in anonymously to keep session valid
        try {
          const { error: authError } = await supabase.auth.signInAnonymously();
          if (authError) throw authError;
        } catch (authErr: any) {
          if (authErr.message?.includes('Anonymous sign-ins are disabled')) {
             throw new Error("ERROR: Anonymous login is disabled in Supabase. Please enable it in Auth > Providers.");
          }
          throw authErr;
        }
      }

      setSuccessMsg(mode === 'new' ? "Account Registered! 🔥" : "Welcome back! 🏏");
      setTimeout(() => onSuccess(), 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 font-bold text-zinc-900 dark:text-white outline-none focus:border-red-600 transition-colors mb-3 placeholder:text-zinc-400";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative"
          >
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-[2.5rem]">
                <Loader2 className="animate-spin text-red-600" size={48} />
              </div>
            )}

            <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 rounded-full p-2 transition-colors">
              <X size={20} />
            </button>
            
            {mode === 'select' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                 <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-600/20">
                      <Trophy size={28} />
                    </div>
                 </div>
                 <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2 uppercase tracking-tighter italic flex items-center justify-center gap-2">
                    APNA <span className="text-red-600">CRICKET</span>
                 </h2>
                 <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black rounded-lg text-[8px] font-black text-white uppercase tracking-widest mb-8">
                    <span className="italic">G</span> GNZ_ENGINE ACCESS
                 </div>
                 
                 <div className="flex flex-col gap-3">
                    <motion.button 
                      whileTap={{ scale: 0.98 }} 
                      onClick={() => setMode('old')} 
                      className="group bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black py-5 rounded-2xl flex items-center justify-between px-6 transition-all hover:scale-[1.02]"
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-0.5">Existing Player</span>
                        <span className="text-sm uppercase tracking-tight">Sign In</span>
                      </div>
                      <Lock size={20} className="text-red-600" />
                    </motion.button>

                    <motion.button 
                      whileTap={{ scale: 0.98 }} 
                      onClick={() => setMode('new')} 
                      className="group bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-black py-5 rounded-2xl flex items-center justify-between px-6 transition-all hover:border-red-600/50 hover:scale-[1.02]"
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-0.5">New Account</span>
                        <span className="text-sm uppercase tracking-tight">Create Profile</span>
                      </div>
                      <Plus size={20} className="text-red-600" />
                    </motion.button>
                 </div>

                 <p className="mt-8 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Secured by GNZ Identity Module 1.0.4
                 </p>
              </motion.div>
            )}

            {(mode === 'new' || mode === 'old') && (
               <motion.div initial={{ opacity: 0, x: mode === 'new' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2 pt-2">
                 <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                   {mode === 'new' ? <Plus className="text-red-600" size={24} /> : <Lock className="text-red-600" size={24} />}
                   {mode === 'new' ? 'Register Profile' : 'Organizer Login'}
                 </h2>

                 {errorMsg && (
                   <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl flex items-center gap-2 text-rose-500 text-xs font-bold mb-4">
                     <AlertCircle size={16} /> {errorMsg}
                   </div>
                 )}

                 {successMsg && (
                   <div className="bg-red-600/10 border border-red-600/20 p-3 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold mb-4">
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
                 
                 <div className="flex bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden focus-within:border-red-600 transition-colors mb-3">
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
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl mt-4 shadow-lg shadow-red-600/30 uppercase tracking-wide text-sm transition-all disabled:opacity-50"
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
