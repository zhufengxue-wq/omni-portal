
import React, { useState, useEffect } from 'react';
import { Plus, Users, Target, CheckCircle2, ArrowRight, Share2, Zap, Briefcase, FileText, PenTool, Calculator, Bot, Sparkles, Loader2, AlertCircle, Radar, BookOpen, Globe, Layout, Edit3, ArrowUpRight, Search } from 'lucide-react';
import { analyzeProjectNeeds } from '../services/geminiService';
import { api } from '../services/api';
import { Project, ProjectRole, ToolboxItem } from '../types';
import { useNavigate } from 'react-router-dom';

const ICON_MAP: Record<string, React.ElementType> = {
    Bot, FileText, Calculator, PenTool, Briefcase, Share2, 
    Radar, BookOpen, Users, Globe
};

const Projects: React.FC = () => {
  const navigate = useNavigate();
  // View State: 'dashboard' (Split Layout) or 'plaza' (Browse All)
  const [view, setView] = useState<'dashboard' | 'plaza'>('dashboard');
  
  const [projects, setProjects] = useState<Project[]>([]); // Plaza projects
  const [myProjects, setMyProjects] = useState<Project[]>([]); // User initiated
  const [toolboxItems, setToolboxItems] = useState<ToolboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Creation Flow State
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [suggestedRoles, setSuggestedRoles] = useState<ProjectRole[]>([]);
  const [step, setStep] = useState(1);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projData, toolData, myProjData] = await Promise.all([
            api.getProjects(),
            api.getToolboxItems(),
            api.getMyInitiatedProjects()
        ]);
        setProjects(projData);
        setToolboxItems(toolData);
        setMyProjects(myProjData);
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); 

  const handleAnalyze = async () => {
    if (!newProjectDesc) return;
    setAnalyzing(true);
    const roles = await analyzeProjectNeeds(newProjectDesc);
    setSuggestedRoles(roles);
    setAnalyzing(false);
    setStep(2);
  };

  const handleRoleEquityChange = (id: string, val: number) => {
    setSuggestedRoles(roles => roles.map(r => r.id === id ? { ...r, equityShare: val } : r));
  };

  const generateProjectTitle = (desc: string) => {
      if (desc.length < 10) return "新共创项目";
      return desc.substring(0, 8) + (desc.length > 8 ? "..." : "");
  };

  const handlePublish = async () => {
      setPublishing(true);
      const newProjectData: Project = {
          id: Date.now(),
          title: generateProjectTitle(newProjectDesc),
          description: newProjectDesc.length > 120 ? newProjectDesc.substring(0, 120) + "..." : newProjectDesc,
          progress: 0,
          rolesNeeded: suggestedRoles.map(r => r.title),
          detailedRoles: suggestedRoles, 
          image: `https://picsum.photos/400/200?random=${Date.now()}`,
          owner: 'Luna'
      };
      
      await api.createProject(newProjectData);
      // Refresh my projects list
      const updatedMyProjects = await api.getMyInitiatedProjects();
      setMyProjects(updatedMyProjects);
      
      setPublishing(false);
      setStep(1);
      setNewProjectDesc('');
      setSuggestedRoles([]);
      // Stay on dashboard to see the new project
      setView('dashboard');
  };

  const renderToolboxSection = (title: string, items: ToolboxItem[]) => (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
        <div className="flex items-center gap-2 mb-4 text-stone-800">
            <Briefcase className="w-5 h-5 text-stone-400" />
            <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
            {items.map((item) => {
                const Icon = ICON_MAP[item.iconName] || Briefcase;
                return (
                    <div 
                        key={item.id} 
                        onClick={() => navigate(`/toolbox/${item.id}`)}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-100 transition-all cursor-pointer group text-center"
                    >
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm text-stone-500 group-hover:text-amber-600 transition-colors">
                            <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-xs font-bold text-stone-700">{item.name}</h3>
                    </div>
                );
            })}
        </div>
     </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-stone-200 pb-6">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">My Talents</h1>
                    <p className="text-stone-500 text-sm font-medium">Co-create, Crowdfund, and Tokenize your Genius</p>
                </div>
            </div>
        </div>
        
        {view === 'dashboard' ? (
            <button 
                onClick={() => setView('plaza')}
                className="flex items-center gap-2 text-stone-500 hover:text-indigo-600 font-bold text-sm bg-white border border-stone-200 px-4 py-2 rounded-xl shadow-sm transition-all hover:shadow-md"
            >
                View Recruiting Plaza <ArrowRight className="w-4 h-4" />
            </button>
        ) : (
            <button 
                onClick={() => setView('dashboard')}
                className="flex items-center gap-2 text-stone-500 hover:text-stone-800 font-bold text-sm bg-white border border-stone-200 px-4 py-2 rounded-xl shadow-sm transition-all"
            >
                Back to Dashboard
            </button>
        )}
      </div>

      {view === 'dashboard' ? (
          // === DASHBOARD LAYOUT (Split View) ===
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: AI Project Architect (Major Section) */}
              <div className="lg:col-span-7 space-y-8">
                  <div className="bg-stone-800 rounded-[2.5rem] p-8 md:p-10 text-[#FDFBF7] shadow-2xl relative overflow-hidden flex flex-col h-full min-h-[500px]">
                      {/* Decorative Background */}
                      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                      
                      <div className="relative z-10 flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-amber-300">
                              <Bot className="w-6 h-6" />
                          </div>
                          <h2 className="text-2xl font-serif font-bold">AI Project Architect</h2>
                      </div>

                      {step === 1 && (
                          <div className="relative z-10 flex flex-col flex-1">
                              <p className="text-stone-400 mb-6 font-light leading-relaxed">
                                  Describe your vision. The AI will generate a team structure, equity splits, and smart contract parameters for you.
                              </p>
                              
                              <textarea
                                  value={newProjectDesc}
                                  onChange={(e) => setNewProjectDesc(e.target.value)}
                                  placeholder="e.g., I want to build a decentralized news platform for digital nomads in Bali..."
                                  className="w-full flex-1 p-6 rounded-3xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 focus:outline-none resize-none text-stone-200 placeholder-stone-600 text-lg leading-relaxed mb-8 transition-all hover:bg-white/10"
                              />
                              
                              <button
                                  onClick={handleAnalyze}
                                  disabled={!newProjectDesc || analyzing}
                                  className={`w-full py-5 rounded-2xl font-bold text-stone-900 transition-all flex items-center justify-center shadow-lg text-lg ${
                                      analyzing 
                                      ? 'bg-stone-600 cursor-not-allowed text-stone-400' 
                                      : 'bg-gradient-to-r from-amber-200 to-amber-400 hover:to-amber-300 transform hover:-translate-y-1 active:translate-y-0'
                                  }`}
                              >
                                  {analyzing ? (
                                      <>
                                          <Loader2 className="w-5 h-5 animate-spin mr-3" /> Analyzing...
                                      </>
                                  ) : (
                                      <>
                                          Generate Blueprints <Sparkles className="w-5 h-5 ml-2 fill-current" />
                                      </>
                                  )}
                              </button>
                          </div>
                      )}

                      {step === 2 && (
                          <div className="relative z-10 flex flex-col flex-1 animate-fade-in">
                              <div className="flex items-center justify-between mb-6">
                                  <h3 className="text-xl font-bold text-stone-200">Blueprint Generated</h3>
                                  <button onClick={() => setStep(1)} className="text-sm text-stone-400 hover:text-white underline">Edit Vision</button>
                              </div>

                              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-8">
                                  {suggestedRoles.map((role) => (
                                      <div key={role.id} className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between group">
                                          <div>
                                              <h4 className="font-bold text-amber-100 text-lg">{role.title}</h4>
                                              <div className="flex gap-2 mt-2">
                                                  {role.requiredTalents.map(t => (
                                                      <span key={t} className="text-xs bg-white/10 px-2 py-1 rounded text-stone-300">{t}</span>
                                                  ))}
                                              </div>
                                          </div>
                                          <div className="flex flex-col items-end">
                                              <span className="text-[10px] uppercase text-stone-500 font-bold tracking-wider">Equity</span>
                                              <div className="flex items-center gap-3">
                                                  <span className="text-2xl font-serif font-bold text-white">{role.equityShare}%</span>
                                                  <input 
                                                      type="range" 
                                                      min="1" 
                                                      max="50" 
                                                      value={role.equityShare}
                                                      onChange={(e) => handleRoleEquityChange(role.id, parseInt(e.target.value))}
                                                      className="w-24 accent-amber-400 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                                  />
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                              </div>

                              <button 
                                  onClick={handlePublish}
                                  disabled={publishing}
                                  className="w-full py-5 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center transition-all disabled:bg-stone-600 disabled:text-stone-400"
                              >
                                  {publishing ? (
                                      <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Minting Project...</>
                                  ) : (
                                      <>Launch Project to Plaza <ArrowUpRight className="w-5 h-5 ml-2" /></>
                                  )}
                              </button>
                          </div>
                      )}
                  </div>
              </div>

              {/* Right Column: My Projects (Secondary Section) */}
              <div className="lg:col-span-5 space-y-8">
                  {/* Header for List */}
                  <div className="flex items-center justify-between px-2">
                      <h2 className="text-xl font-bold text-stone-800 flex items-center">
                          My Projects
                          <span className="ml-3 bg-stone-200 text-stone-600 text-xs px-2 py-0.5 rounded-full">{myProjects.length}</span>
                      </h2>
                  </div>

                  {loading ? (
                      <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-stone-300" /></div>
                  ) : myProjects.length > 0 ? (
                      <div className="space-y-4">
                          {myProjects.map(p => (
                              <div key={p.id} onClick={() => navigate(`/project/${p.id}`)} className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 hover:shadow-lg hover:border-amber-200 transition-all cursor-pointer group relative overflow-hidden">
                                  {/* Left accent bar */}
                                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-stone-200 group-hover:bg-amber-400 transition-colors"></div>
                                  
                                  <div className="flex justify-between items-start mb-3 pl-2">
                                      <h3 className="font-bold text-lg text-stone-800 group-hover:text-amber-800 transition-colors">{p.title}</h3>
                                      <span className="text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">
                                          Active
                                      </span>
                                  </div>
                                  
                                  <p className="text-sm text-stone-500 mb-6 pl-2 line-clamp-2">{p.description}</p>
                                  
                                  <div className="pl-2">
                                      <div className="flex justify-between text-xs font-bold text-stone-400 mb-2">
                                          <span>Raised: 🪙 2,500</span>
                                          <span>Goal: 5,000</span>
                                      </div>
                                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mb-4">
                                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${p.progress}%` }}></div>
                                      </div>
                                      
                                      <div className="flex items-center justify-between border-t border-stone-50 pt-4">
                                          <div className="flex -space-x-2">
                                              <img className="w-7 h-7 rounded-full border-2 border-white" src="https://picsum.photos/100/100?random=1" alt=""/>
                                              <img className="w-7 h-7 rounded-full border-2 border-white" src="https://picsum.photos/100/100?random=2" alt=""/>
                                              <div className="w-7 h-7 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-500">+3</div>
                                          </div>
                                          <span className="text-sm font-bold text-indigo-600 flex items-center group-hover:underline decoration-2 underline-offset-4">
                                              Manage <ArrowRight className="w-3 h-3 ml-1" />
                                          </span>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="bg-stone-50 rounded-3xl p-10 text-center border border-dashed border-stone-200">
                          <Layout className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                          <p className="text-stone-500 font-medium">No projects yet.</p>
                          <p className="text-sm text-stone-400">Use the AI Architect on the left to start one.</p>
                      </div>
                  )}

                  {/* Secondary: Toolbox */}
                  <div className="pt-4">
                      {renderToolboxSection("Efficiency Toolbox", toolboxItems.filter(i => i.category === 'tools').slice(0, 4))}
                  </div>
              </div>
          </div>
      ) : (
          // === PLAZA LAYOUT (Browse All) ===
          <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
                  <Search className="w-5 h-5 text-stone-400 ml-2" />
                  <input 
                      type="text" 
                      placeholder="Search for projects, roles, or keywords..." 
                      className="flex-1 bg-transparent outline-none text-stone-700 font-medium"
                  />
                  <div className="flex gap-2">
                      <select className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 font-bold outline-none">
                          <option>All Categories</option>
                          <option>Web3</option>
                          <option>AI</option>
                          <option>Design</option>
                      </select>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map(p => (
                      <div 
                          key={p.id} 
                          className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-stone-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-500 group cursor-pointer"
                          onClick={() => navigate(`/project/${p.id}`)}
                      >
                          <div className="h-48 overflow-hidden relative">
                              <div className="absolute inset-0 bg-stone-900/10 z-10 group-hover:bg-transparent transition-colors"></div>
                              <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.1]" />
                              
                              {p.isRecommended && (
                                  <div className="absolute top-3 left-3 z-20 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-[10px] font-bold flex items-center shadow-sm border border-amber-200">
                                      <Sparkles className="w-3 h-3 mr-1 fill-current" /> Recommended
                                  </div>
                              )}
                              <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-stone-800">
                                  {p.progress}% Funded
                              </div>
                          </div>
                          <div className="p-6">
                              <h3 className="font-serif font-bold text-xl text-stone-900 mb-2 group-hover:text-amber-800 transition-colors">{p.title}</h3>
                              <p className="text-stone-500 text-sm mb-4 line-clamp-2 leading-relaxed">{p.description}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-6">
                                  {p.rolesNeeded.map(role => (
                                      <span key={role} className="px-2 py-1 bg-stone-50 text-stone-500 text-[10px] rounded border border-stone-100 font-medium">
                                          {role}
                                      </span>
                                  ))}
                              </div>
                              
                              <div className="flex items-center text-sm font-bold text-stone-800 border-t border-stone-50 pt-4">
                                  View Details <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default Projects;
