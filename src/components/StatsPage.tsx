import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Trophy, BarChart2, Star, TrendingUp, Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatsPageProps {
  onBack: () => void;
}

const StatsPage: React.FC<StatsPageProps> = ({ onBack }) => {
  const leaders = [
    { name: "Rahul Singh", team: "Solapur Kings", runs: 452, avg: 64.5, sr: 152.3, matches: 8 },
    { name: "Amit Kumar", team: "Pune Warriors", runs: 388, avg: 48.5, sr: 138.9, matches: 9 },
    { name: "Vikram Patil", team: "Sangli Strikers", runs: 375, avg: 37.5, sr: 165.2, matches: 10 },
    { name: "Rajesh Mane", team: "Satara Tigers", runs: 312, avg: 31.2, sr: 124.5, matches: 8 },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-sm font-black uppercase tracking-tighter">League Stats</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <div className="bg-zinc-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-600/30">
                        Season 2026 Live
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic uppercase">
                        Master the <span className="text-red-500">Board.</span>
                    </h2>
                    <p className="text-zinc-400 font-medium max-w-sm">Detailed performance analytics for every player and team in the regional circuit.</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Matches Played</p>
                        <p className="text-4xl font-black italic">142</p>
                    </div>
                    <div className="text-right border-l border-white/10 pl-4">
                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Avg Strike Rate</p>
                        <p className="text-4xl font-black italic text-red-500">132.5</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Filters and Tabs */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="flex gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
                {["Batting", "Bowling", "Fielding", "MVPs"].map((tab, i) => (
                    <button key={i} className={cn(
                        "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        i === 0 ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    )}>
                        {tab}
                    </button>
                ))}
            </div>
            <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search player..." 
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:border-red-600 transition-colors"
                    />
                </div>
                <button className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-500">
                    <Filter size={20} />
                </button>
            </div>
        </div>

        {/* Stats Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Player</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Runs</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Avg</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">SR</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Trend</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {leaders.map((p, i) => (
                            <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/50 transition-colors group">
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-xs">
                                            {p.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-black text-sm">{p.name}</p>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{p.team}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 font-black text-lg italic text-red-600">{p.runs}</td>
                                <td className="px-6 py-6 font-bold text-sm">{p.avg}</td>
                                <td className="px-6 py-6 font-bold text-sm">{p.sr}</td>
                                <td className="px-6 py-6 font-bold text-sm">
                                    {i % 2 === 0 ? (
                                        <div className="flex items-center gap-1 text-emerald-500">
                                            <ArrowUpRight size={16} />
                                            <span>+12%</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-rose-500">
                                            <ArrowDownRight size={16} />
                                            <span>-4%</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-6">
                                    <button className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors">
                                        Full Profile
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-6 bg-zinc-50 dark:bg-zinc-950/50 text-center">
                <button className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-red-600 transition-colors">
                    Load More Players (50+)
                </button>
            </div>
        </div>

        {/* Record Holders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-red-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <Trophy className="absolute top-6 right-6 opacity-20" size={80} />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 italic">Orange Cap Holder</h3>
                <div className="flex items-end gap-6">
                    <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center font-black text-3xl">RS</div>
                    <div>
                        <p className="text-4xl font-black tracking-tighter italic">RAHUL SINGH</p>
                        <p className="text-sm font-bold opacity-80 mt-1 uppercase tracking-widest">Solapur Kings • 452 Runs</p>
                    </div>
                </div>
            </div>
            <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white border border-white/5">
                <BarChart2 className="text-red-500 mb-6" size={32} />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">Team Standings</h3>
                <div className="space-y-4">
                    {[
                        { name: "Pune Warriors", pts: 16, w: 8, l: 1 },
                        { name: "Satara Tigers", pts: 14, w: 7, l: 2 },
                        { name: "Solapur Kings", pts: 12, w: 6, l: 3 },
                    ].map((t, i) => (
                        <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                            <span className="font-black text-sm uppercase tracking-wide">{t.name}</span>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] uppercase font-bold text-zinc-500">W:{t.w} L:{t.l}</span>
                                <span className="font-black text-red-500">{t.pts} PTS</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default StatsPage;
