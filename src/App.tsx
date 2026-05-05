import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Score, Tournament, PortalView } from './types';
import { AlertTriangle, X as CloseIcon } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// Modules
import UserApp from './modules/UserApp';
import OrganizerDashboard from './modules/OrganizerDashboard';
import VisionPage from './components/VisionPage';

// Constants
const DEFAULT_SCORE: Score = {
  teamA: "Sangli Strikers",
  teamB: "Pune Panthers",
  runs: 142,
  wickets: 4,
  overs: "16.4"
};

const DEFAULT_TOURNAMENTS: Tournament[] = [
  { 
    id: 't1', 
    name: "Gram Panchayat Cup 🏆", 
    location: "Solapur, MH", 
    date: "10 May 2026", 
    timestamp: "2026-05-10T10:00:00Z",
    startTime: "10:00 AM",
    spots: "2 Left!", 
    status: "urgent" 
  },
  { 
    id: 't2', 
    name: "Kisan Premier League 🌾", 
    location: "Nashik, MH", 
    date: "15 May 2026", 
    timestamp: "2026-05-15T09:00:00Z",
    startTime: "09:00 AM",
    spots: "House Full 🚫", 
    status: "full" 
  },
  { 
    id: 't3', 
    name: "Rural Championship 🏏", 
    location: "Sangli, MH", 
    date: "12 May 2026", 
    timestamp: "2026-05-12T08:00:00Z",
    startTime: "08:00 AM",
    spots: "10 Left", 
    status: "open" 
  },
];

const DEFAULT_TICKER = "🚨 Welcome to ApnaCricket.co.in! Registrations for Gram Panchayat Cup are now open. 🏆";

