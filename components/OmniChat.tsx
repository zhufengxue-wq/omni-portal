import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageSquare, ChevronRight, ChevronLeft, Sparkles, Loader2, Minimize2 } from 'lucide-react';
import { chatWithOmni } from '../services/geminiService';

const OmniChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
      { role: 'model', text: '你好！我是 Omni Mate。无论你想寻找共创灵感，还是查询账户资产，我都在这里。' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!input.trim() || loading) return;

      const userMsg = input.trim();
      setInput('');
      setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
      setLoading(true);

      // Prepare history format for API
      const history = messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
      }));

      const reply = await chatWithOmni(userMsg, history);
      
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
      setLoading(false);
  };

  return (
    <>
        {/* Mobile Trigger Button (Floating Action Button) */}
        <button 
            onClick={() => setIsOpen(true)}
            className={`md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-300 flex items-center justify-center z-40 transition-transform active:scale-95 ${isOpen ? 'scale-0' : 'scale-100'}`}
        >
            <Bot className="w-8 h-8" />
        </button>

        {/* Mobile Backdrop */}
        {isOpen && (
            <div 
                className="md:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            />
        )}

        {/* Chat Container (Responsive: Drawer on Mobile, Sidebar on Desktop) */}
        <div 
            className={`
                flex flex-col bg-white transition-all duration-300 z-50
                
                /* Mobile Styles: Fixed Bottom Drawer */
                fixed bottom-0 right-0 w-full h-[85vh] rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] border-t border-slate-200
                ${isOpen ? 'translate-y-0' : 'translate-y-full'}

                /* Desktop Styles: Relative Sidebar (Overrides Mobile) */
                md:relative md:h-full md:border-t-0 md:border-l md:shadow-none md:rounded-none md:translate-y-0
                ${isOpen ? 'md:w-96' : 'md:w-16'}
            `}
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 bg-white/50 backdrop-blur-sm shrink-0 md:rounded-none rounded-t-3xl">
                {isOpen ? (
                    <div className="flex items-center text-indigo-600 font-bold">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-2">
                            <Bot className="w-5 h-5" />
                        </div>
                        Omni Mate
                    </div>
                ) : (
                    <div 
                        onClick={() => setIsOpen(true)}
                        className="hidden md:flex w-8 h-8 bg-indigo-600 rounded-lg items-center justify-center text-white cursor-pointer hover:bg-indigo-700 transition-colors mx-auto"
                    >
                        <Bot className="w-5 h-5" />
                    </div>
                )}
                
                {/* Desktop Toggle */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="hidden md:block p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                    {isOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>

                {/* Mobile Close */}
                <button 
                    onClick={() => setIsOpen(false)}
                    className="md:hidden p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full"
                >
                    <Minimize2 className="w-5 h-5" />
                </button>
            </div>

            {/* Chat Body */}
            {isOpen && (
                <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 custom-scrollbar">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 shrink-0 self-end mb-1">
                                        <Bot className="w-4 h-4 text-indigo-600" />
                                    </div>
                                )}
                                <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                    : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center space-x-2">
                                    <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                                    <span className="text-xs text-slate-400">Omni 正在思考...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-100 shrink-0 safe-area-bottom">
                        <form onSubmit={handleSend} className="relative">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="输入您的问题..."
                                className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
                            />
                            <button 
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </form>
                    </div>
                </>
            )}

            {/* Desktop Collapsed State Icons */}
            {!isOpen && (
                <div className="hidden md:flex flex-1 flex-col items-center py-6 space-y-6">
                    <button 
                        onClick={() => setIsOpen(true)}
                        className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all group relative"
                        title="开启对话"
                    >
                        <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                    </button>
                    <div className="flex-1"></div>
                </div>
            )}
        </div>
    </>
  );
};

export default OmniChat;