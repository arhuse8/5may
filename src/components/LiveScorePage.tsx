import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Share2, ThumbsUp, MessageSquare, Shield, Activity, Users, MapPin } from 'lucide-react';
import { Score } from '../types';
import { MatchCard } from './MatchCard';
import { cn } from '../lib/utils';

interface LiveScorePageProps {
  score: Score;
  onBack: () => void;
}

const LiveScorePage: React.FC<LiveScorePageProps> = ({ score, onBack }) => {
  const commentary = [
    { over: "16.4", text: "FOUR! Beautiful drive through covers by Sangli Strikers.", type: "boundary" },
    { over: "16.3", text: "1 run, flicked to deep mid-wicket for a comfortable single.", type: "single" },
    { over: "16.2", text: "OUT! The big fish is gone! Caught at long-on.", type: "wicket" },
    { over: "16.1", text: "Dot ball. Good length outside off, batsman misses.", type: "dot" },
    { over: "15.6", text: "SIX! Straight over the bowler's head. Clean strike!", type: "boundary" },
  ];

  const scorecard = [
    { name: "Rahul S.", runs: 45, balls: 32, fours: 4, sixes: 2, sr: 140.6 },
    { name: "Amit K.", runs: 12, balls: 15, fours: 1, sixes: 0, sr: 80.0 },
    { name: "Vikram P.", runs: 68, balls: 41, fours: 7, sixes: 3, sr: 165.8 },
    { name: "Rajesh M.", runs: 2, balls: 5, fours: 0, sixes: 0, sr: 40.0 },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-sm font-black uppercase tracking-tighter">Live Match</h1>
            <span className="text-[10px] font-bold text-red-600 animate-pulse tracking-widest uppercase">Live Center</span>
          </div>
          <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all">
            <Share2 size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Main Scorecard */}
        <MatchCard score={score} />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Run Rate", val: "8.4", icon: <Shield size={16} /> },
            { label: "Required", val: "9.2", icon: <Activity size={16} /> },
            { label: "Win %", val: "64%", icon: <ThumbsUp size={16} /> },
            { label: "Predict", val: "185", icon: <Users size={16} /> },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-3">
              <div className="text-red-600 bg-red-600/10 p-2 rounded-xl">
                {s.icon}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-400">{s.label}</p>
                <p className="text-sm font-black">{s.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs - Simple Simulation */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["Commentary", "Scorecard", "Squads", "Gallery"].map((tab, i) => (
            <button key={i} className={cn(
              "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all",
              i === 0 ? "bg-red-600 text-white shadow-lg shadow-red-600/30" : "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-500"
            )}>
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Commentary */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black uppercase text-sm tracking-widest text-red-600">Ball by Ball</h3>
                    <div className="flex gap-2">
                        <span className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">W</span>
                        <span className="w-6 h-6 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-bold">4</span>
                        <span className="w-6 h-6 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                    </div>
                </div>
                <div className="space-y-8">
                    {commentary.map((c, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          key={i} 
                          className="flex gap-6 relative"
                        >
                            <div className="flex flex-col items-center">
                                <div className={cn(
                                    "w-3 h-3 rounded-full mt-1.5 shrink-0 z-10",
                                    c.type === 'boundary' ? "bg-red-600" : c.type === 'wicket' ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-700"
                                )}></div>
                                {i !== commentary.length - 1 && <div className="w-0.5 grow bg-zinc-100 dark:bg-zinc-800 my-1"></div>}
                            </div>
                            <div className="pb-8">
                                <span className="font-black text-xs text-red-600 mb-1 block">{c.over}</span>
                                <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 leading-relaxed">{c.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <button className="w-full py-4 text-xs font-black uppercase tracking-widest text-red-600 border border-red-600/20 rounded-2xl hover:bg-red-600/5 transition-all">
                    Load Previous Overs
                </button>
            </div>
          </div>

          {/* Right Column: Mini Stats */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-white/5 p-6 rounded-[2.5rem] text-white">
                <h3 className="text-red-500 font-black text-xs uppercase tracking-widest mb-6">Batting Stats</h3>
                <div className="space-y-4">
                    {scorecard.map((p, i) => (
                        <div key={i} className="flex justify-between items-center group">
                            <div>
                                <p className="font-black text-sm group-hover:text-red-500 transition-colors">{p.name}</p>
                                <p className="text-[10px] text-zinc-500 font-bold">{p.balls} balls • SR {p.sr}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-lg">{p.runs}</p>
                                <p className="text-[10px] text-zinc-500 font-bold">{p.fours}x4, {p.sixes}x6</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm text-center">
                <MapPin className="mx-auto text-red-600 mb-4" size={32} />
                <h4 className="font-black text-sm uppercase tracking-tighter">Venue Details</h4>
                <p className="text-xs text-zinc-500 font-medium mt-1">Chatrapati Shivaji Stadium, Pune</p>
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-center gap-6">
                    <div>
                        <p className="text-[10px] font-black uppercase text-zinc-400">Temp</p>
                        <p className="text-sm font-black">32°C</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-zinc-400">Humidity</p>
                        <p className="text-sm font-black">45%</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button for Reactions */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl shadow-red-600/40 flex items-center justify-center"
        >
          <MessageSquare size={24} />
        </motion.button>
      </div>
    </div>
  );
};

export default LiveScorePage;
