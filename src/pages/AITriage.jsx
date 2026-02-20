import React, { useState } from 'react';
import { ShieldAlert, Mic, Send, X, Box } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';

export default function AITriage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'AI', text: 'Namaste. Initialize triage protocol. Describe your legal concern.' }
  ]);
  const navigate = useNavigate();

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    // Simulate AI processing leading to classification
    setTimeout(() => {
      navigate('/classification');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans relative">
      {/* 3D Robot Background */}
      <div className="fixed inset-0 z-0 flex items-center justify-center -mt-10 opacity-70 pointer-events-auto">
        <div className="w-full h-full">
          <Spline scene="/robot.splinecode" />
        </div>
      </div>

      {/* Abstract Background Element */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(0, 212, 255, 0.4) 2px, transparent 0)', 
          backgroundSize: '100px 100px' 
        }}
      />
      <div className="fixed top-1/4 -right-1/4 w-[600px] h-[600px] bg-[#00d4ff]/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-10 px-6 py-5 bg-black/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-[#00d4ff]/50 bg-[#00d4ff]/10 flex items-center justify-center font-bold text-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <Box className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-widest uppercase text-gray-200">System \ Triage</span>
        </div>
      </header>

      {/* Chat Feed */}
      <div className="flex-1 p-6 space-y-8 pb-32 relative z-10 pointer-events-none">
        <div className="flex justify-center mb-8">
           <div className="text-xs font-mono text-gray-500 uppercase tracking-widest border border-white/10 px-4 py-2 bg-black/50 backdrop-blur-sm pointer-events-auto">
             Secure Session Initiated
           </div>
        </div>
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`pointer-events-auto max-w-[85%] md:max-w-md p-5 border ${
              msg.sender === 'user' 
                ? 'bg-[#00d4ff]/10 border-[#00d4ff]/30 text-[#00d4ff]'
                : 'bg-white/[0.03] border-white/10 text-gray-300'
            }`}>
              <p className="text-[15px] leading-relaxed tracking-wide font-mono">
                {msg.sender === 'AI' && <span className="text-pink-500 font-bold mr-2">{'>'}</span>}
                {msg.text}
              </p>
            </div>
          </div>
        ))}
        {messages.length > 1 && (
          <div className="flex justify-start">
             <div className="pointer-events-auto inline-flex items-center gap-3 p-4 border border-[#00d4ff]/30 bg-[#00d4ff]/5 text-[#00d4ff] text-sm font-mono uppercase tracking-widest animate-pulse">
                <ShieldAlert className="w-4 h-4" />
                <span>Processing On-Device...</span>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent z-20 pointer-events-none">
        <div className="pointer-events-auto max-w-3xl mx-auto flex items-end gap-3 p-2 bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl">
          <button className="p-3 bg-white/5 border border-white/10 hover:border-[#00d4ff]/50 text-gray-400 hover:text-[#00d4ff] transition-all">
            <Mic className="w-5 h-5" />
          </button>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="INPUT CONCERN..."
            className="flex-1 bg-transparent border-0 focus:ring-0 text-[#00d4ff] placeholder-gray-600 p-3 h-12 font-mono uppercase tracking-wider"
          />
          <button onClick={handleSend} className="p-3 border border-[#00d4ff]/50 bg-[#00d4ff]/10 text-[#00d4ff] hover:bg-[#00d4ff] hover:text-black transition-all shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
