import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, ArrowRight, Zap, PieChart, Users, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Project } from '../types';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getProjectById(id);
        setProject(data || null);
      } catch (e) {
        console.error("Failed to fetch project", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800">项目未找到</h2>
        <button onClick={() => navigate('/projects')} className="mt-4 text-indigo-600 hover:underline">返回</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <button 
        onClick={() => navigate('/projects')}
        className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> 返回列表
      </button>

      <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
        <div className="h-64 md:h-80 relative">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 md:left-10 text-white">
             <div className="flex items-center gap-2 mb-2">
                 <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold border border-white/20">
                    共创项目
                 </span>
                 {project.userEquity && (
                     <span className="px-3 py-1 bg-indigo-500/80 backdrop-blur rounded-full text-xs font-bold border border-white/20">
                        持股 {project.userEquity}%
                     </span>
                 )}
             </div>
             <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
          </div>
        </div>

        <div className="p-6 md:p-10">
           <div className="flex flex-col md:flex-row gap-8">
               <div className="flex-1">
                   <h2 className="text-xl font-bold text-slate-800 mb-4">项目愿景</h2>
                   <p className="text-slate-600 leading-relaxed text-lg mb-8 whitespace-pre-line">
                       {project.description}
                   </p>

                   {/* Roles & Equity Section */}
                   <div className="mb-8">
                       <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                           <Users className="w-5 h-5 mr-2 text-indigo-600" />
                           开放角色 & 权益
                       </h2>
                       {project.detailedRoles && project.detailedRoles.length > 0 ? (
                           <div className="grid grid-cols-1 gap-4">
                               {project.detailedRoles.map((role) => (
                                   <div key={role.id} className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between hover:border-indigo-200 transition-colors">
                                       <div className="mb-3 md:mb-0">
                                           <div className="flex items-center gap-2 mb-1">
                                               <h3 className="font-bold text-slate-800">{role.title}</h3>
                                               {role.isFilled ? (
                                                   <span className="px-2 py-0.5 bg-slate-200 text-slate-500 text-xs rounded-md font-bold">已额满</span>
                                               ) : (
                                                   <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-md font-bold flex items-center">
                                                       <Zap className="w-3 h-3 mr-1" /> 招募中
                                                   </span>
                                               )}
                                           </div>
                                           <div className="flex flex-wrap gap-2">
                                               {role.requiredTalents.map((t, idx) => (
                                                   <span key={idx} className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                                                       {t}
                                                   </span>
                                               ))}
                                           </div>
                                       </div>
                                       
                                       <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                           <div className="flex flex-col items-end">
                                               <span className="text-xs font-bold text-slate-400 uppercase">初始权益</span>
                                               <div className="flex items-center font-bold text-indigo-600 text-lg">
                                                   <PieChart className="w-4 h-4 mr-1.5" />
                                                   {role.equityShare}%
                                               </div>
                                           </div>
                                           <button 
                                               disabled={role.isFilled}
                                               className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                                                   role.isFilled 
                                                   ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                                                   : 'bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-sm'
                                               }`}
                                           >
                                               {role.isFilled ? '已匹配' : '申请角色'}
                                           </button>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       ) : (
                           <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-500">
                               暂无详细角色信息，请查看下方需求概览。
                           </div>
                       )}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                           <div className="text-slate-400 text-xs font-bold uppercase mb-2">募资进度</div>
                           <div className="flex items-end gap-2 mb-2">
                               <span className="text-3xl font-bold text-indigo-600">{project.progress}%</span>
                               <span className="text-sm text-slate-500 mb-1">已完成</span>
                           </div>
                           <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                               <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                           </div>
                       </div>

                       <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                           <div className="text-slate-400 text-xs font-bold uppercase mb-2">需求概览</div>
                           <div className="flex flex-wrap gap-2">
                               {project.rolesNeeded.length > 0 ? (
                                   project.rolesNeeded.map(role => (
                                       <span key={role} className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm text-slate-700 font-medium">
                                           {role}
                                       </span>
                                   ))
                               ) : (
                                   <span className="text-slate-500 text-sm">暂无特定角色需求</span>
                               )}
                           </div>
                       </div>
                   </div>
               </div>

               <div className="md:w-80 space-y-4">
                   <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                       <h3 className="font-bold text-lg mb-4">参与共创</h3>
                       <p className="text-slate-300 text-sm mb-6">加入这个项目，贡献你的天赋，获得相应的代币与股权回报。</p>
                       <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-colors flex items-center justify-center">
                           一键申请 <ArrowRight className="w-4 h-4 ml-2" />
                       </button>
                   </div>
                   
                   {project.totalDividends !== undefined && (
                        <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
                             <h3 className="font-bold text-amber-800 mb-2">你的收益</h3>
                             <div className="text-2xl font-bold text-amber-600">🪙 {project.totalDividends.toLocaleString()}</div>
                             <p className="text-xs text-amber-700 mt-1">历史累计分红</p>
                        </div>
                   )}
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;