import React, { useState, useEffect } from 'react';
import { GraduationCap, Play, BookOpen, Star, Radio, Loader2, Sparkles, Heart, Crown, Clock, Navigation, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { OmniItem } from '../types';

const MagicSchool: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<OmniItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'school' | 'healer' | 'services'>('all');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const data = await api.getOmniLifeItems();
        const magicTypes = ['school', 'healer', 'services'];
        setItems(data.filter(i => magicTypes.includes(i.type)));
      } catch (e) {
        console.error("Failed to load magic school items", e);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter(i => {
      if (activeTab === 'all') return true;
      return i.type === activeTab;
  });

  const featuredCourse = items.find(i => i.id === 902); 

  const getRoleLabel = (type: string) => {
      switch(type) {
          case 'school': return '导师';
          case 'healer': return '疗愈师';
          case 'services': return '主理人';
          default: return '发起人';
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-stone-200 pb-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">Fantastic School</h1>
                    <p className="text-stone-500 text-sm font-medium">Sanctuary for Self-Love and Inner Growth.</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN (60%): Course Grid */}
            <div className="lg:col-span-7 space-y-6">
                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { id: 'all', label: 'All', icon: Sparkles },
                        { id: 'school', label: 'Courses', icon: BookOpen },
                        { id: 'healer', label: 'Healing', icon: Heart },
                        { id: 'services', label: 'Services', icon: Crown },
                    ].map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id as any)}
                            className={`flex items-center whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                                activeTab === cat.id 
                                ? 'bg-stone-800 text-[#FDFBF7] shadow-md' 
                                : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50 hover:text-stone-800'
                            }`}
                        >
                            <cat.icon className="w-3.5 h-3.5 mr-2 opacity-80" />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredItems.map(item => (
                            <div 
                                key={item.id} 
                                onClick={() => navigate(`/omni-item/${item.id}`)}
                                className="bg-white rounded-[2rem] overflow-hidden border border-stone-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-500 group cursor-pointer flex flex-col relative"
                            >
                                {/* Split Cover Layout */}
                                <div className="h-56 flex relative">
                                    <div className="w-[60%] h-full relative overflow-hidden">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.1]" />
                                        {item.isLive ? (
                                            <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center animate-pulse shadow-sm z-10 tracking-wide uppercase">
                                                <Radio className="w-3 h-3 mr-1.5" /> LIVE
                                            </div>
                                        ) : (
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="bg-white/90 backdrop-blur text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm text-stone-800 tracking-wide uppercase">
                                                    {item.tag}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-[40%] h-full relative border-l border-white/20 bg-stone-100">
                                        {item.avatars && item.avatars.length > 0 ? (
                                            <img src={item.avatars[0]} alt="Mentor" className="w-full h-full object-cover grayscale-[0.1]" />
                                        ) : (
                                            <div className="w-full h-full bg-stone-200 flex flex-col items-center justify-center text-stone-400">
                                                <Sparkles className="w-6 h-6 mb-1" />
                                                <span className="text-[10px] uppercase font-bold">Omni</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent flex items-end justify-center pb-4">
                                            <span className="text-[#FDFBF7] text-[10px] font-bold tracking-widest uppercase">
                                                {getRoleLabel(item.type)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-lg text-stone-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                                        {item.rating && (
                                            <div className="flex items-center text-xs font-bold text-amber-500 shrink-0 ml-2 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                                <Star className="w-3 h-3 mr-0.5 fill-current" /> {item.rating}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-stone-500 text-sm mb-4 line-clamp-2">{item.subtitle}</p>
                                    
                                    <div className="mt-auto">
                                        <div className="flex items-center justify-between pt-3 border-t border-stone-50">
                                            <div className="flex flex-col">
                                                <div className="text-sm font-bold text-indigo-600">
                                                    {item.price} <span className="text-xs font-normal text-stone-400">{item.unit}</span>
                                                </div>
                                                {item.date ? (
                                                    <div className="flex items-center text-[10px] text-stone-400 mt-0.5">
                                                        <Clock className="w-3 h-3 mr-1" /> {item.date}
                                                    </div>
                                                ) : (
                                                    <div className="text-[10px] text-stone-400 mt-0.5 flex items-center">
                                                        <Clock className="w-3 h-3 mr-1 text-green-500" /> 随时预约
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {item.dist && (
                                                <div className="text-xs text-stone-400 flex items-center bg-stone-50 px-2 py-1 rounded">
                                                    <Navigation className="w-3 h-3 mr-1" /> {item.dist}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN (40%): Featured & Schedule */}
            <div className="lg:col-span-5 space-y-8">
                {/* Hero Banner */}
                <div className="bg-[#57534E] rounded-[2.5rem] p-8 md:p-10 text-[#FDFBF7] relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                    <div className="relative z-10">
                        <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur rounded-lg text-xs font-bold mb-4 border border-white/10 tracking-widest uppercase text-amber-100">
                            Weekly Focus
                        </span>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 leading-tight text-[#FDFBF7]">
                            重塑你的潜意识代码：<br/>从匮乏到丰盛的 7 步跃迁
                        </h2>
                        <p className="text-stone-300 mb-8 text-sm font-light leading-relaxed">
                            结合神经科学与灵性法则，清理限制性信念，显化你渴望的实相。
                        </p>
                        <button 
                            onClick={() => featuredCourse && navigate(`/omni-item/${featuredCourse.id}`)}
                            className="w-full bg-[#FDFBF7] text-stone-800 px-6 py-3 rounded-xl font-bold hover:bg-white transition-all flex items-center justify-center shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <Play className="w-4 h-4 mr-2 fill-current" /> 开始旅程
                        </button>
                    </div>
                </div>

                {/* My Schedule (Mock) */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-stone-500">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif font-bold text-stone-800 text-lg">My Schedule</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100 opacity-60">
                            <div className="text-center w-10 shrink-0">
                                <div className="text-[10px] font-bold text-stone-400 uppercase">Today</div>
                                <div className="text-xl font-bold text-stone-800">12</div>
                            </div>
                            <div>
                                <h4 className="font-bold text-stone-700 text-sm">Morning Meditation</h4>
                                <p className="text-xs text-stone-400">Completed · 7:00 AM</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-stone-200 shadow-sm border-l-4 border-l-amber-400">
                            <div className="text-center w-10 shrink-0">
                                <div className="text-[10px] font-bold text-stone-400 uppercase">Fri</div>
                                <div className="text-xl font-bold text-stone-800">15</div>
                            </div>
                            <div>
                                <h4 className="font-bold text-stone-800 text-sm">Private Angel Dinner</h4>
                                <p className="text-xs text-stone-500">Upcoming · 19:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default MagicSchool;