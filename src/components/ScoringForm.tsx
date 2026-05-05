import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Save, AlertCircle, Plus, User, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface ScoringFormProps {
  matchId: string;
  inning: number;
  currentOver: number;
  currentBall: number;
  onBallSaved: () => void;
  onCancel: () => void;
}

export const ScoringForm: React.FC<ScoringFormProps> = ({
  matchId,
  inning,
  currentOver,
  currentBall,
  onBallSaved,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    runs_scored: 0,
    is_extra: false,
    extra_type: '',
    is_wicket: false,
    wicket_type: '',
    batsman_name: '',
    bowler_name: '',
  });

  const handleRunSelect = (runs: number) => {
    setFormData(prev => ({ ...prev, runs_scored: runs }));
  };

  const handleToggleExtra = () => {
    setFormData(prev => ({ 
      ...prev, 
      is_extra: !prev.is_extra,
      extra_type: !prev.is_extra ? 'wide' : '' 
    }));
  };

  const handleToggleWicket = () => {
    setFormData(prev => ({ 
      ...prev, 
      is_wicket: !prev.is_wicket,
      wicket_type: !prev.is_wicket ? 'caught' : '' 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.batsman_name || !formData.bowler_name) {
      toast.error("Please enter batsman and bowler names");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('ball_events').insert([{
        match_id: matchId,
        inning,
        over_num: currentOver,
        ball_num: currentBall,
        ...formData
      }]);

      if (error) throw error;

      toast.success(`Ball ${currentOver}.${currentBall} recorded!`);
      
      // Reset form but keep names for next ball
      setFormData(prev => ({
        ...prev,
        runs_scored: 0,
        is_extra: false,
        extra_type: '',
        is_wicket: false,
        wicket_type: '',
      }));
      
      onBallSaved();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const runOptions = [0, 1, 2, 3, 4, 6];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl"
    >
      <div className="bg-emerald-500 p-6 flex justify-between items-center text-white">
        <div>
          <p className="text-xs font-black uppercase tracking-widest opacity-80">Live Scoring</p>
          <h2 className="text-2xl font-black tracking-tight">Ball {currentOver}.{currentBall}</h2>
        </div>
        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-widest opacity-80">Inning</p>
          <p className="text-xl font-black">{inning}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Batsman & Bowler Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Striker Batsman"
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
              value={formData.batsman_name}
              onChange={e => setFormData({ ...formData, batsman_name: e.target.value })}
              required
            />
          </div>
          <div className="relative">
            <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Current Bowler"
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
              value={formData.bowler_name}
              onChange={e => setFormData({ ...formData, bowler_name: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Run Selector - Big Tactile Buttons */}
        <div>
          <label className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4 block">Runs Scored</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {runOptions.map(run => (
              <button
                key={run}
                type="button"
                onClick={() => handleRunSelect(run)}
                className={`h-14 rounded-2xl font-black text-xl transition-all ${
                  formData.runs_scored === run 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {run}
              </button>
            ))}
          </div>
        </div>

        {/* Special Events Toggles */}
        <div className="flex flex-wrap gap-4">
          {/* Extra Toggle */}
          <div className="flex-1 min-w-[140px]">
             <button
                type="button"
                onClick={handleToggleExtra}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${
                  formData.is_extra 
                  ? 'bg-amber-500/10 border-amber-500 text-amber-600' 
                  : 'bg-zinc-50 dark:bg-zinc-800/50 border-transparent text-zinc-500'
                }`}
              >
                {formData.is_extra ? `Extra: ${formData.extra_type}` : 'Add Extra'}
              </button>
              {formData.is_extra && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-2 scrollbar-none">
                  {['wide', 'no-ball', 'bye', 'leg-bye'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, extra_type: type })}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase truncate ${
                        formData.extra_type === type ? 'bg-amber-500 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
          </div>

          {/* Wicket Toggle */}
          <div className="flex-1 min-w-[140px]">
             <button
                type="button"
                onClick={handleToggleWicket}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${
                  formData.is_wicket 
                  ? 'bg-rose-500/10 border-rose-500 text-rose-600' 
                  : 'bg-zinc-50 dark:bg-zinc-800/50 border-transparent text-zinc-500'
                }`}
              >
                {formData.is_wicket ? `Wicket: ${formData.wicket_type}` : 'Add Wicket'}
              </button>
              {formData.is_wicket && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-2 scrollbar-none">
                  {['bowled', 'caught', 'lbw', 'run-out', 'stumped'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, wicket_type: type })}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase truncate ${
                        formData.wicket_type === type ? 'bg-rose-500 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
           <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 font-black text-zinc-500 uppercase tracking-widest text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
          >
            {loading ? 'Saving...' : (
              <>
                <Save size={18} />
                Record Ball
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
