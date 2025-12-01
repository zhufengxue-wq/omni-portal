import React, { useState, useEffect } from 'react';
import { Palmtree, MapPin, Star, Calendar, Clock, ShoppingBag, Coffee, Sparkles, Navigation, Loader2, Plane, TrendingUp, Building2, Lock, Signal, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { OmniItem } from '../types';
import { useNavigate } from 'react-router-dom';

const OmniLife: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'goods' | 'places' | 'events' | 'travel' | 'investment' | 'rwa'>('all');
  const [items, setItems] = useState<OmniItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const data = await api.getOmniLifeItems();
        setItems(data);
      } catch (e) {
        console.error("Failed to load omni items", e);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const lifeTypes = ['goods', 'places', 'events', 'travel', 'investment', 'rwa'];
  
  const filteredItems = items.filter(i => {
      if (!lifeTypes.includes(i.type)) return false;
      if (activeTab === 'all') return true;
      return i.type === activeTab;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-stone-200 pb-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-800">
                    <Palmtree className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">Omni Life</h1>
                    <p className="text-stone-500 text-sm font-medium">Using Wealth to Nourish Life.</p>
                </div>
           </div>
        </div>
        
        <div className="flex items-center space-x-2 text-xs bg-white px-4 py-2 rounded-xl shadow-sm border border-stone-200 text-stone-600 font-bold">
           <MapPin className="w-3 h-3 text-stone-400" />
           <span className="tracking-wide">SHANGHAI · CN</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN (60%): Feed */}
          <div className="lg:col-span-7 space-y-6">
              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { id: 'all', label: 'All', icon: Sparkles },
                    { id: 'rwa', label: 'RWA Assets', icon: Building2 }, 
                    { id: 'goods', label: 'Inspo Goods', icon: ShoppingBag },
                    { id: 'places', label: 'Energy Hubs', icon: Coffee },
                    { id: 'events', label: 'Events', icon: Calendar },
                    { id: 'travel', label: 'Travel', icon: Plane },
                    { id: 'investment', label: 'Investment', icon: TrendingUp },
                ].map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id as any)}
                        className={`flex items-center whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
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
                            {/* Token Gating Overlay */}
                            {item.tokenGate && (
                                <div className="absolute top-0 left-0 w-full z-30 bg-stone-900/90 text-[#FDFBF7] text-xs font-bold py-2 px-4 flex items-center justify-center backdrop-blur-md">
                                    <Lock className="w-3 h-3 mr-2 text-amber-400" />
                                    {item.tokenGate}
                                </div>
                            )}

                            {/* Split Cover Layout */}
                            <div className="h-56 flex relative">
                                {/* 60% Project Image */}
                                <div className="w-3/5 h-full relative overflow-hidden">
                                    <div className="absolute inset-0 bg-stone-900/5 z-10 group-hover:bg-transparent transition-colors"></div>
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.1]" />
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className={`backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm tracking-wide uppercase ${
                                            item.type === 'rwa' 
                                            ? 'bg-amber-100/90 text-amber-900 border border-amber-200' 
                                            : 'bg-white/90 text-stone-800 border border-white/50'
                                        }`}>
                                            {item.tag}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* 40% Member/Initiator Image */}
                                <div className="w-2/5 h-full relative border-l border-white/20 bg-stone-100">
                                    {item.avatars[0] ? (
                                        <img src={item.avatars[0]} alt="Initiator" className="w-full h-full object-cover grayscale-[0.2]" />
                                    ) : (
                                        <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                                            <Sparkles className="text-stone-300" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent flex items-end justify-center pb-4">
                                        <span className="text-[#FDFBF7] text-[10px] font-bold tracking-widest uppercase">
                                            Initiator
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-stone-800 line-clamp-1 group-hover:text-amber-800 transition-colors font-serif">{item.title}</h3>
                                    {item.rating && (
                                        <div className="flex items-center text-xs font-bold text-stone-400 shrink-0 ml-2 bg-stone-50 px-2 py-1 rounded-md border border-stone-100">
                                            <Star className="w-3 h-3 mr-1 fill-current text-amber-400" /> {item.rating}
                                        </div>
                                    )}
                                </div>
                                <p className="text-stone-500 text-sm mb-6 line-clamp-2 leading-relaxed font-light">{item.subtitle}</p>
                                
                                {/* RWA Specific Stats */}
                                {item.type === 'rwa' && item.apy && (
                                    <div className="mb-6 flex gap-2">
                                        <div className="bg-green-50 text-green-800 px-3 py-2 rounded-xl text-xs font-bold flex flex-col border border-green-100">
                                            <span className="text-[10px] uppercase text-green-600/70 mb-0.5">Yield (APY)</span>
                                            {item.apy}
                                        </div>
                                        <div className="bg-stone-50 text-stone-600 px-3 py-2 rounded-xl text-xs font-bold flex flex-col border border-stone-100">
                                            <span className="text-[10px] uppercase text-stone-400 mb-0.5">Benefits</span>
                                            Free Stay
                                        </div>
                                    </div>
                                )}

                                <div className="mt-auto">
                                    <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                                        <div className="flex flex-col">
                                            <div className="text-base font-bold text-stone-800">
                                                {item.price} <span className="text-xs font-normal text-stone-400">{item.unit}</span>
                                            </div>
                                            {item.date && (
                                                <div className="flex items-center text-[10px] text-stone-400 mt-1 uppercase tracking-wide font-medium">
                                                    <Clock className="w-3 h-3 mr-1" /> {item.date}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {item.dist && (
                                            <div className="text-xs text-stone-500 font-bold flex items-center bg-stone-50 px-2 py-1 rounded-lg border border-stone-100">
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

          {/* RIGHT COLUMN (40%): Radar & Featured */}
          <div className="lg:col-span-5 space-y-8">
              {/* High-Vibe Radar Section */}
              <div className="bg-stone-800 text-[#FDFBF7] rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden flex flex-col justify-between gap-6">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                  
                  <div className="flex items-center gap-5 z-10">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center animate-pulse">
                          <Signal className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                          <h3 className="font-serif font-bold text-xl flex items-center mb-1">
                              High-Vibe Radar
                              <span className="ml-3 text-[10px] bg-green-500 text-stone-900 px-2 py-0.5 rounded-full font-sans font-bold tracking-wide">LIVE</span>
                          </h3>
                          <p className="text-stone-400 text-sm font-light">
                              Nearby: <span className="text-white font-bold">5</span> Members & <span className="text-white font-bold">2</span> Events (3km)
                          </p>
                      </div>
                  </div>

                  <div className="flex items-center justify-between z-10 pt-4 border-t border-white/10">
                      <div className="flex -space-x-3">
                          {[320, 321, 322].map((id) => (
                              <img key={id} className="w-10 h-10 rounded-full border-2 border-stone-800 object-cover" src={`https://picsum.photos/100/100?random=${id}`} alt="Member" />
                          ))}
                          <div className="w-10 h-10 rounded-full border-2 border-stone-800 bg-stone-700 flex items-center justify-center text-xs font-bold">+2</div>
                      </div>
                      <button className="bg-[#FDFBF7] text-stone-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white transition-colors shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                          Check-in
                      </button>
                  </div>
              </div>

              {/* Feature: Join RWA */}
              <div className="bg-amber-100/50 border border-amber-200 rounded-[2.5rem] p-8 text-amber-900 relative overflow-hidden">
                  <h3 className="font-serif font-bold text-xl mb-3">Become a Co-Owner</h3>
                  <p className="text-sm text-amber-800/80 mb-6 leading-relaxed">
                      Invest in global co-living hubs. Own a piece of Bali or Lisbon and earn 8-12% APY while enjoying free stays.
                  </p>
                  <button className="w-full py-4 bg-amber-900 text-[#FDFBF7] rounded-xl font-bold text-sm shadow-md hover:bg-amber-950 transition-colors flex items-center justify-center">
                      Explore RWA Assets <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default OmniLife;