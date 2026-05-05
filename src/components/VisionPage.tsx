import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Globe, Zap, Target, Rocket, Users, Play } from 'lucide-react';

interface VisionPageProps {
  onBack: () => void;
}

const VisionPage: React.FC<VisionPageProps> = ({ onBack }) => {
  const cards = [
    {
      icon: <Zap className="text-amber-400" size={32} />,
      title: "The Vibe",
      desc: "Local cricket isn't just a game; it's an emotion. We're digitizing that raw street energy for the world to see."
    },
    {
      icon: <Target className="text-emerald-400" size={32} />,
      title: "The Goal",
      desc: "Giving every 'Gully' cricketer a global digital identity. Your stats, your glory, worldwide."
    },
    {
      icon: <Rocket className="text-rose-400" size={32} />,
      title: "The Tech",
      desc: "Real-time scoring, instant data, and fan engagement that hits different. No more paper charts."
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-black uppercase tracking-tighter">The Vision</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-12">
        {/* Bio Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 bg-rose-500/10 text-rose-500 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            Meet the Founder
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9]">
            MR. AVINASH <span className="text-rose-600">HUSE</span>
          </h2>
          <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-bold leading-tight max-w-2xl mx-auto">
            "We aren't just scoring matches; we're building a digital bridge from the <span className="text-zinc-900 dark:text-white">Gallies of India</span> to the <span className="text-zinc-900 dark:text-white">Global Stage</span>."
          </p>
        </motion.div>

        {/* Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl"
            >
              <div className="mb-6">{card.icon}</div>
              <h3 className="text-2xl font-black mb-3 italic uppercase tracking-tighter">{card.title}</h3>
              <p className="text-zinc-500 font-medium leading-snug">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Large Feature Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="relative bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[3rem] p-8 md:p-16 overflow-hidden mb-20"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-none italic uppercase">
                Gully to Global <br/> <span className="text-rose-500">Real Quick.</span>
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 dark:bg-zinc-900/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-lg">Hyper-Local Sync</h4>
                    <p className="opacity-60 font-medium">Broadcast local tournaments with professional-grade tech.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 dark:bg-zinc-900/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-lg">Scout Ready</h4>
                    <p className="opacity-60 font-medium">Every player gets a shareable profile. Get noticed by the big leagues.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-zinc-800 dark:bg-zinc-100 rounded-3xl aspect-square flex items-center justify-center relative group cursor-pointer overflow-hidden border border-white/5 dark:border-zinc-900/10">
               <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-rose-500/50 relative z-10"
               >
                 <Play fill="white" size={32} className="ml-1" />
               </motion.div>
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80')] bg-cover opacity-20 group-hover:scale-110 transition-transform duration-700 font-black"></div>
               <p className="absolute bottom-6 left-6 font-black uppercase text-xs tracking-widest opacity-40">Vision Trailer 2026</p>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <div className="text-center pb-20">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 opacity-50">#ApnaCricket #AvinashHuseVision #CricketRevolution</p>
          <div className="h-px w-20 bg-zinc-200 dark:bg-zinc-800 mx-auto"></div>
        </div>
      </main>
    </div>
  );
};

export default VisionPage;
