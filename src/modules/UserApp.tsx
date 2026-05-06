import React, { useState, useMemo, useEffect } from 'react';
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
import { PlayerDashboard } from '../components/PlayerDashboard';
import LiveScorePage from '../components/LiveScorePage';
import StatsPage from '../components/StatsPage';
import ProfilePage from '../components/ProfilePage';
import HelpPage from '../components/HelpPage';
import VisionPage from '../components/VisionPage';
import DeveloperModePage from '../components/DeveloperModePage';
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
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  
  const viewOrder = [
    UserSubView.HOME, 
    UserSubView.LIVE, 
    UserSubView.LEAGUES, 
    UserSubView.STATS,
    UserSubView.PROFILE,
    UserSubView.HELP,
    UserSubView.VISION,
    UserSubView.DEVELOPER_MODE
  ];

  // Effect to handle URL parameters for Developer mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'dev') {
        setActiveSubView(UserSubView.DEVELOPER_MODE);
        // Clear param to keep URL clean but stay in mode for session
        window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleNavigate = (newView: UserSubView) => {
    const currentIndex = viewOrder.indexOf(activeSubView);
    const nextIndex = viewOrder.indexOf(newView);
    setDirection(nextIndex > currentIndex ? 1 : -1);
    setActiveSubView(newView);
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrganizerAuthOpen, setIsOrganizerAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDashboardView, setIsDashboardView] = useState(true); // Default to our new high-polish dashboard
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

  const NavItem = ({ view, icon: Icon, label }: { view: UserSubView, icon?: React.ElementType, label: string }) => (
    <button 
      onClick={() => handleNavigate(view)}
      className={cn(
        "flex flex-col items-center gap-1 transition-all p-2 rounded-xl flex-1 md:flex-initial md:px-4 md:py-2 md:flex-row md:gap-3 group",
        activeSubView === view 
          ? "text-red-600 bg-red-600/5" 
          : "text-zinc-500 hover:text-red-500"
      )}
    >
      {Icon && <Icon size={20} className={cn(activeSubView === view && "animate-pulse")} />}
      <span className="text-[10px] md:text-sm font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  const slideVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  };

  return (
    <div className={cn(
      "h-screen w-screen overflow-hidden bg-white transition-colors duration-300 font-sans flex flex-col",
      isDarkMode ? "dark:bg-zinc-950 text-white" : "text-zinc-900"
    )}>
      {/* Navbar - Hidden when on High-Polish Dashboard */}
      {!isDashboardView || activeSubView !== UserSubView.HOME ? (
        <header className="bg-white dark:bg-zinc-950 sticky top-0 z-40 border-b border-zinc-100 dark:border-zinc-800 shadow-sm shrink-0">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Profile Logo with Red Ring */}
              <div 
                className="relative cursor-pointer group"
                onClick={() => handleNavigate(UserSubView.PROFILE)}
              >
                <div className="w-14 h-14 rounded-full border-2 border-red-600 flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform bg-white dark:bg-zinc-900">
                  <div className="w-full h-full rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                    <span className="text-[10px] font-black text-zinc-950 dark:text-white uppercase leading-none">Apna</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col cursor-pointer" onClick={() => handleNavigate(UserSubView.HOME)}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase leading-none flex items-center gap-2">
                    APNA <span className="text-red-600">CRICKET</span> 👋
                  </span>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-black dark:bg-white rounded text-[8px] font-black">
                     <span className="text-white dark:text-black italic">G</span>
                     <span className="text-zinc-500 uppercase tracking-tighter">GNZ_ENGINE</span>
                  </div>
                </div>
                <span className="text-[9px] font-black tracking-[0.25em] text-zinc-400 mt-1.5 uppercase">Ready for today's game?</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-4">
              <NavItem view={UserSubView.HOME} label="HOME" />
              <NavItem view={UserSubView.LIVE} label="LIVE SCORE" />
              <NavItem view={UserSubView.LEAGUES} label="TOURNAMENTS" />
              <NavItem view={UserSubView.STATS} label="STATS" />
            </nav>

            <div className="flex items-center gap-3">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVisionModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors"
              >
                VISION
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
                <User size={16} className="text-red-600" />
                <span className="hidden sm:inline">{isAuthenticated ? "Ramesh" : "Login"}</span>
              </motion.button>
            </div>
          </div>
        </header>
      ) : null}
      
      <AnimatePresence>
        {ticker && !isDashboardView && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-red-600 text-white text-xs sm:text-sm font-bold py-2.5 px-4 flex items-center justify-center gap-2 shadow-inner overflow-hidden">
            <Zap size={16} className="fill-white animate-pulse shrink-0" />
            <span className="truncate max-w-4xl tracking-wide uppercase">{ticker}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={cn(
        "flex-1 relative overflow-hidden",
        isDashboardView && activeSubView === UserSubView.HOME ? "max-w-full" : "max-w-7xl mx-auto w-full px-4"
      )}>
        <AnimatePresence custom={direction} initial={false} mode="popLayout">
          {isDashboardView && activeSubView === UserSubView.HOME ? (
            <motion.div 
              key="player-dash" 
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 overflow-y-auto w-full h-full"
            >
              <PlayerDashboard 
                score={score} 
                onNavigate={(v) => handleNavigate(v as any)} 
                isDarkMode={isDarkMode} 
              />
            </motion.div>
          ) : activeSubView === UserSubView.HOME ? (
            <motion.div 
              key="home" 
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 overflow-y-auto space-y-12 w-full h-full"
            >
                <div className="text-center py-8">
                    <motion.h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
                        Play Local. <span className="text-red-600">Score Global.</span> 🌍
                    </motion.h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto text-lg mb-8">
                        The ultimate cricket companion for village tournaments.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={() => handleNavigate(UserSubView.LIVE)} className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-900 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl">Watch Live</button>
                        <button onClick={() => setIsOrganizerAuthOpen(true)} className="bg-red-600 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-600/20">Host Match</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <MatchCard score={score} />
                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-tight flex items-center justify-between">
                            Highlights <button onClick={() => handleNavigate(UserSubView.LEAGUES)} className="text-[10px] text-red-600 hover:underline">View All</button>
                        </h2>
                        {sortedTournaments.slice(0, 2).map((t) => (
                            <TournamentCard key={t.id} tournament={t} onJoin={handleJoin} />
                        ))}
                    </div>
                </div>
            </motion.div>
          ) : activeSubView === UserSubView.LIVE ? (
            <motion.div 
              key="live" 
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 w-full h-full overflow-y-auto"
            >
              <LiveScorePage score={score} onBack={() => handleNavigate(UserSubView.HOME)} />
            </motion.div>
          ) : activeSubView === UserSubView.PROFILE ? (
            <motion.div 
              key="profile" 
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 w-full h-full overflow-y-auto"
            >
              <ProfilePage onBack={() => handleNavigate(UserSubView.HOME)} />
            </motion.div>
          ) : activeSubView === UserSubView.HELP ? (
            <motion.div 
              key="help" 
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 w-full h-full overflow-y-auto"
            >
              <HelpPage onBack={() => handleNavigate(UserSubView.HOME)} />
            </motion.div>
          ) : activeSubView === UserSubView.LEAGUES ? (
            <motion.div 
              key="leagues" 
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 overflow-y-auto space-y-8 py-8 w-full h-full"
            >
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
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold outline-none focus:border-red-600 transition-colors shadow-sm"
                            />
                        </div>
                        <button 
                            onClick={() => setSortConfig({ key: 'timestamp', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-xl text-zinc-500 hover:text-red-600 transition-all flex items-center gap-2 shadow-sm"
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
          ) : activeSubView === UserSubView.VISION ? (
            <motion.div 
              key="vision" 
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 w-full h-full overflow-y-auto"
            >
              <VisionPage onBack={() => handleNavigate(UserSubView.HOME)} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            </motion.div>
          ) : activeSubView === UserSubView.STATS ? (
            <motion.div 
              key="stats" 
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 w-full h-full overflow-y-auto"
            >
              <StatsPage onBack={() => handleNavigate(UserSubView.HOME)} />
            </motion.div>
          ) : activeSubView === UserSubView.DEVELOPER_MODE ? (
            <motion.div 
              key="dev-mode" 
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 w-full h-full overflow-y-auto bg-black"
            >
              <DeveloperModePage onBack={() => handleNavigate(UserSubView.HOME)} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>


      {/* Mobile Bottom Nav */}
      {!isDashboardView || activeSubView !== UserSubView.HOME ? (
        <footer className="md:hidden fixed bottom-6 left-4 right-4 z-50">
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex items-center justify-between gap-2">
              <NavItem view={UserSubView.HOME} icon={LayoutDashboard} label="Home" />
              <NavItem view={UserSubView.LIVE} icon={Activity} label="Live" />
              <NavItem view={UserSubView.LEAGUES} icon={Trophy} label="Leagues" />
              <NavItem view={UserSubView.STATS} icon={BarChart2} label="Stats" />
            </div>
        </footer>
      ) : null}

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
