import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Activity, MapPin, Trash2, Save, X, Plus, ChevronLeft, Sun, Moon,
  Dices
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Score, Tournament } from '../types';
import { Toast } from '../components/Toast';
import { ScoringForm } from '../components/ScoringForm';

interface OrganizerDashboardProps { 
  user: any;
  profile?: any;
  score: Score; 
  tournaments: Tournament[]; 
  isDarkMode: boolean; 
  toggleTheme: () => void; 
  onExit: () => void;
  onVision: () => void;
  // Dynamic Handlers for Mock Mode
  onUpdateScoreLocal?: (score: Score) => void;
  onAddTournamentLocal?: (t: Tournament) => void;
  onDeleteTournamentLocal?: (id: string) => void;
}

const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({ 
  user, profile, score, tournaments, isDarkMode, toggleTheme, onExit, onVision,
  onUpdateScoreLocal, onAddTournamentLocal, onDeleteTournamentLocal
}) => {
  const [toastMsg, setToastMsg] = useState("");
  
  // Filter tournaments to only show user's own content
  // If we have a profile/user, we ONLY show what they created. 
  // We only show defaults if it's a demo/mock session with no real user.
  const myTournaments = tournaments.filter(t => {
    if (isSupabaseConfigured && user) {
        return (t as any).creator_id === user.id;
    }
    return (t as any).id?.startsWith('t'); // Default demo tournaments
  });
  
  // Local state for score updating
  const [newRuns, setNewRuns] = useState<number | string>(score.runs);
  const [newWickets, setNewWickets] = useState<number | string>(score.wickets);
  const [newOvers, setNewOvers] = useState<string>(score.overs);
  
  // Local state for creating a tournament
  const [isCreatingTourney, setIsCreatingTourney] = useState(false);
  const [newTourneyName, setNewTourneyName] = useState("");
  const [newTourneyLoc, setNewTourneyLoc] = useState("");

  // Real-time Scoring State
  const [isAdvancedScoring, setIsAdvancedScoring] = useState(false);
  const [activeMatch, setActiveMatch] = useState<{id: string, over: number, ball: number} | null>(null);

  useEffect(() => {
    setNewRuns(score.runs); 
    setNewWickets(score.wickets); 
    setNewOvers(score.overs);
  }, [score]);

  const handleUpdateScore = async () => {
    const updatedScore = { ...score, runs: Number(newRuns), wickets: Number(newWickets), overs: newOvers };

    if (!isSupabaseConfigured) {
      if (onUpdateScoreLocal) onUpdateScoreLocal(updatedScore);
      setToastMsg("Match stats updated (Demo Mode)! 🔥");
      return;
    }

    try {
      const { error } = await supabase
        .from('live_scores')
        .update({ 
          runs: Number(newRuns), 
          wickets: Number(newWickets), 
          overs: newOvers 
        })
        .eq('status', 'active');
        
      if (error) throw error;
      setToastMsg("Match stats updated! 🔥");
    } catch (e) { 
        console.error(e);
        setToastMsg("Sync failed. Check connection. ⚠️");
    }
  };

  const handleCreateTournament = async () => {
    if (!newTourneyName || !newTourneyLoc) {
      setToastMsg("Please fill all fields! ⚠️");
      return;
    }

    const newT: Tournament = { 
      id: Math.random().toString(36).substr(2, 9),
      name: newTourneyName + (newTourneyName.includes('🏆') ? '' : ' 🏆'), 
      location: newTourneyLoc, 
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), 
      timestamp: new Date().toISOString(),
      startTime: "10:00 AM",
      spots: "16 Slots", 
      status: "open",
      creator_id: user?.id
    } as any;

    if (!isSupabaseConfigured) {
      if (onAddTournamentLocal) onAddTournamentLocal(newT);
      setNewTourneyName(""); setNewTourneyLoc(""); setIsCreatingTourney(false);
      setToastMsg("Tournament added (Demo Mode)! 🚀");
      return;
    }

    try {
      const { error } = await supabase
        .from('tournaments')
        .insert([{ 
          name: newT.name, 
          location: newT.location, 
          date: newT.date, 
          spots: newT.spots, 
          status: newT.status,
          creator_id: user?.id
        }]);
        
      if (error) throw error;
      setNewTourneyName(""); 
      setNewTourneyLoc(""); 
      setIsCreatingTourney(false);
      setToastMsg("Tournament is now LIVE! 🚀");
    } catch (e) { console.error(e); }
  };

  const handleDeleteTournament = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to cancel this event? 🗑️")) return;

    if (!isSupabaseConfigured) {
      if (onDeleteTournamentLocal) onDeleteTournamentLocal(id);
      setToastMsg("Tournament removed (Demo Mode). 🗑️");
      return;
    }

    try {
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      setToastMsg("Tournament removed. 🗑️");
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 pb-20 transition-colors duration-300">
      
      {/* Sticky Header */}
      <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <motion.button 
            whileTap={{ scale: 0.95 }} 
            onClick={onExit} 
            className="flex items-center gap-2 text-sm font-black text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-widest"
          >
            <ChevronLeft size={20} /> Back to Fans View
          </motion.button>
          <div className="flex items-center gap-6">
            <button 
              onClick={onVision}
              className="hidden md:block text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-rose-500 transition-colors"
            >
              The Vision
            </button>
            <div className="flex gap-3">
             <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTheme} className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            <button className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all" onClick={onExit}>Logout</button>
          </div>
        </div>
      </div>
    </header>

      <div className="max-w-5xl mx-auto px-4 mt-12">
        
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-16 px-4">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 p-1 shadow-2xl shadow-emerald-500/30 rotate-3">
            <div className="w-full h-full bg-zinc-900 rounded-[1.25rem] flex items-center justify-center text-4xl font-black text-white uppercase">
                {profile?.name?.substring(0, 2) || (isSupabaseConfigured ? "??" : "CH")}
            </div>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight">
                Welcome back, {profile?.name || (isSupabaseConfigured ? "Organizer" : "Champion")}! 👋
            </h1>
            {profile?.mobile && (
              <p className="text-emerald-500 font-black text-sm mb-4 uppercase tracking-widest bg-emerald-500/10 inline-block px-3 py-1 rounded-lg border border-emerald-500/20">
                Logged in as: +91 {profile.mobile}
              </p>
            )}
            <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg mb-6">Manage your local tournaments and live-streaming scores from this private studio.</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
               <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black px-4 py-2 rounded-xl text-xs border border-emerald-500/20 uppercase tracking-widest">
                {tournaments.length} Active Events
               </div>
               <div className="bg-orange-500/10 text-orange-600 dark:text-orange-400 font-black px-4 py-2 rounded-xl text-xs border border-orange-500/20 uppercase tracking-widest">
                Real-time Sync Active
               </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start px-2">
          
          {/* CONTENT MANAGEMENT */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter">
                <Trophy className="text-emerald-500" size={28}/> My Tournaments
              </h2>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreatingTourney(!isCreatingTourney)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-2xl shadow-xl shadow-emerald-500/30 transition-all"
              >
                {isCreatingTourney ? <X size={24} /> : <Plus size={24} />}
              </motion.button>
            </div>

            <AnimatePresence>
              {isCreatingTourney && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl overflow-hidden shadow-inner"
                >
                  <h3 className="font-black text-zinc-900 dark:text-white mb-5 uppercase text-xs tracking-widest flex items-center gap-2">
                    <Plus size={16} className="text-emerald-500" /> Register Local Event
                  </h3>
                  <div className="space-y-4 mb-6">
                    <input 
                        value={newTourneyName} 
                        onChange={(e)=>setNewTourneyName(e.target.value)} 
                        placeholder="Tournament Name (e.g. Village Cup)" 
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-4 font-bold text-sm outline-none focus:border-emerald-500 transition-colors" 
                    />
                    <input 
                        value={newTourneyLoc} 
                        onChange={(e)=>setNewTourneyLoc(e.target.value)} 
                        placeholder="Ground / Location (e.g. Solapur, MH)" 
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-4 font-bold text-sm outline-none focus:border-emerald-500 transition-colors" 
                    />
                  </div>
                  <button 
                    onClick={handleCreateTournament} 
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-sm"
                  >
                    Go Live on App
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <AnimatePresence>
                {myTournaments.map((t) => (
                  <motion.div 
                    key={t.id} 
                    layout 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }} 
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm flex justify-between items-center group hover:border-emerald-500/30 transition-all"
                  >
                    <div>
                      <h3 className="font-black text-zinc-900 dark:text-white text-lg">{t.name}</h3>
                      <div className="flex items-center gap-4 mt-1.5">
                        <p className="text-xs font-bold text-zinc-500 flex items-center gap-1"><MapPin size={12} className="text-emerald-500"/> {t.location}</p>
                        <p className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">{t.status}</p>
                      </div>
                    </div>
                    <motion.button 
                        whileTap={{ scale: 0.9 }} 
                        onClick={() => handleDeleteTournament(t.id)} 
                        className="bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-4 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {myTournaments.length === 0 && !isCreatingTourney && (
                <div className="text-center py-16 text-zinc-400 font-bold border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] bg-zinc-50 dark:bg-transparent">
                  No active local tournaments. Click + to start one.
                </div>
              )}
            </div>
          </motion.div>

          {/* SCORING BOARD */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-8 sticky top-24">
            <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter">
                <Activity className="text-rose-500" size={28}/> Score Broadcaster
            </h2>
            
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none -mr-20 -mt-20 transform-gpu will-change-transform"></div>
               
               <AnimatePresence mode="wait">
                 {isAdvancedScoring ? (
                   <motion.div 
                     key="advanced"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                   >
                      <ScoringForm 
                        matchId={activeMatch?.id || "demo-match-1"}
                        inning={1}
                        currentOver={activeMatch?.over || 0}
                        currentBall={activeMatch?.ball || 1}
                        onBallSaved={() => {
                          setActiveMatch(prev => {
                            if (!prev) return { id: "demo-match-1", over: 0, ball: 2 };
                            let newBall = prev.ball + 1;
                            let newOver = prev.over;
                            if (newBall > 6) {
                              newBall = 1;
                              newOver += 1;
                            }
                            return { ...prev, over: newOver, ball: newBall };
                          });
                        }}
                        onCancel={() => setIsAdvancedScoring(false)}
                      />
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="simple"
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                   >
                      <div className="flex justify-between items-center mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-5">
                        <p className="text-xs text-zinc-500 font-black uppercase tracking-widest">{score.teamA} <span className="text-zinc-300 dark:text-zinc-700">VS</span> {score.teamB}</p>
                        <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Broadcasting LIVE
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Runs</label>
                          <input 
                              type="number" 
                              value={newRuns} 
                              onChange={(e) => setNewRuns(e.target.value)} 
                              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-2 py-5 font-black text-4xl text-center outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Wickets</label>
                          <input 
                              type="number" 
                              value={newWickets} 
                              onChange={(e) => setNewWickets(e.target.value)} 
                              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-2 py-5 font-black text-4xl text-center outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Overs</label>
                          <input 
                              type="text" 
                              value={newOvers} 
                              onChange={(e) => setNewOvers(e.target.value)} 
                              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-2 py-5 font-black text-2xl text-center outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all" 
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <motion.button 
                        whileTap={{ scale: 0.98 }} 
                        onClick={handleUpdateScore} 
                        className="w-full bg-zinc-950 dark:bg-zinc-800 text-white border-b-4 border-black dark:border-zinc-900 hover:bg-zinc-900 transition-all font-black py-4 rounded-2xl flex justify-center items-center gap-3 uppercase tracking-widest text-xs shadow-xl"
                        >
                          <Save size={18} /> Quick Update
                        </motion.button>
                        
                        <motion.button 
                          whileTap={{ scale: 0.98 }} 
                          onClick={() => setIsAdvancedScoring(true)} 
                          className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-5 rounded-2xl flex justify-center items-center gap-3 uppercase tracking-widest text-sm shadow-xl shadow-rose-600/20"
                        >
                          <Dices size={20} /> Open Ball-by-Ball Scorer
                        </motion.button>
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>
               <p className="mt-5 text-[10px] text-center text-zinc-500 font-bold uppercase tracking-widest opacity-50">Updates appear instantly on apnacricket.co.in fan view</p>
            </div>
          </motion.div>

        </div>
      </div>
      <Toast message={toastMsg} onClose={() => setToastMsg("")} />
    </div>
  );
};

export default OrganizerDashboard;
