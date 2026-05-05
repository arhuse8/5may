import React from 'react';
import { motion } from 'motion/react';
import { Flame } from 'lucide-react';
import { Score } from '../types';

export const MatchCard: React.FC<{ score: Score }> = ({ score }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-lg relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <h2 className="text-xl font-black mb-4 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span> 
        MATCH CENTER
      </h2>
      <div className="flex justify-between items-center mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <p className="text-xs text-zinc-500 font-bold tracking-wider">GRAM PANCHAYAT FINALS • T20</p>
        <div className="bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-500 text-[10px] font-black px-2 py-1 rounded">LIVE</div>
      </div>
      <div className="flex justify-between items-center">
        <div className="font-black text-xl flex items-center gap-2">
          {score.teamA} <Flame size={16} className="text-orange-500 fill-orange-500" />
        </div>
        <div className="text-right">
          <div className="text-4xl font-black">{score.runs}<span className="text-zinc-500 text-2xl">/{score.wickets}</span></div>
          <div className="text-emerald-500 text-xs font-bold mt-1">Overs: {score.overs}</div>
        </div>
      </div>
      <div className="flex justify-between items-center opacity-50 mt-4">
        <div className="font-black text-lg">{score.teamB}</div>
        <div className="text-sm font-bold">Yet to bat</div>
      </div>
    </motion.div>
  );
};
