import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, ArrowRight, Check, MapPin, Clock, Wallet, Sparkles, Radio, FileText } from 'lucide-react';
import { api } from '../services/api';
import { OmniItem } from '../types';

const OmniItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<OmniItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getOmniItemById(id);
        setItem(data || null);
      } catch (e) {
        console.error("Failed to fetch item", e);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handlePurchase = () => {
    setPurchasing(true);
    // Simulate API Call
    setTimeout(() => {
        setPurchasing(false);
        setPurchaseSuccess(true);
    }, 1500);
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
        <h2 className="text-2xl font-bold text-slate-800">商品未找到</h2>
        <button onClick={() => navigate('/omni-life')} className="mt-4 text-indigo-600 hover:underline">返回</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-12">
      <button 
        onClick={() => navigate('/omni-life')}
        className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> 返回全景生活
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row">
         {/* Left: Visual */}
         <div className="md:w-1/2 h-80 md:h-auto relative">
             <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/10"></div>
             
             <div className="absolute bottom-6 left-6 text-white md:hidden">
                 <span className="px-2 py-1 bg-white/20 backdrop-blur rounded text-xs font-bold border border-white/20 mb-2 inline-block">
                     {item.tag}
                 </span>
                 <h1 className="text-3xl font-bold">{item.title}</h1>
             </div>

             {item.isLive && (
                <div className="absolute top-6 left-6 flex items-center bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
                    <Radio className="w-3 h-3 mr-1" /> LIVE
                </div>
             )}
         </div>

         {/* Right: Content */}
         <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
             <div className="hidden md:block mb-6">
                 <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-3 inline-block">
                     {item.tag}
                 </span>
                 <h1 className="text-4xl font-bold text-slate-900 mb-2">{item.title}</h1>
                 <p className="text-xl text-slate-500">{item.subtitle}</p>
             </div>

             <div className="md:hidden mb-6">
                  <p className="text-lg text-slate-500">{item.subtitle}</p>
             </div>

             <div className="space-y-6 flex-1">
                 {/* Detail Description */}
                 {item.description && (
                     <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                         <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold">
                             <FileText className="w-4 h-4 text-indigo-600" />
                             项目详情
                         </div>
                         <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                             {item.description}
                         </p>
                     </div>
                 )}

                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                     <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                         <Clock className="w-6 h-6" />
                     </div>
                     <div>
                         <div className="text-sm font-bold text-slate-400 uppercase">时间</div>
                         <div className="text-slate-800 font-medium">{item.date ? item.date : '随时预约 / 即刻开始'}</div>
                     </div>
                 </div>

                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                     <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                         {item.dist ? <MapPin className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                     </div>
                     <div>
                         <div className="text-sm font-bold text-slate-400 uppercase">地点</div>
                         <div className="text-slate-800 font-medium">{item.dist ? `距离你 ${item.dist}` : 'Omni Online 全景线上'}</div>
                     </div>
                 </div>

                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                     <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                         <Wallet className="w-6 h-6" />
                     </div>
                     <div>
                         <div className="text-sm font-bold text-slate-400 uppercase">Token 价格</div>
                         <div className="text-2xl font-bold text-slate-900">{item.price} <span className="text-sm text-slate-400 font-normal">{item.unit}</span></div>
                     </div>
                 </div>

                 <div className="border-t border-slate-100 pt-6">
                     <div className="text-sm font-bold text-slate-400 uppercase mb-3">参与者 / 发起人</div>
                     <div className="flex -space-x-3">
                        {item.avatars.map((avatar, i) => (
                            <img key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-sm" src={avatar} alt=""/>
                        ))}
                        <div className="h-10 w-10 rounded-full bg-slate-100 ring-2 ring-white flex items-center justify-center text-xs text-slate-500 font-bold">
                            +12
                        </div>
                     </div>
                 </div>
             </div>

             <div className="mt-8">
                <button 
                    onClick={handlePurchase}
                    disabled={purchasing || purchaseSuccess}
                    className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center ${
                        purchaseSuccess 
                        ? 'bg-green-500 text-white shadow-green-200 scale-105' 
                        : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-95'
                    }`}
                >
                    {purchasing ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin mr-2" /> 处理中...
                        </>
                    ) : purchaseSuccess ? (
                        <>
                            <Check className="w-6 h-6 mr-2" /> 
                            {item.type === 'events' ? '报名成功' : '购买成功'}
                        </>
                    ) : (
                        <>
                            {item.type === 'events' ? '立即报名' : '购买权益'} 
                            <ArrowRight className="w-6 h-6 ml-2" />
                        </>
                    )}
                </button>
                {purchaseSuccess && (
                    <p className="text-center text-green-600 text-sm mt-4 font-bold animate-fade-in">
                        🎉 Token 已自动扣除，凭证已发送至您的账户。
                    </p>
                )}
             </div>
         </div>
      </div>
    </div>
  );
};

export default OmniItemDetail;