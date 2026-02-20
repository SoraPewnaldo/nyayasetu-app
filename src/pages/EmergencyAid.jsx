import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, MapPin, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmergencyAid() {
  const [sosSent, setSosSent] = useState(false);

  const handleSOS = () => {
    setSosSent(true);
    setTimeout(() => setSosSent(false), 5000); // Reset after 5s
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      
      {/* Intense Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[150px] mix-blend-screen pointer-events-none fixed" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-coral-500/10 blur-[150px] mix-blend-screen pointer-events-none fixed" />
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none fixed" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(239, 68, 68, 0.4) 2px, transparent 0)', 
          backgroundSize: '100px 100px' 
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 px-6 py-4 bg-black/80 backdrop-blur-xl border-b border-red-500/20 flex items-center gap-4">
        <span className="font-mono text-xs tracking-[0.2em] text-red-500 font-bold uppercase">System \ Emergency Protocol</span>
      </header>

      <main className="container mx-auto max-w-3xl px-6 py-12 relative z-10 space-y-12">
        
        {/* Giant SOS Button */}
        <div className="flex flex-col items-center justify-center py-10">
          <button 
            onClick={handleSOS}
            className={`relative group h-48 w-48 rounded-full border border-red-500 flex items-center justify-center transition-all duration-300 ${
              sosSent ? 'bg-red-600 scale-95 opacity-50' : 'bg-red-500/10 hover:bg-red-500/20 hover:scale-105 shadow-[0_0_60px_rgba(239,68,68,0.4)] hover:shadow-[0_0_100px_rgba(239,68,68,0.6)]'
            }`}
          >
            <div className="absolute inset-0 rounded-full border-4 border-red-500 opacity-20 group-hover:animate-ping duration-1000" />
            <div className="absolute inset-0 rounded-full border-2 border-red-400 opacity-40 group-hover:animate-pulse" />
            <div className="flex flex-col items-center">
              <PhoneCall className={`w-12 h-12 mb-2 ${sosSent ? 'text-black' : 'text-red-500'} stroke-[2.5]`} />
              <span className={`text-2xl font-mono font-bold tracking-[0.2em] ${sosSent ? 'text-black' : 'text-red-500'}`}>
                {sosSent ? 'SENT' : 'SOS'}
              </span>
            </div>
          </button>
          <p className="mt-8 text-center text-red-400/80 font-mono text-sm tracking-widest max-w-xs uppercase">
             One tap to notify pre-assigned legal aid & emergency contacts.
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <button className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group">
            <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-mono text-sm font-bold tracking-widest text-white uppercase group-hover:text-emerald-400 transition-colors mb-1">Share Location</h3>
              <p className="text-xs text-gray-500 font-sans">Send encrypted GPS coords.</p>
            </div>
          </button>
          
          <button className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/10 hover:border-[#00d4ff]/50 hover:bg-[#00d4ff]/5 transition-all group">
            <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#00d4ff] group-hover:border-[#00d4ff]/30 transition-colors">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-mono text-sm font-bold tracking-widest text-white uppercase group-hover:text-[#00d4ff] transition-colors mb-1">Helplines</h3>
              <p className="text-xs text-gray-500 font-sans">View national support numbers.</p>
            </div>
          </button>
        </div>

        {/* Know Your Rights Guide */}
        <div className="border border-white/10 bg-black">
          <div className="p-6 border-b border-white/10 bg-white/[0.02] flex items-center gap-4">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <h2 className="text-lg font-mono font-bold tracking-widest uppercase">Immediate Rights Guide</h2>
          </div>
          <div className="divide-y divide-white/10">
            {[
              { title: 'Police Questioning / Arrest', desc: 'You have the right to remain silent and demand an attorney. Do not sign documents without legal counsel. Female arrestees must be handled by female officers.' },
              { title: 'Illegal Eviction Attempt', desc: 'Landlords cannot forcefully evict without a court order. Demand to see the official warrant. Document everything and call police if physically threatened.' }
            ].map((section, idx) => (
              <div key={idx} className="p-6 hover:bg-white/[0.02] transition-colors relative">
                <div className="absolute top-0 left-0 h-full w-1 bg-white/10" />
                <h3 className="font-bold text-lg mb-2 font-sans">{section.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{section.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
