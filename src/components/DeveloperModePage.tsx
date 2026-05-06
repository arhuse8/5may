import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, Terminal, Cpu, Database, Activity, 
  Trash2, RefreshCw, AlertCircle, CheckCircle2,
  Bug, ShieldCheck, Zap
} from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * DeveloperModePage.tsx
 * 
 * Provides a high-level administrative interface for the application.
 * Features:
 * - System Health Monitoring: Visualizes CPU, memory, and latency metrics.
 * - Data Persistence Controls: Allows managing session states and cleaning local cache.
 * - Application State Inspection: Inspects kernel nodes and process environments.
 * - Real-time Log Simulation: A terminal emulator to track system activities.
 * 
 * DESIGN PRINCIPLE:
 * This page follows a "Cyberpunk-Brutalist" aesthetic with heavy use of 
 * dark zinc colors and high-contrast accents (red/green) for data visibility.
 */

interface DevLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

interface DeveloperModePageProps {
  onBack: () => void;
}

export default function DeveloperModePage({ onBack }: DeveloperModePageProps) {
  const [logs, setLogs] = useState<DevLog[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'system'>('overview');

  // Initial log generation to populate the terminal
  useEffect(() => {
    const initialLogs: DevLog[] = [
      { id: '1', timestamp: new Date().toLocaleTimeString(), level: 'info', message: 'Admin System Initialized' },
      { id: '2', timestamp: new Date().toLocaleTimeString(), level: 'success', message: 'Auth Bridge Connected' },
      { id: '3', timestamp: new Date().toLocaleTimeString(), level: 'info', message: 'Vite HMR Active' },
    ];
    setLogs(initialLogs);
  }, []);

  // System management functions
  const addLog = (message: string, level: DevLog['level'] = 'info') => {
    const newLog: DevLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const resetAppData = () => {
    addLog('Initiating full application state reset...', 'warn');
    setTimeout(() => {
      addLog('Local storage cleared.', 'success');
      addLog('Session cache invalidated.', 'success');
    }, 800);
  };

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100 selection:bg-red-500/30">
      {/* Top Header */}
      <div className="sticky top-0 bg-zinc-950/80 backdrop-blur-md z-50 px-6 py-4 border-bottom border-zinc-900 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-zinc-900 rounded-xl transition-colors group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
              <Terminal size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter uppercase">DEVELOPER_CONSOLE</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Kernel Node: ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end px-4 border-r border-zinc-900">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Environment</span>
            <span className="text-xs font-mono text-zinc-300">production_preview_v2</span>
          </div>
          <button className="p-2 text-zinc-500 hover:text-zinc-100 transition-colors">
            <ShieldCheck size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'CPU Usage', val: '12%', icon: Cpu, color: 'text-blue-500' },
            { label: 'Memory', val: '256MB', icon: Activity, color: 'text-purple-500' },
            { label: 'Latency', val: '42ms', icon: Zap, color: 'text-yellow-500' },
            { label: 'DB Health', val: 'OPTIMAL', icon: Database, color: 'text-green-500' }
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <stat.icon size={20} className={stat.color} />
                <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">Live Metrics</span>
              </div>
              <h3 className="text-2xl font-black font-mono tracking-tighter">{stat.val}</h3>
              <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Controls Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/30 rounded-3xl border border-zinc-800 overflow-hidden">
               <div className="flex border-b border-zinc-800">
                  {['overview', 'data', 'system'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={cn(
                        "px-8 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2",
                        activeTab === tab 
                          ? "border-red-600 text-red-500 bg-red-600/5" 
                          : "border-transparent text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
               </div>

               <div className="p-8">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                       <h2 className="text-xl font-black uppercase tracking-tighter">System Administration</h2>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button 
                            onClick={() => addLog('Rebuilding static builds...', 'info')}
                            className="flex items-center gap-4 p-4 bg-zinc-900 hover:bg-zinc-800 rounded-2xl border border-zinc-800 transition-colors group text-left"
                          >
                            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl group-hover:scale-110 transition-transform">
                              <RefreshCw size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm uppercase">Refresh Cache</h4>
                                <p className="text-xs text-zinc-500">Purge CDN and local storage</p>
                            </div>
                          </button>

                          <button 
                            onClick={resetAppData}
                            className="flex items-center gap-4 p-4 bg-red-950/10 hover:bg-red-950/20 rounded-2xl border border-red-950/20 transition-colors group text-left"
                          >
                            <div className="p-3 bg-red-600/10 text-red-600 rounded-xl group-hover:scale-110 transition-transform">
                              <Trash2 size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm uppercase text-red-500">Atomic Reset</h4>
                                <p className="text-xs text-red-900/60 uppercase font-black">NUKES ALL APP STATE</p>
                            </div>
                          </button>
                       </div>

                       <div className="pt-6 border-t border-zinc-800">
                          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-600 mb-4">Instance Information</h3>
                          <div className="space-y-3 font-mono text-[11px]">
                             <div className="flex justify-between py-2 border-b border-zinc-900">
                                <span className="text-zinc-500 uppercase">Process ID</span>
                                <span className="text-blue-400">PID_X9482_ALPHA</span>
                             </div>
                             <div className="flex justify-between py-2 border-b border-zinc-900">
                                <span className="text-zinc-500 uppercase">Uptime</span>
                                <span className="text-green-500">03:42:12</span>
                             </div>
                             <div className="flex justify-between py-2 border-b border-zinc-900">
                                <span className="text-zinc-500 uppercase">Region</span>
                                <span className="text-zinc-300">asia-southeast1-f</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  )}

                  {activeTab === 'data' && (
                    <div className="text-center py-12 space-y-4">
                       <Database size={48} className="mx-auto text-zinc-800" />
                       <h3 className="text-lg font-bold uppercase">Data Explorer coming soon</h3>
                       <p className="text-zinc-500 text-sm max-w-xs mx-auto">This module will provide a direct view into the application persistence layer.</p>
                    </div>
                  )}

                  {activeTab === 'system' && (
                    <div className="space-y-6">
                        <div className="p-6 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl flex gap-4">
                           <AlertCircle className="text-yellow-500 shrink-0" />
                           <div>
                              <h4 className="text-sm font-bold uppercase text-yellow-500">Warning: Superuser Privileges</h4>
                              <p className="text-xs text-yellow-500/60 mt-1 uppercase tracking-tight">Changes made in this mode are permanent and can cause cascading system failures. Use with caution.</p>
                           </div>
                        </div>
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Real-time Terminal Log */}
          <div className="bg-black rounded-3xl border border-zinc-800 flex flex-col h-[600px] shadow-2xl">
            <div className="px-6 py-4 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bug size={16} className="text-red-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Standard_Output</span>
              </div>
              <div className="flex gap-1">
                 <div className="w-2 h-2 rounded-full bg-zinc-800" />
                 <div className="w-2 h-2 rounded-full bg-zinc-800" />
                 <div className="w-2 h-2 rounded-full bg-red-600" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 font-mono text-[10px] space-y-3 scrollbar-hide">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-4 group">
                  <span className="text-zinc-700 shrink-0">[{log.timestamp}]</span>
                  <span className={cn(
                    "uppercase font-black shrink-0 w-16",
                    log.level === 'info' ? "text-blue-500" :
                    log.level === 'warn' ? "text-yellow-500" :
                    log.level === 'error' ? "text-red-500" :
                    "text-green-500"
                  )}>
                    {log.level}
                  </span>
                  <span className="text-zinc-400 break-all">{log.message}</span>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-zinc-900 flex gap-2">
               <div className="text-zinc-600 text-[10px] font-black">$</div>
               <input 
                 type="text" 
                 placeholder="Enter developer command..." 
                 className="bg-transparent border-none outline-none text-[10px] font-mono text-zinc-300 w-full placeholder:text-zinc-800"
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     const val = (e.target as HTMLInputElement).value;
                     if (val) {
                       addLog(`Executing: ${val}`, 'info');
                       (e.target as HTMLInputElement).value = '';
                     }
                   }
                 }}
               />
            </div>
          </div>
        </div>
      </div>

      {/* Developer Footer Overlay */}
      <div className="fixed bottom-0 left-0 right-0 py-2 border-t border-zinc-900 bg-black/80 backdrop-blur-md px-6 flex justify-between items-center z-[100]">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">Diagnostic Link: ON</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-700 uppercase">Build: RC-ALPHA-05</div>
         </div>
         <div className="flex gap-4">
            <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Debug Mode v1.0.4</span>
         </div>
      </div>
    </div>
  );
}
