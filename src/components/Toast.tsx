import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle } from 'lucide-react';

export const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div 
          initial={{ y: 50, opacity: 0, x: '-50%' }} 
          animate={{ y: 0, opacity: 1, x: '-50%' }} 
          exit={{ y: 20, opacity: 0, x: '-50%' }}
          className="fixed bottom-8 left-1/2 z-[100]"
        >
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3 min-w-[280px] border border-emerald-400">
            <CheckCircle size={20} className="shrink-0" />
            <span className="flex-1">{message}</span>
            <button onClick={onClose} className="ml-2 p-1 hover:bg-white/20 rounded-lg transition-colors">
              <X size={18}/>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
