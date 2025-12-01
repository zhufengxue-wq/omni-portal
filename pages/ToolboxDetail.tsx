import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Bot, FileText, Calculator, PenTool, Briefcase, Share2, Radar, BookOpen, Users, Globe, Play, CheckCircle2, Cog } from 'lucide-react';
import { api } from '../services/api';
import { ToolboxItem } from '../types';

// Icon Map
const ICON_MAP: Record<string, React.ElementType> = {
    Bot, FileText, Calculator, PenTool, Briefcase, Share2, 
    Radar, BookOpen, Users, Globe
};

const ToolboxDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<ToolboxItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Simulation State
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [output, setOutput] = useState<string>('');

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getToolboxItemById(id);
        setItem(data || null);
      } catch (e) {
        console.error("Failed to fetch toolbox item", e);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleAction = () => {
      setProcessing(true);
      setComplete(false);
      
      setTimeout(() => {
          setProcessing(false);
          setComplete(true);
          setOutput(`[模拟输出] ${item?.name} 已成功执行任务。生成了 3 个相关文件。`);
      }, 2000);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800">工具未找到</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 hover:underline">返回</button>
      </div>
    );
  }

  const Icon = ICON_MAP[item.iconName] || Briefcase;
  const isTool = item.category === 'tools';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <button 
        onClick={() => navigate('/projects')}
        className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> 返回工具箱
      </button>

      {/* Header Card */}
      <div className={`rounded-3xl p-8 shadow-sm border relative overflow-hidden ${!isTool ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700' : 'bg-white border-slate-100 text-slate-800'}`}>
          <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${!isTool ? 'bg-white/10 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                  <Icon className="w-10 h-10" />
              </div>
              <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                      <div className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${!isTool ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                          {isTool ? 'Efficiency Tool' : 'Think Tank Resource'}
                      </div>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
                  <p className={`text-lg max-w-2xl ${!isTool ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.desc}
                  </p>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Workspace / Feature Area */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-slate-800 flex items-center">
                      <Cog className="w-5 h-5 mr-2 text-slate-400" />
                      {isTool ? '工作台' : '资源预览'}
                  </h3>
                  {isTool && <div className="text-xs text-green-500 font-bold flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> 系统就绪</div>}
              </div>

              {/* Functional Mock Area */}
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50 p-8 text-center">
                   {processing ? (
                       <div className="animate-fade-in">
                           <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                           <p className="text-slate-600 font-medium">正在处理任务...</p>
                           <p className="text-slate-400 text-sm mt-2">AI 正在分析数据并生成结果</p>
                       </div>
                   ) : complete ? (
                       <div className="animate-fade-in">
                           <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                               <CheckCircle2 className="w-8 h-8" />
                           </div>
                           <h4 className="text-xl font-bold text-slate-800 mb-2">任务完成</h4>
                           <p className="text-slate-600 mb-6">{output}</p>
                           <button onClick={() => setComplete(false)} className="text-indigo-600 font-bold hover:underline">
                               开始新任务
                           </button>
                       </div>
                   ) : (
                       <div className="max-w-md">
                           <div className="w-16 h-16 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                               <Icon className="w-8 h-8" />
                           </div>
                           <p className="text-slate-500 mb-6">
                               {isTool 
                                ? "点击下方按钮启动工具。Omni AI 将根据您的预设偏好自动执行任务。" 
                                : "点击查看该智库资源的最新报告与数据。"}
                           </p>
                           <button 
                                onClick={handleAction}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center mx-auto"
                           >
                               {isTool ? (item.actionLabel || "开始运行") : "获取资源"} <Play className="w-4 h-4 ml-2 fill-current" />
                           </button>
                       </div>
                   )}
              </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" /> 
                      功能清单
                  </h3>
                  <div className="space-y-3">
                      {item.features?.map((feature, idx) => (
                          <div key={idx} className="flex items-start p-3 rounded-xl bg-slate-50">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 mr-3 shrink-0"></div>
                              <span className="text-sm font-medium text-slate-700">{feature}</span>
                          </div>
                      ))}
                  </div>
              </div>
              
              <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 mb-2">需要帮助?</h4>
                  <p className="text-xs text-indigo-700 mb-4">
                      如果不确定如何使用此工具，可以联系 Omni 社区的专家获取指导。
                  </p>
                  <button className="w-full py-2 bg-white text-indigo-600 font-bold text-sm rounded-lg shadow-sm border border-indigo-100 hover:bg-indigo-50">
                      联系专家
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ToolboxDetail;