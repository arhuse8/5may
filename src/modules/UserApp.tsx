import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Activity, BarChart2, Eye, User, 
  Sun, Moon, Zap, LayoutDashboard, Calendar, Search, Filter, ArrowUpDown, Clock
} from 'lucide-react';
import { MatchCard } from '../components/MatchCard';
import { TournamentCard } from '../components/TournamentCard';
import { VisionModal } from '../components/VisionModal';
import { CreateMatchAuthModal } from '../components/Modals';
import { Toast } from '../components/Toast';
import { Score, Tournament, UserSubView } from '../types';
import { cn } from '../lib/utils';

interface UserAppProps { 
  score: Score; 
  tournaments: Tournament[]; 
  ticker: string; 
  isDarkMode: boolean; 
  toggleTheme: () => void; 
  onOrganizerLogin: () => void; 
  onVision: () => void;
}

const UserApp: React.FC<UserAppProps> = ({ score, tournaments, ticker, isDarkMode, toggleTheme, onOrganizerLogin, onVision }) => {
  const [activeSubView, setActiveSubView] = useState<UserSubView>(UserSubView.HOME);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrganizerAuthOpen, setIsOrganizerAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: 'timestamp' | 'name'; direction: 'asc' | 'desc' }>({ key: 'timestamp', direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState("");

  const handleJoin = () => {
    if (!isAuthenticated) setIsAuthModalOpen(true);
    else setToastMsg("Successfully requested to join! 🔥");
  };

  const handleOrganizerSuccess = () => {
    setIsOrganizerAuthOpen(false);
    onOrganizerLogin(); 
  };

  const sortedTournaments = useMemo(() => {
    let result = [...tournaments];
    
    // Search filter
    if (searchQuery) {
      result = result.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.location.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Sort
    result.sort((a, b) => {
      const valA = a[sortConfig.key] || "";
      const valB = b[sortConfig.key] || "";
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [tournaments, sortConfig, searchQuery]);

  const NavItem = ({ view, icon: Icon, label }: { view: UserSubView, icon: React.ElementType, label: string }) => (
    <button 
      onClick={() => setActiveSubView(view)}
      className={cn(
        "flex flex-col items-center gap-1 transition-all p-2 rounded-xl flex-1 md:flex-initial md:px-4 md:py-2 md:flex-row md:gap-3",
        activeSubView === view 
          ? "text-emerald-500 bg-emerald-500/10" 
          : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      )}
    >
      <Icon size={20} className={cn(activeSubView === view && "animate-pulse")} />
      <span className="text-[10px] md:text-sm font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 pb-24 md:pb-12 transition-colors duration-300">
      {/* Navbar */}
      <header className="bg-white dark:bg-zinc-950 sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveSubView(UserSubView.HOME)}>
            <div className="bg-emerald-500 p-1.5 rounded-xl text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Trophy size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">APNA CRICKET</span>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <NavItem view={UserSubView.HOME} icon={LayoutDashboard} label="Home" />
            <NavItem view={UserSubView.LIVE} icon={Activity} label="Live" />
            <NavItem view={UserSubView.LEAGUES} icon={Trophy} label="Leagues" />
            <NavItem view={UserSubView.STATS} icon={BarChart2} label="Stats" />
          </nav>

          <div className="flex items-center gap-3">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={onVision}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-emerald-500 transition-colors"
            >
              Vision
            </motion.button>
            <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800"></div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTheme} className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }} 
              onClick={() => isAuthenticated ? setIsAuthenticated(false) : setIsAuthModalOpen(true)} 
              className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              <User size={16} className="text-emerald-500" />
              <span className="hidden sm:inline">{isAuthenticated ? "Ramesh" : "Login"}</span>
            </motion.button>
          </div>
        </div>
      </header>
      
      <AnimatePresence>
        {ticker && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-emerald-600 text-white text-xs sm:text-sm font-bold py-2.5 px-4 flex items-center justify-center gap-2 shadow-inner overflow-hidden">
            <Zap size={16} className="fill-white animate-pulse shrink-0" />
            <span className="truncate max-w-4xl">{ticker}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        <AnimatePresence>
          {activeSubView === UserSubView.HOME && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-12">
                <div className="text-center py-8">
                    <motion.h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
                        Play Local. <span className="text-emerald-500">Score Global.</span> 🌍
                    </motion.h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto text-lg mb-8">
                        The ultimate cricket companion for village tournaments.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={() => setActiveSubView(UserSubView.LIVE)} className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-900 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl">Watch Live</button>
                        <button onClick={() => setIsOrganizerAuthOpen(true)} className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20">Host Match</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <MatchCard score={score} />
                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-tight flex items-center justify-between">
                            Highlights <button onClick={() => setActiveSubView(UserSubView.LEAGUES)} className="text-[10px] text-emerald-500 hover:underline">View All</button>
                        </h2>
                        {sortedTournaments.slice(0, 2).map((t) => (
                            <TournamentCard key={t.id} tournament={t} onJoin={handleJoin} />
                        ))}
                    </div>
                </div>
            </motion.div>
          )}

          {activeSubView === UserSubView.LIVE && (
            <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="py-12">
                <div className="max-w-3xl mx-auto space-y-12">
                   <div className="text-center">
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Match Center 📡</h2>
                        <p className="text-zinc-500">Auto-refreshing every ball. Never miss a moment.</p>
                   </div>
                   <MatchCard score={score} />
                   <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
                        <h3 className="font-black mb-6 uppercase text-sm tracking-widest text-emerald-500">Commentary</h3>
                        <div className="space-y-6">
                            {[
                                { over: "16.4", text: "FOUR! Beautiful drive through covers by Sangli Strikers.", type: "boundary" },
                                { over: "16.3", text: "1 run. Tucked away to long on.", type: "single" },
                                { over: "16.2", text: "WICKET! Massive blow. Clean bowled!", type: "wicket" },
                            ].map((c, i) => (
                                <div key={i} className="flex gap-4 border-l-2 border-zinc-100 dark:border-zinc-800 pl-6 relative">
                                    <div className={cn(
                                        "absolute -left-[5px] top-0 w-2 h-2 rounded-full",
                                        c.type === 'boundary' ? "bg-emerald-500" : c.type === 'wicket' ? "bg-rose-500" : "bg-zinc-300"
                                    )}></div>
                                    <span className="font-black text-xs min-w-[40px] text-zinc-400">{c.over}</span>
                                    <p className="text-sm font-medium">{c.text}</p>
                                </div>
                            ))}
                        </div>
                   </div>
                </div>
            </motion.div>
          )}

          {activeSubView === UserSubView.LEAGUES && (
            <motion.div key="leagues" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Explore Leagues 🏆</h2>
                        <p className="text-zinc-500 mt-1">Discover tournaments in your region.</p>
                    </div>
                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search Solapur, Pune..." 
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold outline-none focus:border-emerald-500 transition-colors shadow-sm"
                            />
                        </div>
                        <button 
                            onClick={() => setSortConfig({ key: 'timestamp', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-xl text-zinc-500 hover:text-emerald-500 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Calendar size={20} />
                            <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">By Date</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedTournaments.map((t) => (
                        <TournamentCard key={t.id} tournament={t} onJoin={handleJoin} />
                    ))}
                </div>
            </motion.div>
          )}

          {activeSubView === UserSubView.STATS && (
            <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-500">
                    <BarChart2 size={40} />
                </div>
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Player Rankings</h2>
                    <p className="text-zinc-500 max-w-sm mx-auto mt-2">Personal player statistics and historical league data are coming in the next update!</p>
                </div>
                <button onClick={() => setActiveSubView(UserSubView.HOME)} className="text-xs font-black uppercase tracking-widest text-emerald-500 hover:underline">Back to Home</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <footer className="md:hidden fixed bottom-6 left-4 right-4 z-50">
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex items-center justify-between gap-2">
            <NavItem view={UserSubView.HOME} icon={LayoutDashboard} label="Home" />
            <NavItem view={UserSubView.LIVE} icon={Activity} label="Live" />
            <NavItem view={UserSubView.LEAGUES} icon={Trophy} label="Leagues" />
            <NavItem view={UserSubView.STATS} icon={BarChart2} label="Stats" />
          </div>
      </footer>

      <VisionModal 
        isOpen={isVisionModalOpen} 
        onClose={() => setIsVisionModalOpen(false)} 
        onSecretTrigger={() => onOrganizerLogin()} 
      />
      
      <CreateMatchAuthModal 
        isOpen={isOrganizerAuthOpen} 
        onClose={() => setIsOrganizerAuthOpen(false)} 
        onSuccess={handleOrganizerSuccess} 
      />

      <Toast message={toastMsg} onClose={() => setToastMsg("")} />
    </div>
  );
};

export default UserApp;
