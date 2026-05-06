import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, MessageCircle, Mail, Phone, HelpCircle, Book, Shield, MessageSquare, ExternalLink, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface HelpPageProps {
  onBack: () => void;
}

const HelpPage: React.FC<HelpPageProps> = ({ onBack }) => {
  const faqs = [
    { q: "How to register as an organizer?", a: "Click on 'Host Match' on the home screen and follow the 'New Organizer' path in the portal modal." },
    { q: "Is the live scoring free?", a: "Yes! Currently, Apna Cricket is free for all local gully and village matches to promote rural talent." },
    { q: "How to update player stats?", a: "Stats are automatically updated when a registered organizer completes a match scoring." },
    { q: "Can I manage multiple tournaments?", a: "Absolutely. Your organizer dashboard allows you to manage all your events in one place." },
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
          <h1 className="text-sm font-black uppercase tracking-tighter">Support Center</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        {/* Support Hero */}
        <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-red-600/10 rounded-[2rem] flex items-center justify-center mx-auto text-red-600 mb-8 border border-red-600/20">
                <HelpCircle size={40} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                How can we <span className="text-red-600">Help?</span>
            </h2>
            <p className="text-zinc-500 font-medium max-w-xl mx-auto">Welcome to the Apna Cricket support hub. Find guides, talk to our team, or explore FAQs.</p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { icon: <MessageCircle size={24} />, title: "WhatsApp Us", desc: "Fastest response time", color: "text-emerald-500", action: "Chat Now" },
                { icon: <Mail size={24} />, title: "Email Support", desc: "For technical issues", color: "text-blue-500", action: "Send Email" },
                { icon: <Phone size={24} />, title: "Call Helpline", desc: "Available 10AM - 6PM", color: "text-rose-500", action: "Call Us" },
            ].map((c, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm text-center flex flex-col items-center">
                    <div className={cn("mb-6 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl", c.color)}>
                        {c.icon}
                    </div>
                    <h3 className="font-black text-lg uppercase tracking-tight">{c.title}</h3>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1 mb-6">{c.desc}</p>
                    <button className="mt-auto w-full py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform">
                        {c.action}
                    </button>
                </div>
            ))}
        </div>

        {/* FAQs */}
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Book className="text-red-600" size={24} />
                <h3 className="text-2xl font-black uppercase tracking-tight italic">Frequently Asked Questions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqs.map((f, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm"
                    >
                        <h4 className="font-black text-sm mb-4 leading-tight">{f.q}</h4>
                        <p className="text-sm font-medium text-zinc-500 leading-relaxed">{f.a}</p>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Documentation Section */}
        <div className="bg-zinc-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-4 text-center md:text-left">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">Organizer's Guide 📚</h3>
                    <p className="text-zinc-400 font-medium max-w-sm">Learn how to set up your first tournament and master the live scoring system in 5 minutes.</p>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-white text-zinc-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-500 hover:text-white transition-all shadow-xl">
                    View Guide <ExternalLink size={18} />
                </button>
            </div>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 pt-8 border-t border-zinc-100 dark:border-zinc-800">
            {[
                { icon: <Shield size={16} />, label: "Terms of Service" },
                { icon: <Zap size={16} />, label: "Privacy Policy" },
                { icon: <MessageSquare size={16} />, label: "Feedback" },
            ].map((l, i) => (
                <button key={i} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors">
                    {l.icon}
                    <span>{l.label}</span>
                </button>
            ))}
        </div>
      </main>
    </div>
  );
};

export default HelpPage;
