import React, { useEffect, useState } from 'react';
import { TrendingUp, ShoppingBag, PieChart, ArrowUpRight, CreditCard, Diamond, Loader2, ChevronDown, Briefcase, Trophy } from 'lucide-react';
import { api } from '../services/api';
import { FinanceData } from '../types';
import { useNavigate } from 'react-router-dom';

const ICON_MAP = {
  income: TrendingUp,
  expense: ShoppingBag,
  investment: PieChart
};

const Finance: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await api.getFinanceData();
        setData(result);
      } catch (e) {
        console.error("Failed to fetch finance data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLoadMore = async () => {
      setLoadingMore(true);
      const newTx = await api.loadMoreTransactions();
      if (data) {
          setData(prev => prev ? ({ ...prev, transactions: [...prev.transactions, ...newTx] }) : null);
      }
      setLoadingMore(false);
  };

  if (loading || !data) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-stone-200 pb-6">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center">
                    <Diamond className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">My Wealth</h1>
                    <p className="text-stone-500 text-sm font-medium">Track your assets, passive income, and project equity.</p>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (60%): Project Assets */}
        <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-stone-100">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-stone-500">
                        <Briefcase className="w-4 h-4" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-stone-800">Project Assets & Equity</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                    {data.activeProjects && data.activeProjects.map((project) => (
                        <div 
                            key={project.id} 
                            className="flex items-center p-5 rounded-[1.5rem] bg-[#FAF9F6] border border-stone-100 hover:border-amber-200 transition-colors group cursor-pointer"
                            onClick={() => navigate(`/project/${project.id}`)}
                        >
                            <img 
                                src={project.image} 
                                alt={project.title} 
                                className="w-16 h-16 rounded-2xl object-cover mr-5 shadow-sm grayscale-[0.2] group-hover:grayscale-0 transition-all"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-stone-800 truncate group-hover:text-amber-800 transition-colors text-lg mb-1 font-serif">{project.title}</h4>
                                <p className="text-xs text-stone-500 truncate mb-3 font-light">{project.description}</p>
                                <div className="w-32 bg-stone-200 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-stone-800 h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2 ml-6">
                                <div className="bg-white text-stone-600 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap border border-stone-100 shadow-sm">
                                    Equity {project.userEquity}%
                                </div>
                                <div className="flex items-center text-sm font-bold text-stone-800">
                                    <Trophy className="w-3 h-3 text-amber-500 mr-1.5" />
                                    🪙 {project.totalDividends?.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN (40%): Stats & Transactions */}
        <div className="lg:col-span-5 space-y-6">
            {/* Net Worth - Dark Stone Style */}
            <div className="bg-stone-800 rounded-[2.5rem] p-8 text-[#FDFBF7] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="flex items-center justify-between mb-8 opacity-60 relative z-10">
                    <span className="text-xs font-bold uppercase tracking-widest">Total Net Worth</span>
                    <PieChart className="w-5 h-5" />
                </div>
                <div className="text-4xl font-serif font-bold mb-4 relative z-10">🪙 {data.totalAssets.toLocaleString()}</div>
                <div className="flex items-center text-xs bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm text-stone-200 relative z-10">
                    <ArrowUpRight className="w-3 h-3 mr-1.5 text-green-400" /> +12.5% this month
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-stone-100">
                    <div className="flex items-center gap-2 mb-4 text-stone-400">
                        <TrendingUp className="w-4 h-4 text-green-700" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Passive</span>
                    </div>
                    <div className="text-xl font-serif font-bold text-stone-800">🪙 {data.monthlyPassiveIncome.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-stone-100">
                    <div className="flex items-center gap-2 mb-4 text-stone-400">
                        <CreditCard className="w-4 h-4 text-red-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Expense</span>
                    </div>
                    <div className="text-xl font-serif font-bold text-stone-800">🪙 {data.monthlyExpense.toLocaleString()}</div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-100 flex flex-col">
                <h3 className="text-lg font-serif font-bold text-stone-800 mb-6">Transactions</h3>
                <div className="space-y-4 flex-1">
                    {data.transactions.slice(0, 4).map(t => {
                    const Icon = ICON_MAP[t.type];
                    return (
                        <div key={t.id} className="flex items-center justify-between group py-1">
                            <div className="flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors border ${
                                    t.type === 'income' ? 'bg-green-50 border-green-100 text-green-700' : 
                                    t.type === 'expense' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-stone-50 border-stone-100 text-stone-500'
                                }`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-bold text-stone-700 text-sm mb-0.5">{t.name}</div>
                                    <div className="text-xs text-stone-400 font-mono">{t.date}</div>
                                </div>
                            </div>
                            <div className={`font-bold text-sm font-mono ${
                                t.type === 'income' ? 'text-green-700' : 'text-stone-800'
                            }`}>
                                {t.type === 'income' ? '+' : ''} 🪙 {Math.abs(t.amount).toFixed(0)}
                            </div>
                        </div>
                    );
                    })}
                </div>
                
                <button 
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="w-full mt-6 py-3 text-sm text-stone-500 font-bold bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors flex items-center justify-center shrink-0"
                >
                    {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Load More <ChevronDown className="w-4 h-4 ml-1" /></>}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;