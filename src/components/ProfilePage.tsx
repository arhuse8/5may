import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Camera, Shield, Star, Medal, MapPin, Phone, Mail, User, Edit3, Save, Trophy, TrendingUp, Plus, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProfilePageProps {
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Avinash Huse",
    phone: "+91 98765 43210",
    email: "avinash@apnacricket.com",
    password: "••••••••",
    role: "All Rounder",
    location: "Solapur, MH",
    bio: "Passionate about local cricket and building the future of the game.",
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const stats = [
    { label: "Matches", val: "42" },
    { label: "Total Runs", val: "1,240" },
    { label: "Wickets", val: "18" },
    { label: "Avg", val: "34.5" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Dynamic Header with Backdrop */}
      <div className="h-48 md:h-64 bg-zinc-900 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-zinc-950 to-transparent"></div>
        
        <div className="max-w-5xl mx-auto px-4 py-6 relative z-10">
          <button 
            onClick={onBack}
            className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 -mt-20 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Identity Card */}
              <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl text-center relative overflow-hidden">
              <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-40">
                <div className="w-5 h-5 bg-zinc-950 dark:bg-white rounded flex items-center justify-center">
                  <span className="text-[8px] font-black text-white dark:text-zinc-950 italic">G</span>
                </div>
                <span className="text-[8px] font-black tracking-widest uppercase">GNZ</span>
              </div>
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-tr from-red-600 to-red-800 p-1">
                  <div className="w-full h-full rounded-[1.8rem] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-4xl overflow-hidden border-4 border-white dark:border-zinc-900 shadow-xl">
                    AH
                  </div>
                </div>
                <button className="absolute -bottom-2 -right-2 p-3 bg-red-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform">
                  <Camera size={20} />
                </button>
              </div>

              {isEditing ? (
                <input 
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-zinc-100 dark:bg-zinc-800 border-2 border-red-600/20 rounded-2xl px-4 py-2 text-xl font-black italic uppercase tracking-tighter w-full text-center outline-none focus:border-red-600 transition-colors"
                />
              ) : (
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">{profileData.name}</h2>
              )}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-2 mb-6">
                Player ID: #PC2026_AH
              </div>

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-4 text-sm text-zinc-500 font-bold bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-2xl">
                    <MapPin size={18} className="text-red-600 shrink-0" />
                    <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-zinc-500 font-bold bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-2xl">
                    <Shield size={18} className="text-red-600 shrink-0" />
                    <span>{profileData.role}</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 shadow-2xl shadow-red-900/40 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Host Experience</h3>
                        <Zap className="text-yellow-500 animate-pulse" size={20} />
                    </div>
                    <p className="text-sm font-bold text-zinc-300 mb-6 leading-relaxed">Want to organize your own local village tournament? Launch it now via GNZ Engine.</p>
                    <button className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-red-600/20 group-hover:scale-[1.02]">
                        <Plus size={20} />
                        <span className="uppercase tracking-widest text-xs">Create Tournament</span>
                    </button>
                </div>
            </div>

            <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Achievements</h3>
                    <Trophy className="text-red-500" size={20} />
                </div>
                <div className="space-y-4">
                    {[
                        { icon: <Star size={16} />, label: "Orange Cap 2025", desc: "Highest run-getter" },
                        { icon: <Medal size={16} />, label: "Golden Arm", desc: "Best bowling spell" },
                    ].map((a, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl group cursor-pointer hover:bg-white/10 transition-colors">
                            <div className="text-red-500 mt-1">{a.icon}</div>
                            <div>
                                <p className="font-black text-sm">{a.label}</p>
                                <p className="text-[10px] text-zinc-500 font-bold">{a.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Right: Detailed Info & Stats */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black uppercase tracking-tight italic">Performance Dashboard</h3>
                    <TrendingUp className="text-red-600" size={24} />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center p-6 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl border border-zinc-100 dark:border-zinc-800/50">
                            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1">{s.label}</p>
                            <p className="text-3xl font-black italic">{s.val}</p>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h4 className="font-black text-sm uppercase tracking-widest text-red-600">Bio & Contact</h4>
                        <button 
                          onClick={() => setIsEditing(!isEditing)}
                          className={cn(
                            "flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            isEditing ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600"
                          )}
                        >
                            {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                            {isEditing ? "Save Changes" : "Edit Profile"}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-2">Phone Number</label>
                            <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                <Phone size={18} className="text-zinc-500" />
                                {isEditing ? (
                                    <input 
                                        value={profileData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="bg-transparent font-bold text-sm tracking-wide w-full outline-none"
                                    />
                                ) : (
                                    <span className="font-bold text-sm tracking-wide">{profileData.phone}</span>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-2">Official Email (Optional)</label>
                            <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                <Mail size={18} className="text-zinc-500" />
                                {isEditing ? (
                                    <input 
                                        value={profileData.email}
                                        placeholder="Add email..."
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="bg-transparent font-bold text-sm w-full outline-none"
                                    />
                                ) : (
                                    <span className="font-bold text-sm">{profileData.email || "Not specified"}</span>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-2">Account Password</label>
                            <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                <Shield size={18} className="text-zinc-500" />
                                {isEditing ? (
                                    <input 
                                        type="password"
                                        value={profileData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className="bg-transparent font-bold text-sm w-full outline-none"
                                    />
                                ) : (
                                    <span className="font-bold text-sm tracking-widest">••••••••</span>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-2">Home Location</label>
                            <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                <MapPin size={18} className="text-zinc-500" />
                                {isEditing ? (
                                    <input 
                                        value={profileData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        className="bg-transparent font-bold text-sm w-full outline-none"
                                    />
                                ) : (
                                    <span className="font-bold text-sm">{profileData.location}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-2">Career Biography</label>
                        <div className={cn(
                            "bg-zinc-50 dark:bg-zinc-950 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 min-h-[120px]",
                            isEditing && "border-red-600/20 ring-1 ring-red-600/10"
                        )}>
                            {isEditing ? (
                                <textarea 
                                    value={profileData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    className="bg-transparent font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm w-full h-full min-h-[100px] outline-none resize-none"
                                />
                            ) : (
                                <p className="font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm">
                                    {profileData.bio}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-sm">
                    <h4 className="font-black text-sm uppercase tracking-widest mb-6">Recent Form</h4>
                    <div className="space-y-4">
                        {['56(32)', '24(12)', '0(1)', '88*(45)'].map((score, i) => (
                            <div key={i} className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl">
                                <span className="text-xs font-bold text-zinc-500">Match {42-i}</span>
                                <span className="font-black text-sm">{i === 3 ? <span className="text-red-600">{score}</span> : score}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center text-red-600 mb-4">
                        <Star size={32} />
                    </div>
                    <h4 className="font-black text-sm uppercase tracking-widest mb-2">Verified Scout</h4>
                    <p className="text-xs text-zinc-500 font-medium px-4">Your stats are verified by recognized local organizers.</p>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
