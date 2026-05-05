import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Activity, BarChart2, Eye, User, 
  Sun, Moon, Zap
} from 'lucide-react';
import { MatchCard } from '../components/MatchCard';
import { TournamentCard } from '../components/TournamentCard';
import { VisionModal } from '../components/VisionModal';
import { CreateMatchAuthModal } from '../components/Modals';
import { Toast } from '../components/Toast';
import { Score, Tournament } from '../types';

interface UserAppProps { 
  score: Score; 
  tournaments: Tournament[]; 
  ticker: string; 
  isDarkMode: boolean; 
  toggleTheme: () => void; 
  onOrganizerLogin: () => void; 
}

const UserApp: React.FC<UserAppProps> = ({ score, tournaments, ticker, isDarkMode, toggleTheme, onOrganizerLogin }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrganizerAuthOpen, setIsOrganizerAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleJoin = () => {
    if (!isAuthenticated) setIsAuthModalOpen(true);
    else setToastMsg("Successfully requested to join! 🔥");
  };

  const handleOrganizerSuccess = () => {
    setIsOrganizerAuthOpen(false);
    onOrganizerLogin(); 
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 pb-12 transition-colors duration-300">
      {/* Navbar */}
      <header className="bg-white dark:bg-zinc-950 sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-xl text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Trophy size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">APNA CRICKET</span>
          </div>
          <div className="flex items-center gap-3">
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

      <div className="bg-zinc-50 dark:bg-zinc-950 pb-16 pt-12 px-4 text-center border-b border-zinc-200 dark:border-zinc-800">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
          Play Local. <span className="text-emerald-500">Score Global.</span> 🌍
        </motion.h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto text-lg">
            Built for village champions. Bring professional live scoring to your local grounds with Apnacricket.co.in
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-10 mb-12">
        <div className="bg-white/90 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 grid grid-cols-4 gap-4">
          {[
            { icon: <Activity className="text-rose-500" />, title: "Live", color: "bg-rose-500/10" },
            { icon: <Trophy className="text-emerald-500" />, title: "Leagues", color: "bg-emerald-500/10" },
            { icon: <BarChart2 className="text-blue-500" />, title: "Stats", color: "bg-blue-500/10" },
            { icon: <Eye className="text-orange-500" />, title: "Vision", color: "bg-orange-500/10" },
          ].map((item, idx) => (
            <motion.div 
              key={idx} whileHover={{ y: -8 }} whileTap={{ scale: 0.95 }}
              onClick={item.title === 'Vision' ? () => setIsVisionModalOpen(true) : undefined} 
              className="flex flex-col items-center text-center gap-3 cursor-pointer transition-all p-2 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color} shadow-sm`}>{item.icon}</div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider">{item.title}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mb-14 relative z-10">
        <motion.div 
          animate={{ scale: [1, 1.01, 1] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          onClick={() => setIsOrganizerAuthOpen(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl dark:shadow-[0_20px_50px_rgba(16,185,129,0.2)] cursor-pointer text-center text-white relative overflow-hidden group border border-emerald-400/20"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32"></div>
          
          <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className="inline-block relative z-10 transition-transform">
            <Trophy className="mx-auto mb-6 text-emerald-100" size={56} strokeWidth={2.5} />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-2 relative z-10">Host Your Own Tournament</h2>
          <p className="font-bold text-emerald-100/80 text-base sm:text-xl relative z-10">Register now to manage live matches and scoreboards in real-time!</p>
          
          <div className="mt-8 relative z-10">
            <span className="bg-white/20 backdrop-blur-md text-white font-black px-8 py-3 rounded-2xl text-sm border border-white/30 hover:bg-white/30 transition-all uppercase tracking-widest">Open Dashboard</span>
          </div>
        </motion.div>
      </div>

      <main className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <MatchCard score={score} />
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-black mb-6 uppercase tracking-tight flex items-center gap-3">
                Upcoming Clashes <span className="text-emerald-500">•</span>
            </h2>
            <div className="space-y-4">
              <AnimatePresence>
                {tournaments.map((t) => (
                  <TournamentCard key={t.id} tournament={t} onJoin={handleJoin} />
                ))}
              </AnimatePresence>
              {tournaments.length === 0 && (
                <div className="bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center">
                    <p className="text-zinc-500 font-bold">No active tournaments nearby. Stay tuned!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Login Simulation Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-zinc-950 border border-zinc-800 w-full max-w-sm rounded-[2.5rem] p-10 text-white text-center shadow-2xl">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <User size={32} className="text-emerald-500" />
              </div>
              <h3 className="font-black text-2xl mb-2 uppercase tracking-wide">Secure Access</h3>
              <p className="text-zinc-500 text-sm mb-8">Login to join tournaments and track your stats across leagues.</p>
              <div className="space-y-4">
                  <motion.button 
                    whileTap={{ scale: 0.95 }} 
                    onClick={() => {setIsAuthenticated(true); setIsAuthModalOpen(false); setToastMsg("Welcome back, Champion! 🏏")}} 
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-widest text-sm"
                  >
                    Simulate OTP Login
                  </motion.button>
                  <button onClick={() => setIsAuthModalOpen(false)} className="text-xs font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">
                    Maybe Later
                  </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

      <footer className="max-w-7xl mx-auto px-4 mt-20 pt-10 border-t border-zinc-200 dark:border-zinc-800 text-center">
          <p className="text-zinc-500 text-sm font-medium">© 2026 APNA CRICKET. Powering rural sports via <span className="text-emerald-500">apnacricket.co.in</span></p>
      </footer>
    </div>
  );
};

export default UserApp;
