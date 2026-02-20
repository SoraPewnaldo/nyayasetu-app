import React, { useState } from 'react';
import { ChevronLeft, Phone, Video, MoreVertical, Paperclip, Mic, Send, ShieldCheck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SecureChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'lawyer', text: 'Hello, I reviewed your property dispute case details from the AI triage. How can I assist you further today?', time: '10:00 AM' },
    { sender: 'user', text: 'Hi Adv. Sharma. My landlord is refusing to return my security deposit without a valid reason.', time: '10:02 AM' },
    { sender: 'lawyer', text: 'Under the Model Tenancy Act, they must provide an itemized list of damages if withholding funds. Do you have your rental agreement?', time: '10:05 AM' },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden">
      
      {/* Background Dots */}
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
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="https://i.pravatar.cc/150?u=a" alt="Lawyer" className="w-10 h-10 object-cover border border-white/20 grayscale" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border border-black"></div>
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
        <span className="text-xs font-mono tracking-widest text-[#00d4ff] uppercase font-bold">Session is peer-to-peer encrypted</span>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 content-start">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-md ${
              msg.sender === 'user' 
                ? 'bg-purple-500/10 border border-purple-500/30' 
                : 'bg-white/5 border border-white/10'
            } p-4 relative group`}
            >
              <p className={`text-sm ${msg.sender === 'user' ? 'text-gray-100' : 'text-gray-300'} leading-relaxed font-sans`}>
                {msg.text}
              </p>
              <div className={`text-[9px] font-mono tracking-widest mt-2 ${
                msg.sender === 'user' ? 'text-purple-400/70 text-right' : 'text-gray-500 text-left'
              }`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
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
              placeholder="TYPE MESSAGE..."
              className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder-gray-600 p-4 h-12 font-mono text-sm tracking-widest"
            />
            <button className="p-2 text-gray-500 hover:text-[#00d4ff] transition-colors">
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={handleSend} 
            className="p-3 bg-purple-500/10 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-black transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
