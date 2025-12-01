import React, { useEffect, useState } from 'react';
import { 
  Sparkles, Gem, Award, PenLine, Save, X, Bot, Heart, Flame, Plus, Layout, Rocket, Loader2, Layers
} from 'lucide-react';
import { getFeelGoodAnalysis } from '../services/geminiService';
import { api } from '../services/api';
import { UserProfile } from '../types';

const ICON_MAP: Record<string, React.ElementType> = {
  Palette: Heart, Cpu: ZapIcon, Activity: Flame, Brain: BrainIcon
};

// Helper icons
function ZapIcon(props: any) { return <Sparkles {...props} /> }
function BrainIcon(props: any) { return <Bot {...props} /> }

const ALLIANCE_ICON_MAP: Record<string, React.ElementType> = {
    School: Rocket,
    Investment: Gem,
    Award: Award,
    Community: Layout
};

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [aiKeywords, setAiKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<'open' | 'busy'>('open');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getUserProfile();
        setProfileData(data);
        setEditForm(data);
        setAiLoading(true);
        const keywords = await getFeelGoodAnalysis(data.intro + " " + data.tags.join(" "));
        setAiKeywords(keywords);
        setAiLoading(false);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  
  const toggleStatus = () => {
      setStatus(prev => prev === 'open' ? 'busy' : 'open');
  };

  const handleSave = async () => {
      if (!editForm) return;
      setLoading(true);
      try {
          const updated = await api.updateUserProfile(editForm);
          setProfileData(updated);
          setIsEditing(false);
          if (updated.intro !== profileData?.intro) {
             setAiLoading(true);
             const keywords = await getFeelGoodAnalysis(updated.intro);
             setAiKeywords(keywords);
             setAiLoading(false);
          }
      } catch(e) {
          console.error("Save failed", e);
      } finally {
          setLoading(false);
      }
  };

  const handleEditChange = (field: keyof UserProfile, value: any) => {
      if (!editForm) return;
      setEditForm({ ...editForm, [field]: value });
  };
  
  const handleTagChange = (index: number, val: string) => {
      if (!editForm) return;
      const newTags = [...editForm.tags];
      newTags[index] = val;
      setEditForm({ ...editForm, tags: newTags });
  };

  const handleAddTag = () => {
      if (!editForm) return;
      setEditForm({ ...editForm, tags: [...editForm.tags, "新标签"] });
  };

  const handleRemoveTag = (index: number) => {
      if (!editForm) return;
      const newTags = editForm.tags.filter((_, i) => i !== index);
      setEditForm({ ...editForm, tags: newTags });
  };

  if (loading || !profileData || !editForm) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-stone-200 pb-6">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">Me Special</h1>
                    <p className="text-stone-500 text-sm font-medium">Your digital mirror and core power.</p>
                </div>
            </div>
        </div>
        
        <div className="flex gap-2">
            {isEditing ? (
                <>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl text-stone-500 hover:bg-stone-100 font-bold text-sm transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-5 py-2 rounded-xl bg-stone-800 text-[#FDFBF7] font-bold text-sm shadow-md hover:bg-stone-900 transition-colors flex items-center">
                        <Save className="w-4 h-4 mr-2" /> Save Changes
                    </button>
                </>
            ) : (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-stone-500 hover:text-stone-800 font-bold text-sm bg-white border border-stone-200 px-4 py-2 rounded-xl shadow-sm transition-all hover:shadow-md"
                >
                    <PenLine className="w-4 h-4" /> Edit Profile
                </button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (60%): Main Content */}
        <div className="lg:col-span-7 space-y-8">
            {/* Intro / Bio */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-stone-100">
                <h3 className="text-xl font-serif font-bold text-stone-800 mb-6">Manifesto</h3>
                {isEditing ? (
                    <textarea 
                        value={editForm.intro} 
                        onChange={(e) => handleEditChange('intro', e.target.value)}
                        className="w-full h-40 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-700 focus:ring-2 focus:ring-stone-200 outline-none resize-none leading-relaxed"
                    />
                ) : (
                    <p className="text-stone-600 text-lg leading-relaxed font-light whitespace-pre-line">
                        {profileData.intro}
                    </p>
                )}
            </div>

            {/* Zone of Genius */}
            {profileData.zoneOfGenius && (
                <div className="bg-[#FAF9F6] rounded-[2.5rem] p-8 md:p-10 border border-stone-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-amber-50 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <h2 className="text-xl font-serif font-bold mb-8 flex items-center text-stone-800 relative z-10">
                        <Sparkles className="w-5 h-5 text-amber-600 mr-2" />
                        Zone of Genius
                    </h2>

                    <div className="space-y-8 relative z-10">
                        <div className="bg-white/60 p-6 rounded-2xl border border-stone-100/50">
                            <div className="flex items-center gap-2 mb-3 text-stone-800 font-bold text-sm uppercase tracking-wide">
                                <Heart className="w-4 h-4 text-rose-400 fill-current" />
                                <span>I Enjoy...</span>
                            </div>
                            <ul className="space-y-3">
                                {profileData.zoneOfGenius.enjoy.map((text, i) => (
                                    <li key={i} className="flex items-start text-sm text-stone-600 font-light leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-300 mt-1.5 mr-3 shrink-0"></div>
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white/60 p-6 rounded-2xl border border-stone-100/50">
                            <div className="flex items-center gap-2 mb-3 text-stone-800 font-bold text-sm uppercase tracking-wide">
                                <Flame className="w-4 h-4 text-amber-500 fill-current" />
                                <span>Effortless...</span>
                            </div>
                            <ul className="space-y-3">
                                {profileData.zoneOfGenius.effortless.map((text, i) => (
                                    <li key={i} className="flex items-start text-sm text-stone-600 font-light leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-300 mt-1.5 mr-3 shrink-0"></div>
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Love & Fun Skills */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-stone-100">
                <h2 className="text-xl font-serif font-bold mb-6 flex items-center text-stone-800">
                    <Heart className="w-5 h-5 text-stone-400 mr-2" />
                    Love & Fun Stack
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.skillStack.map((category, idx) => {
                        const Icon = ICON_MAP[category.iconName] || Layers;
                        return (
                            <div key={idx} className="bg-stone-50 p-5 rounded-2xl border border-stone-100 hover:border-stone-200 transition-colors">
                                <div className="flex items-center mb-3">
                                    <div className={`w-8 h-8 rounded-lg ${category.bg} ${category.color} flex items-center justify-center mr-3`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <h3 className="font-bold text-stone-700 text-sm">{category.category}</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {category.skills.map((skill, sIdx) => (
                                        <span key={sIdx} className="text-xs text-stone-500 bg-white px-2 py-1 rounded-md border border-stone-100">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN (40%): Identity & Stats */}
        <div className="lg:col-span-5 space-y-8">
            {/* Identity Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-stone-100/50"></div>
                <div className="relative z-10">
                    <div className="w-32 h-32 mx-auto rounded-full p-1.5 bg-white shadow-xl shadow-stone-200/50 mb-6">
                        <img 
                            src="https://picsum.photos/400/400?random=10" 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover filter grayscale-[0.1]"
                        />
                    </div>
                    
                    {isEditing ? (
                        <div className="space-y-4 text-left px-4">
                            <input value={editForm.name} onChange={(e) => handleEditChange('name', e.target.value)} className="w-full text-center text-2xl font-serif font-bold border-b border-stone-200 focus:border-stone-800 bg-transparent outline-none pb-2" placeholder="Name" />
                            <input value={editForm.title} onChange={(e) => handleEditChange('title', e.target.value)} className="w-full text-center text-sm font-bold bg-stone-50 text-stone-600 rounded-lg px-3 py-2 border border-stone-100 outline-none" placeholder="Title" />
                            <input value={editForm.location} onChange={(e) => handleEditChange('location', e.target.value)} className="w-full text-center text-xs text-stone-500 border-b border-transparent focus:border-stone-200 bg-transparent outline-none" placeholder="Location" />
                        </div>
                    ) : (
                        <>
                            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">{profileData.name}</h2>
                            <p className="text-stone-500 font-medium text-sm mb-1">{profileData.title}</p>
                            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-6">{profileData.location}</p>
                        </>
                    )}

                    <div className="flex justify-center gap-2 flex-wrap mb-8 px-4">
                        {(isEditing ? editForm.tags : profileData.tags).map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-stone-50 text-stone-600 rounded-lg text-xs font-bold border border-stone-100">
                                #{tag}
                                {isEditing && <button onClick={() => handleRemoveTag(i)} className="ml-2 text-red-400 hover:text-red-600">×</button>}
                            </span>
                        ))}
                        {isEditing && <button onClick={handleAddTag} className="px-3 py-1 bg-stone-100 text-stone-400 rounded-lg text-xs font-bold border border-dashed border-stone-300 hover:bg-stone-200">+</button>}
                    </div>

                    <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 flex items-center justify-between mx-4">
                        <div className="text-left">
                            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Status</div>
                            <div className={`text-xs font-bold flex items-center ${status === 'open' ? 'text-green-700' : 'text-amber-700'}`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${status === 'open' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                {status === 'open' ? 'Open for Co-creation' : 'Deep Work Mode'}
                            </div>
                        </div>
                        <button onClick={toggleStatus} className="text-stone-400 hover:text-stone-800"><Layout className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            {/* AI Core Strengths */}
            <div className="bg-stone-800 rounded-[2.5rem] p-8 shadow-xl text-[#FDFBF7] relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-white/5 w-48 h-48 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <h3 className="text-lg font-serif font-bold mb-6 flex items-center relative z-10 text-amber-100">
                    <Rocket className="w-5 h-5 mr-3" />
                    AI Core Strengths
                </h3>
                
                {aiLoading ? (
                    <div className="h-24 flex items-center justify-center"><Loader2 className="animate-spin text-stone-400 w-6 h-6" /></div>
                ) : (
                    <div className="relative z-10 space-y-4">
                        <p className="text-stone-400 text-sm leading-relaxed font-light">AI has analyzed your bio and projects to identify your unique superpowers:</p>
                        <div className="flex flex-wrap gap-2">
                            {aiKeywords.map((item, i) => (
                                <span key={i} className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-xs font-bold border border-white/10 text-stone-200 shadow-sm tracking-wide">{item}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Alliance Footprint */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-100 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-serif font-bold flex items-center text-stone-800"><Gem className="w-5 h-5 text-stone-400 mr-2" />Omni Alliance</h2>
                    <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-1 rounded-md font-bold uppercase tracking-wider">Verified</span>
                </div>
                <div className="flex-1 space-y-3">
                    {profileData.allianceAchievements.map((item) => {
                        const Icon = ALLIANCE_ICON_MAP[item.iconName] || Award;
                        return (
                            <div key={item.id} className="flex items-start p-4 rounded-2xl bg-[#FDFBF7] border border-stone-100 hover:border-stone-200 transition-colors group">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-600 mr-4 shrink-0 border border-stone-50 group-hover:text-amber-600">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-stone-800 text-sm">{item.title}</h3>
                                        {item.level && <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-800 rounded-md font-bold border border-amber-100">{item.level}</span>}
                                    </div>
                                    <p className="text-xs text-stone-500 mb-1">{item.detail}</p>
                                    <p className="text-[10px] text-stone-400 font-mono">{item.year}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;