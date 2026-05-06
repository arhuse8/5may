import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, MapPin, Trophy, Users, History, 
  BarChart2, ShoppingBag, MoreHorizontal, 
  Play, Bell, MessageCircle, ChevronRight,
  Home, Search, PlusCircle, User
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Score, UserSubView } from '../types';

interface PlayerDashboardProps {
  score: Score;
  onNavigate: (view: UserSubView) => void;
  isDarkMode: boolean;
}

export const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ score, onNavigate, isDarkMode }) => {
  return (
    <div className={cn(
      "min-h-screen pb-24 safe-bottom transition-colors duration-300",
      isDarkMode ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"
    )}>
      {/* Header */}
      <header className="px-6 pt-6 pb-4 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate(UserSubView.PROFILE)}
            className="w-14 h-14 rounded-full border-2 border-red-600 flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform bg-white dark:bg-zinc-900 overflow-hidden"
          >
            <div className="w-full h-full rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <span className="text-[10px] font-black text-zinc-950 dark:text-white uppercase leading-none">Apna</span>
            </div>
          </button>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-tight flex items-center gap-1 uppercase">
              APNA<span className="text-red-600">CRICKET</span> 👋
            </h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Ready for today's game?</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => onNavigate(UserSubView.HELP)}
            className="relative p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl"
          >
            <Bell size={20} className="text-zinc-500" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-[10px] font-black text-white">3</span>
          </button>
          <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
            <MessageCircle size={20} className="text-zinc-500" />
          </div>
        </div>
      </header>

      <main className="px-5 space-y-6">
        {/* Matches Near You Banner */}
        <motion.div 
          whileTap={{ scale: 0.98 }}
          className="bg-red-600 border border-red-500 rounded-3xl p-6 flex items-center justify-between relative overflow-hidden group shadow-xl shadow-red-600/20"
        >
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-white text-sm font-black uppercase tracking-widest">3 Matches</p>
              <p className="text-white/90 text-sm font-bold">near you today</p>
            </div>
          </div>
          <button className="relative z-10 text-white flex items-center gap-1 text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform bg-black/20 px-4 py-2 rounded-xl">
            Check Now <ChevronRight size={14} />
          </button>
          
          {/* Background Highlight Image */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=300" 
              className="w-full h-full object-cover"
              alt=""
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Primary Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Quick Match Card */}
          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="bg-zinc-900 dark:bg-zinc-900 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden"
          >
            <div className="bg-red-600 p-4 rounded-2xl mb-4 shadow-lg shadow-red-600/40">
              <Zap size={32} className="fill-white text-white" />
            </div>
            <h2 className="font-black text-white text-sm leading-tight mb-1 uppercase tracking-tighter">QUICK MATCH</h2>
            <p className="text-white/50 text-[9px] font-bold uppercase tracking-widest mb-4">Join instantly</p>
            <div className="flex items-center gap-1 text-[10px] font-black text-red-500 uppercase">
              PLAY NOW <ChevronRight size={12} />
            </div>
          </motion.div>

          {/* Turf Cricket Card */}
          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="bg-white border-2 border-red-500/10 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden"
          >
            <div className="bg-zinc-100 p-4 rounded-2xl mb-4">
              <Trophy size={32} className="text-red-600" />
            </div>
            <h2 className="font-black text-zinc-900 text-sm leading-tight mb-1 uppercase tracking-tighter">TURF CRICKET</h2>
            <p className="text-zinc-400 text-[9px] font-bold uppercase tracking-widest mb-4">Book slots</p>
            <div className="flex items-center gap-1 text-[10px] font-black text-red-600 uppercase">
              BOOK NOW <ChevronRight size={12} />
            </div>
          </motion.div>
        </div>

        {/* Secondary Options Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Users, title: "FIND", sub: "PLAYERS", desc: "Connect with local talent", color: "red", view: UserSubView.LEAGUES },
            { icon: Trophy, title: "NEW", sub: "TOURNAMENT", desc: "Climb the rankings", color: "dark", view: UserSubView.LEAGUES },
            { icon: History, title: "RECENT", sub: "MATCHES", desc: "Your cricket journey", color: "zinc", view: UserSubView.LIVE },
            { icon: BarChart2, title: "MY", sub: "STATS", desc: "Track every run", color: "red", view: UserSubView.STATS },
            { icon: ShoppingBag, title: "CRICKET", sub: "SHOP", desc: "Premium gear", color: "zinc", view: UserSubView.LEAGUES },
            { icon: MoreHorizontal, title: "MORE", sub: "FEATURES", desc: "Upcoming tools", color: "zinc", view: UserSubView.VISION }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate(item.view)}
              className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/50 rounded-3xl p-5 flex flex-col items-start gap-4 group hover:border-red-500/40 transition-colors cursor-pointer"
            >
              <div className={cn(
                "p-3 rounded-2xl shrink-0 transition-transform group-hover:scale-110",
                item.color === 'red' ? "bg-red-600 text-white" :
                item.color === 'dark' ? "bg-zinc-900 text-white" :
                "bg-white dark:bg-zinc-800 text-zinc-400 shadow-sm"
              )}>
                <item.icon size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-black text-xs leading-none mb-1 tracking-tight uppercase">
                  {item.title} {item.sub}
                </h3>
                <p className="text-[9px] text-zinc-400 font-bold leading-tight line-clamp-1">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span> LIVE NOW
            </h2>
            <button className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] hover:underline">View All</button>
          </div>

          <div className="bg-zinc-900 rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col gap-8 shadow-2xl">
             <div className="flex items-center justify-between gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mx-auto border border-white/10">
                    <Trophy size={20} />
                  </div>
                  <p className="text-xs font-black text-white/50 uppercase tracking-tighter truncate w-16">{score.teamA}</p>
                  <p className="text-2xl font-black text-white">18/2 <span className="text-[10px] text-white/30 block mt-1">(2.1 Overs)</span></p>
                </div>

                <div className="text-center flex flex-col items-center">
                   <div className="bg-red-600 px-3 py-1 rounded-lg text-[10px] font-black animate-pulse text-white mb-2 shadow-lg shadow-red-600/40">LIVE</div>
                   <p className="text-[9px] text-white/30 uppercase font-black tracking-[0.2em]">V/S</p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mx-auto border border-white/10">
                    <Zap size={20} />
                  </div>
                  <p className="text-xs font-black text-white/50 uppercase tracking-tighter truncate w-16">{score.teamB}</p>
                  <p className="text-2xl font-black text-white/20">--/-- <span className="text-[10px] block mt-1">(-.- Overs)</span></p>
                </div>
             </div>

             <div className="h-px bg-white/5 w-full"></div>

             <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-3xl border-2 border-red-600 p-1 bg-zinc-800 shadow-xl overflow-hidden rotate-3">
                    <img 
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" 
                      className="w-full h-full rounded-2xl object-cover -rotate-3" 
                      alt="Top Performer"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-red-600 text-white p-1.5 rounded-xl shadow-lg">
                    <Trophy size={14} />
                  </div>
                </div>
                <div>
                   <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] leading-none mb-2">MVP Spotlight</p>
                   <p className="text-xl font-black text-white leading-tight uppercase tracking-tighter">Sopan Huse</p>
                   <div className="flex gap-4 items-center mt-2">
                      <span className="text-sm font-black text-white">78* <span className="text-[10px] text-white/40">Runs</span></span>
                      <div className="h-3 w-px bg-white/10"></div>
                      <span className="text-[10px] text-white/50 font-black uppercase">5 Sixes • 8 Fours</span>
                   </div>
                </div>
             </div>
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-3 rounded-[3rem] flex items-center justify-between shadow-2xl">
          <button 
            onClick={() => onNavigate(UserSubView.HOME)}
            className="flex flex-col items-center gap-1 flex-1 text-red-600 group"
          >
            <div className="p-2 rounded-2xl bg-red-50 dark:bg-red-600/10 transition-colors">
              <Home size={22} strokeWidth={2.5} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-tight">Home</span>
          </button>
          <button 
            onClick={() => onNavigate(UserSubView.LEAGUES)}
            className="flex flex-col items-center gap-1 flex-1 text-zinc-400"
          >
            <Search size={22} strokeWidth={2.5} />
            <span className="text-[9px] font-black uppercase tracking-tight">Search</span>
          </button>
          
          <div className="relative -top-4 flex-1 flex justify-center">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate(UserSubView.LIVE)}
              className="w-16 h-16 bg-red-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-red-600/40 border-4 border-white dark:border-zinc-900"
            >
               <PlusCircle size={32} strokeWidth={3} />
            </motion.button>
          </div>

          <button 
            onClick={() => onNavigate(UserSubView.LEAGUES)}
            className="flex flex-col items-center gap-1 flex-1 text-zinc-400"
          >
            <Trophy size={22} strokeWidth={2.5} />
            <span className="text-[9px] font-black uppercase tracking-tight">Leagues</span>
          </button>
          <button 
            onClick={() => onNavigate(UserSubView.PROFILE)}
            className="flex flex-col items-center gap-1 flex-1 text-zinc-400"
          >
            <User size={22} strokeWidth={2.5} />
            <span className="text-[9px] font-black uppercase tracking-tight">Apna</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
