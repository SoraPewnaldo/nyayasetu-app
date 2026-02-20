import React from 'react';
import { ChevronLeft, Phone, Video, Paperclip, Mic, Send, ShieldCheck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSecureChat } from '../hooks/useSecureChat.js';

export default function SecureChat() {
  const [input, setInput] = React.useState('');
  const { messages, keyReady, sendMessage } = useSecureChat();
  const chatEndRef = React.useRef(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !keyReady) return;
    await sendMessage(input.trim(), 'user');
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(168, 85, 247, 0.4) 2px, transparent 0)',
          backgroundSize: '80px 80px'
        }}
      />

      {/* Header */}
      <header className="px-6 py-4 bg-black border-b border-white/10 flex items-center justify-between z-10 sticky top-0 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link to="/lawyers" className="p-2 text-gray-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="https://i.pravatar.cc/150?u=a" alt="Lawyer" className="w-10 h-10 object-cover border border-white/20 grayscale" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border border-black" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide">Adv. Sharma</h2>
              <div className="flex items-center gap-1 text-[10px] font-mono tracking-widest text-[#00d4ff] uppercase">
                <Lock className="w-3 h-3" /> E2E Encrypted
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 border border-white/10 text-gray-400 hover:text-[#00d4ff] hover:border-[#00d4ff]/30 transition-colors bg-white/5">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2.5 border border-white/10 text-gray-400 hover:text-purple-400 hover:border-purple-400/30 transition-colors bg-white/5">
            <Video className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Trust Banner */}
      <div className="bg-[#00d4ff]/5 border-b border-[#00d4ff]/20 py-2 px-6 flex justify-center items-center gap-2 relative z-10">
        <ShieldCheck className="w-4 h-4 text-[#00d4ff]" />
        <span className="text-xs font-mono tracking-widest text-[#00d4ff] uppercase font-bold">
          {keyReady ? 'AES-GCM Encrypted · Local Storage Only' : 'Initializing Secure Session...'}
        </span>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 content-start">
        {messages.length === 0 && (
          <div className="flex justify-center py-8">
            <p className="text-gray-600 font-mono text-xs tracking-widest uppercase">
              No messages yet. Start a secure conversation.
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-md ${
              msg.sender === 'user'
                ? 'bg-purple-500/10 border border-purple-500/30'
                : 'bg-white/5 border border-white/10'
            } p-4 relative group`}>
              <p className={`text-sm ${msg.sender === 'user' ? 'text-gray-100' : 'text-gray-300'} leading-relaxed font-sans`}>
                {msg.text}
              </p>
              <div className={`text-[9px] font-mono tracking-widest mt-2 ${
                msg.sender === 'user' ? 'text-purple-400/70 text-right' : 'text-gray-500 text-left'
              }`}>
                {msg.time} · <span className="text-emerald-500/70">encrypted</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black border-t border-white/10 z-10 relative">
        <div className="max-w-4xl mx-auto flex items-end gap-3 p-1">
          <button className="p-3 text-gray-400 hover:text-white transition-colors border border-white/5 hover:border-white/20 bg-white/5">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 border border-white/20 bg-white/5 flex items-center focus-within:border-purple-500/50 focus-within:bg-white/10 transition-colors pr-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={keyReady ? 'TYPE MESSAGE...' : 'INITIALIZING ENCRYPTION...'}
              disabled={!keyReady}
              className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder-gray-600 p-4 h-12 font-mono text-sm tracking-widest disabled:opacity-50"
            />
            <button className="p-2 text-gray-500 hover:text-[#00d4ff] transition-colors">
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!keyReady || !input.trim()}
            className="p-3 bg-purple-500/10 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-black transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
