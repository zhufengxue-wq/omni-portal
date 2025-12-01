import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, Zap, Diamond, Palmtree, Menu, X, LayoutGrid, LogOut, GraduationCap, Landmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import OmniChat from './OmniChat';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { logout } = useAuth();

  const navItems = [
    { icon: Sparkles, label: 'Me Special · 个人特质', path: '/' },
    { icon: Zap, label: 'My Talents · 天赋撮合', path: '/projects' },
    { icon: Diamond, label: 'My Wealth · 财富管理', path: '/finance' },
    { icon: GraduationCap, label: 'Fantastic School · 神奇学校', path: '/magic-school' },
    { icon: Palmtree, label: 'Omni Life · 全景生活', path: '/omni-life' },
    { icon: Landmark, label: 'Alliance DAO · 联盟自治', path: '/governance' },
  ];

  const handleLogout = () => {
      if(window.confirm("确定要退出全景世界吗?")) {
          logout();
      }
  };

  return (
    <div className="flex h-screen bg-[#FDFBF7] text-stone-700 overflow-hidden font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Sidebar (Desktop Left) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#FDFBF7] border-r border-stone-100 shadow-[2px_0_20px_-10px_rgba(0,0,0,0.02)] z-20 shrink-0">
        <div className="p-8 flex items-center space-x-3">
            <div className="w-8 h-8 bg-stone-800 rounded-lg flex items-center justify-center shadow-sm">
                <LayoutGrid className="text-[#FDFBF7] w-5 h-5" />
            </div>
          <h1 className="text-xl font-bold text-stone-800 tracking-tight font-serif">
            Omni Portal
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all duration-300 group font-medium text-sm ${
                  isActive
                    ? 'bg-white text-stone-900 shadow-sm border border-stone-100'
                    : 'text-stone-400 hover:bg-white/60 hover:text-stone-600'
                }`
              }
            >
              <item.icon className={`w-4 h-4 mr-3 flex-shrink-0 transition-colors ${ ({isActive}: any) => isActive ? 'text-stone-800' : 'text-stone-300 group-hover:text-stone-500' }`} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-stone-100 mt-auto">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-stone-100 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center space-x-3">
                    <img src="https://picsum.photos/400/400?random=10" alt="Me" className="w-9 h-9 rounded-full border border-stone-100 object-cover grayscale-[0.2]" />
                    <div className="text-sm overflow-hidden">
                        <p className="font-bold text-stone-700 truncate w-24">Luna</p>
                        <p className="text-xs text-stone-400 truncate w-24">生活艺术家</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="text-stone-300 hover:text-stone-500 transition-colors p-1" title="退出登录">
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-[#FDFBF7]/90 backdrop-blur-md z-50 border-b border-stone-100 px-4 py-3 flex items-center justify-between">
         <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-stone-800 rounded-lg flex items-center justify-center">
                <LayoutGrid className="text-[#FDFBF7] w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-stone-800 font-serif">Omni Portal</span>
         </div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg">
             {isMobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#FDFBF7]/98 backdrop-blur-sm z-40 pt-20 px-6 md:hidden animate-fade-in flex flex-col h-screen overflow-y-auto">
            <nav className="space-y-3 flex-1">
            {navItems.map((item) => (
                <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                    `flex items-center px-4 py-4 rounded-xl text-lg font-medium transition-colors ${
                    isActive
                        ? 'bg-white text-stone-900 shadow-sm border border-stone-100'
                        : 'text-stone-400'
                    }`
                }
                >
                <item.icon className="w-6 h-6 mr-4" />
                {item.label}
                </NavLink>
            ))}
            </nav>
            
            <div className="pb-8 border-t border-stone-100 pt-6 mt-6 mb-12">
                <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-4 rounded-xl text-lg font-medium text-stone-400 hover:bg-stone-50 transition-colors"
                >
                    <LogOut className="w-6 h-6 mr-4" />
                    退出登录
                </button>
            </div>
        </div>
      )}

      {/* Center & Right Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 relative">
          
          <div className="flex flex-1 overflow-hidden relative">
              {/* Main Content Area */}
              <main className="flex-1 overflow-y-auto scroll-smooth relative pt-16 md:pt-0">
                <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8">
                    {children}
                </div>
              </main>

              {/* Omni Chat */}
              <OmniChat />
          </div>
      </div>
    </div>
  );
};

export default Layout;