export default function App() {
  const [activePortal, setActivePortal] = useState<PortalView>(PortalView.USER);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [showConfigError, setShowConfigError] = useState(true);
  const [showVision, setShowVision] = useState(false);
  
  // Database State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [organizerProfile, setOrganizerProfile] = useState<any>(null);
  const [liveScore, setLiveScore] = useState<Score>(DEFAULT_SCORE);
  const [tournaments, setTournaments] = useState<Tournament[]>(DEFAULT_TOURNAMENTS);
  const [ticker, setTicker] = useState<string>(DEFAULT_TICKER);
  const [isLoading, setIsLoading] = useState(true);

  // Theme Sync
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Initialize Auth & Real-time
  useEffect(() => {
    // Safety timeout - reduced from 3000ms for snappier feel
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async (uid: string) => {
      const savedMobile = localStorage.getItem('apna_logged_mobile');
      
      const [byUidRes, byMobileRes] = await Promise.all([
        supabase.from('organizers').select('*').eq('id', uid).single(),
        savedMobile ? supabase.from('organizers').select('*').eq('mobile', savedMobile).single() : Promise.resolve({ data: null })
      ]);

      if (byUidRes.data) {
        setOrganizerProfile(byUidRes.data);
      } else if (byMobileRes.data) {
        setOrganizerProfile(byMobileRes.data);
      }
    };

    // 1. Auth Listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setCurrentUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setCurrentUser(null);
        setOrganizerProfile(null);
        supabase.auth.signInAnonymously().catch(() => {});
      }
      setIsLoading(false); // Auth ready
    });

    // 2. Initial Data Fetch
    const fetchData = async () => {
      try {
        const [scoreRes, tourneyRes, tickerRes] = await Promise.all([
          supabase.from('live_scores').select('*').eq('status', 'active').maybeSingle(),
          supabase.from('tournaments').select('*').order('created_at', { ascending: false }),
          supabase.from('settings').select('value').eq('key', 'ticker').maybeSingle()
        ]);

        if (scoreRes.data) {
          setLiveScore({
            teamA: scoreRes.data.team_a,
            teamB: scoreRes.data.team_b,
            runs: scoreRes.data.runs,
            wickets: scoreRes.data.wickets,
            overs: scoreRes.data.overs
          });
        }

        if (tourneyRes.data && tourneyRes.data.length > 0) {
          setTournaments(tourneyRes.data);
        }

        if (tickerRes.data) {
          setTicker(tickerRes.data.value);
        }
      } catch (err) {
        console.error("Initial load error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // 3. Real-time Subscriptions
    const scoreChannel = supabase
      .channel('live-scores')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'live_scores' }, payload => {
        const newScore = payload.new;
        setLiveScore({
          teamA: newScore.team_a,
          teamB: newScore.team_b,
          runs: newScore.runs,
          wickets: newScore.wickets,
          overs: newScore.overs
        });
      })
      .subscribe();

    const tourneyChannel = supabase
      .channel('tournaments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournaments' }, () => {
        // Refresh tournaments on any change
        supabase.from('tournaments').select('*').order('created_at', { ascending: false })
          .then(({ data }) => data && setTournaments(data));
      })
      .subscribe();

    return () => {
      authListener.subscription.unsubscribe();
      supabase.removeChannel(scoreChannel);
      supabase.removeChannel(tourneyChannel);
    };
  }, []);

  // Watch for local changes in Demo Mode
  useEffect(() => {
    if (!isSupabaseConfigured && !isLoading) {
      localStorage.setItem('apna_score', JSON.stringify(liveScore));
      localStorage.setItem('apna_tournaments', JSON.stringify(tournaments));
    }
  }, [liveScore, tournaments, isLoading]);

  if (isLoading) {
      return (
          <div className="h-screen w-full flex items-center justify-center bg-zinc-950">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-emerald-500 font-black tracking-widest text-xs uppercase animate-pulse">APNA CRICKET</p>
              </div>
          </div>
      );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Toaster position="bottom-center" />
      
      {/* Dynamic Backgrounds - GPU Accelerated */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] transform-gpu will-change-transform"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-[120px] transform-gpu will-change-transform"></div>
      </div>

      {showConfigError && (window as any)._supabaseError && (
        <div className="fixed inset-0 z-[100] bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 border border-rose-500/50 rounded-3xl max-w-xl w-full p-8 shadow-2xl shadow-rose-500/20"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500">
                <AlertTriangle size={28} />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Configuration Error</h2>
            </div>
            
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 mb-8">
              <p className="text-rose-100 text-sm font-medium leading-relaxed">
                {(window as any)._supabaseError}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-white font-bold text-sm uppercase tracking-widest text-zinc-500">How to Fix:</h3>
              <ol className="space-y-3 text-zinc-400 text-sm">
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-bold text-zinc-200 shrink-0">1</span>
                  <span>Open your **Supabase Dashboard** and go to **Project Settings** {'>'} **API**.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-bold text-zinc-200 shrink-0">2</span>
                  <span>Copy the **anon public** key (it must start with `eyJ`).</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-bold text-zinc-200 shrink-0">3</span>
                  <span>In AI Studio, click the **Settings** (Gear icon) top right.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-bold text-zinc-200 shrink-0">4</span>
                  <span>Go to **Secrets** and update `VITE_SUPABASE_ANON_KEY`.</span>
                </li>
              </ol>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfigError(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl transition-all"
              >
                Try anyway (Demo Mode)
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-600/30"
              >
                Check again
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <AnimatePresence mode="wait">
        {showVision ? (
          <motion.div 
            key="vision" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <VisionPage 
              onBack={() => setShowVision(false)} 
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
            />
          </motion.div>
        ) : activePortal === PortalView.USER ? (
          <motion.div 
            key="user" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <UserApp 
              score={liveScore} 
              tournaments={tournaments} 
              ticker={ticker}
              isDarkMode={isDarkMode} 
              toggleTheme={() => setIsDarkMode(!isDarkMode)} 
              onOrganizerLogin={() => setActivePortal(PortalView.ORGANIZER)}
              onVision={() => setShowVision(true)}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="organizer" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
          >
            <OrganizerDashboard 
              user={currentUser}
              profile={organizerProfile}
              score={liveScore} 
              tournaments={tournaments} 
              isDarkMode={isDarkMode} 
              toggleTheme={() => setIsDarkMode(!isDarkMode)} 
              onExit={() => setActivePortal(PortalView.USER)}
              onUpdateScoreLocal={(s) => setLiveScore(s)}
              onAddTournamentLocal={(t) => setTournaments([t, ...tournaments])}
              onDeleteTournamentLocal={(id) => setTournaments(tournaments.filter(t => t.id !== id))}
              onVision={() => setShowVision(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
