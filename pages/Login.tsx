import React, { useState } from 'react';
import { LayoutGrid, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('Luna');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      login();
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 w-full max-w-md relative z-10 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-6 transform rotate-3">
                <LayoutGrid className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Omni Portal</h1>
            <p className="text-slate-500 text-center">超级个体的全景生活平台</p>
            <p className="text-indigo-600 font-semibold text-sm mt-2 tracking-wide bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                ✨ 神奇联盟 ✨
            </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">账号</label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-slate-800"
                    placeholder="Enter your username"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">密码</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-slate-800"
                    placeholder="••••••••"
                />
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center group"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        进入我的全景世界 <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center text-xs text-slate-400">
             <Sparkles className="w-3 h-3 mr-1 text-indigo-400" /> Powered by Omni Intelligence
        </div>
      </div>
    </div>
  );
};

export default Login;