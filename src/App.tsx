import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Score, Tournament, PortalView } from './types';

// Modules
import UserApp from './modules/UserApp';
import OrganizerDashboard from './modules/OrganizerDashboard';

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
  
  // Database State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [liveScore, setLiveScore] = useState<Score>(DEFAULT_SCORE);
  const [tournaments, setTournaments] = useState<Tournament[]>(DEFAULT_TOURNAMENTS);
  const [ticker, setTicker] = useState<string>(DEFAULT_TICKER);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Auth & Real-time
  useEffect(() => {
    // Safety timeout to prevent getting stuck on loading screen
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    if (!isSupabaseConfigured) {
      // Demo Mode: Load from LocalStorage
      const savedScore = localStorage.getItem('apna_score');
      const savedTournaments = localStorage.getItem('apna_tournaments');
      if (savedScore) setLiveScore(JSON.parse(savedScore));
      if (savedTournaments) setTournaments(JSON.parse(savedTournaments));
      setIsLoading(false);
      return;
    }

    // 1. Auth Listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setCurrentUser(session.user);
      } else {
        setCurrentUser(null);
        supabase.auth.signInAnonymously();
      }
    });

    // 2. Initial Data Fetch
    const fetchData = async () => {
      try {
        // Fetch Score
        const { data: scoreData } = await supabase
          .from('live_scores')
          .select('*')
          .eq('status', 'active')
          .single();
        if (scoreData) {
          setLiveScore({
            teamA: scoreData.team_a,
            teamB: scoreData.team_b,
            runs: scoreData.runs,
            wickets: scoreData.wickets,
            overs: scoreData.overs
          });
        }

        // Fetch Tournaments
        const { data: tourneyData } = await supabase
          .from('tournaments')
          .select('*')
          .order('created_at', { ascending: false });
        if (tourneyData && tourneyData.length > 0) setTournaments(tourneyData);

        // Fetch Ticker
        const { data: tickerData } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'ticker')
          .single();
        if (tickerData) setTicker(tickerData.value);

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
      <AnimatePresence mode="wait">
        {activePortal === PortalView.USER ? (
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
              score={liveScore} 
              tournaments={tournaments} 
              isDarkMode={isDarkMode} 
              toggleTheme={() => setIsDarkMode(!isDarkMode)} 
              onExit={() => setActivePortal(PortalView.USER)}
              onUpdateScoreLocal={(s) => setLiveScore(s)}
              onAddTournamentLocal={(t) => setTournaments([t, ...tournaments])}
              onDeleteTournamentLocal={(id) => setTournaments(tournaments.filter(t => t.id !== id))}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
