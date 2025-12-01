import React, { useEffect, useState } from 'react';
import { Landmark, Vote, Users, FileText, CheckCircle2, AlertCircle, Briefcase, Coins, Tag, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { AllianceTask } from '../types';

const Governance: React.FC = () => {
  const [tasks, setTasks] = useState<AllianceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<number | null>(null);

  useEffect(() => {
      const fetchTasks = async () => {
          try {
              const data = await api.getAllianceTasks();
              setTasks(data);
          } catch(e) {
              console.error(e);
          } finally {
              setLoading(false);
          }
      }
      fetchTasks();
  }, []);

  const handleApply = (id: number) => {
      setClaiming(id);
      setTimeout(() => {
          alert("申请已提交！DAO 委员会将在 24 小时内审核。");
          setClaiming(null);
      }, 1500);
  }

  const proposals = [
      { id: 1, title: 'Omni Yard 静安店扩建提案', status: 'Active', votes: 1240, endsIn: '2 天' },
      { id: 2, title: '2024 Q3 社区分红比例调整', status: 'Passed', votes: 3500, endsIn: '已结束' },
      { id: 3, title: '新增「数字游民」作为核心标签', status: 'Active', votes: 890, endsIn: '5 小时' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-stone-200 pb-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center">
                    <Landmark className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">Alliance DAO</h1>
                    <p className="text-stone-500 text-sm font-medium">Shape the future through Token Governance.</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN (60%): Proposals & Tasks */}
            <div className="lg:col-span-7 space-y-8">
                {/* Proposals List */}
                <div>
                    <h3 className="text-xl font-serif font-bold text-stone-800 mb-6 flex items-center">
                        <FileText className="w-5 h-5 mr-3 text-stone-400" /> Latest Proposals
                    </h3>
                    <div className="space-y-4">
                        {proposals.map(p => (
                            <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-stone-100 hover:border-amber-200 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer">
                                <div className="flex items-start gap-5">
                                    <div className={`mt-2 w-2.5 h-2.5 rounded-full shrink-0 ${p.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-stone-300'}`}></div>
                                    <div>
                                        <h4 className="font-bold text-stone-800 text-lg mb-1 group-hover:text-amber-800 transition-colors">{p.title}</h4>
                                        <div className="flex items-center gap-4 text-xs text-stone-400 font-bold uppercase tracking-wider">
                                            <span className="flex items-center"><Users className="w-3 h-3 mr-1.5" /> {p.votes} Votes</span>
                                            <span className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1.5" /> ID: #{1020 + p.id}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-8 justify-between md:justify-end">
                                    <div className="text-right hidden md:block">
                                        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Status</div>
                                        <div className={`font-bold text-sm ${p.status === 'Active' ? 'text-green-700' : 'text-stone-600'}`}>
                                            {p.status === 'Active' ? `Active · ${p.endsIn}` : 'Passed'}
                                        </div>
                                    </div>
                                    <button className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${p.status === 'Active' ? 'bg-stone-50 text-stone-700 hover:bg-stone-800 hover:text-white' : 'bg-stone-50 text-stone-300 cursor-not-allowed'}`}>
                                        Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alliance Co-creation Tasks */}
                <div className="pt-8 border-t border-stone-200">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-serif font-bold text-stone-800 flex items-center">
                            <Briefcase className="w-5 h-5 mr-3 text-stone-400" /> Bounties & Tasks
                        </h3>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tasks.map(task => (
                                <div 
                                    key={task.id} 
                                    className={`bg-white rounded-[2rem] p-6 border transition-all group flex flex-col h-full relative overflow-hidden ${
                                        task.isMatched 
                                        ? 'border-amber-200 shadow-lg shadow-amber-50 ring-1 ring-amber-100' 
                                        : 'border-stone-100 hover:shadow-lg hover:border-stone-200'
                                    }`}
                                >
                                    {task.isMatched && (
                                        <div className="absolute top-0 right-0 bg-stone-800 text-[#FDFBF7] text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl shadow-sm z-10 flex items-center tracking-wider">
                                            <Sparkles className="w-3 h-3 mr-1.5 text-amber-200" />
                                            MATCHED
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between items-start mb-5">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide border ${
                                            task.type === 'Design' ? 'bg-pink-50 text-pink-800 border-pink-100' :
                                            task.type === 'Dev' ? 'bg-sky-50 text-sky-800 border-sky-100' :
                                            task.type === 'Content' ? 'bg-amber-50 text-amber-800 border-amber-100' : 'bg-stone-50 text-stone-600 border-stone-100'
                                        }`}>
                                            {task.type}
                                        </span>
                                        <div className="flex items-center text-sm font-bold text-stone-700 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-100">
                                            <Coins className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> {task.reward}
                                        </div>
                                    </div>

                                    <h4 className="font-serif font-bold text-stone-800 text-lg mb-3 leading-tight group-hover:text-amber-800 transition-colors">
                                        {task.title}
                                    </h4>
                                    <p className="text-sm text-stone-500 mb-6 line-clamp-3 flex-1 font-light leading-relaxed">
                                        {task.description}
                                    </p>

                                    <div className="mt-auto space-y-5">
                                        <div className="flex flex-wrap gap-2">
                                            {task.requiredSkills.map(skill => (
                                                <span key={skill} className="flex items-center text-[10px] bg-[#FDFBF7] text-stone-500 px-2.5 py-1 rounded-md border border-stone-100 font-medium">
                                                    <Tag className="w-3 h-3 mr-1 opacity-30" /> {skill}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                                            <span className="text-xs text-stone-400 font-bold">
                                                {task.applicants} Applicants
                                            </span>
                                            <button 
                                                onClick={() => handleApply(task.id)}
                                                disabled={claiming === task.id}
                                                className={`text-xs font-bold px-5 py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center ${
                                                    claiming === task.id 
                                                    ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
                                                    : 'bg-stone-800 text-[#FDFBF7] hover:bg-stone-900 shadow-md'
                                                }`}
                                            >
                                                {claiming === task.id ? (
                                                    <>
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> Applying...
                                                    </>
                                                ) : (
                                                    <>
                                                        Claim Task <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN (40%): Stats & Context */}
            <div className="lg:col-span-5 space-y-8">
                {/* Voting Power Card - Dark Stone */}
                <div className="bg-stone-800 rounded-[2.5rem] p-8 text-[#FDFBF7] shadow-xl relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="flex items-center justify-between mb-8 relative z-10 opacity-60">
                        <span className="text-xs font-bold uppercase tracking-widest">My Voting Power</span>
                        <Vote className="w-5 h-5" />
                    </div>
                    <div className="text-4xl font-serif font-bold mb-2 relative z-10">4,250 <span className="text-sm font-sans font-normal text-stone-400">vTokens</span></div>
                    <div className="text-xs text-stone-400 relative z-10 font-light leading-relaxed">Based on your Token holdings & activity score.</div>
                </div>
                
                <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm flex flex-col items-start gap-6">
                    <div>
                        <h3 className="font-serif font-bold text-stone-800 text-xl mb-2">Active Proposals</h3>
                        <p className="text-stone-500 text-sm font-light leading-relaxed">There are currently 2 proposals waiting for your vote.</p>
                    </div>
                    <button className="w-full bg-stone-800 text-[#FDFBF7] px-8 py-4 rounded-xl font-bold hover:bg-stone-900 transition-colors shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                        Vote Now
                    </button>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-start gap-4 text-amber-900/70 text-sm shadow-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                    <p className="leading-relaxed font-light">Governance votes are executed on-chain. Each vote consumes a small amount of Gas. Please ensure sufficient balance in your Omni Wallet.</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Governance;