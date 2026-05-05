import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye } from 'lucide-react';

export const VisionModal: React.FC<{ isOpen: boolean; onClose: () => void; onSecretTrigger: () => void }> = ({ isOpen, onClose, onSecretTrigger }) => {
  const [tapCount, setTapCount] = useState(0);

  const handleSecretTap = () => {
    if (tapCount + 1 >= 3) {
      setTapCount(0); 
      onClose(); 
      onSecretTrigger();
    } else {
      setTapCount(prev => prev + 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 rounded-full p-2">
                <X size={20} />
            </button>
            <div className="text-center mb-6">
              <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Eye size={40} className="text-orange-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-wider">Our Vision</h2>
            </div>
            <div className="space-y-6 text-zinc-700 dark:text-zinc-300 text-center">
              <p className="leading-relaxed text-sm md:text-base font-medium">
                Empowering rural sports talent. We believe every village has a hero waiting to be discovered. 
                Through <span onClick={handleSecretTap} className="select-none text-emerald-600 dark:text-emerald-400 font-black tracking-wide cursor-pointer decoration-2 underline-offset-4 decoration-emerald-500/30 hover:underline">APNA CRICKET</span>, we bring professional live scoring straight to your local ground.
              </p>
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-6 flex justify-center">
                <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 inline-flex shadow-sm">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-white dark:border-zinc-800">AH</div>
                  <div className="text-left">
                    <h3 className="font-black text-zinc-900 dark:text-white text-lg">Avinash Huse</h3>
                    <p className="text-emerald-600 dark:text-emerald-500 text-xs font-bold uppercase tracking-widest">CEO & Founder</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
