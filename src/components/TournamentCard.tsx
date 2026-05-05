import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar } from 'lucide-react';
import { Tournament } from '../types';
import { cn } from '../lib/utils';

export const TournamentCard: React.FC<{ tournament: Tournament, onJoin: () => void }> = ({ tournament, onJoin }) => {
  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm"
    >
      <h3 className="font-black text-lg">{tournament.name}</h3>
      <div className="flex gap-3 mt-2 text-sm text-zinc-500 font-medium">
        <span className="flex items-center gap-1"><MapPin size={14} className="text-emerald-500"/> {tournament.location}</span>
        <span className="flex items-center gap-1"><Calendar size={14} className="text-emerald-500"/> {tournament.date}</span>
      </div>
      <div className="mt-4 flex justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4 items-center">
        <span className={cn(
          "text-xs font-bold px-3 py-1.5 rounded-lg border",
          tournament.status === 'urgent' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
        )}>
          {tournament.spots}
        </span>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onJoin} 
          disabled={tournament.status === 'full'} 
          className="bg-emerald-500 text-white font-black px-6 py-2 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
        >
          JOIN NOW
        </motion.button>
      </div>
    </motion.div>
  );
};
