import React from 'react';
import { ArrowRight, Shield, Scale, Users, MessageSquare, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Spline from '@splinetool/react-spline';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      
      {/* Hero Section (Full Viewport) */}
      <section className="relative h-screen w-full flex flex-col justify-end">
        
        {/* Abstract subtle background dots */}
        <div 
          className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(0, 212, 255, 0.15) 2px, transparent 0), radial-gradient(circle at 60px 60px, rgba(168, 85, 247, 0.1) 2px, transparent 0)', 
            backgroundSize: '120px 120px' 
          }}
        />

        {/* Central 3D Spline Scene */}
        <div className="absolute inset-0 z-10 flex items-center justify-center -mt-10 lg:-mt-20">
          <div className="w-full h-full max-w-[1200px] max-h-[900px]">
            <Spline scene="/scene-clean.splinecode" />
          </div>
        </div>



        {/* Bottom Content Overlay */}
        <div className="relative z-20 pb-12 lg:pb-20 px-6 lg:px-12 w-full max-w-[1600px] mx-auto pointer-events-none">
          <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-12">
            
            {/* Left side: Huge Heading */}
            <div className="space-y-8 flex-1">
              <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-sans font-bold tracking-tighter leading-[1.05] text-white">
                We're Building<br />
                Justice Locally
              </h1>
              
              <div className="flex items-center gap-6 text-xs font-mono tracking-[0.25em] text-gray-400 uppercase">
                <span>AI</span> <span className="text-gray-700 font-bold">\</span> 
                <span>LEGAL</span> <span className="text-gray-700 font-bold">\</span> 
                <span>ON-DEVICE</span> <span className="text-gray-700 font-bold">\</span> 
                <span>SECURE</span>
              </div>
            </div>

            {/* Right side: Description & Buttons */}
            <div className="flex flex-col lg:items-end space-y-10 lg:pb-6 pointer-events-auto shrink-0">
              <p className="text-lg text-gray-400 max-w-sm lg:text-left leading-relaxed">
                Crafting awesome on-device AI tools and killer legal-tech designs to make justice accessible to everyone.
              </p>
              
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <Link to="/lawyers" className="px-8 py-4 rounded-full border border-gray-700 hover:border-gray-400 transition-all font-semibold uppercase tracking-wider text-sm bg-black/40 backdrop-blur-md">
                  Contact Us
                </Link>
                <Link to="/triage" className="flex items-center gap-4 pl-8 pr-2 py-2 rounded-full border border-gray-700 bg-black/40 backdrop-blur-md hover:border-cyan-500/50 transition-all group">
                  <span className="font-semibold uppercase tracking-wider text-sm">Get Started</span>
                  <div className="w-12 h-12 rounded-full bg-[#00d4ff] flex items-center justify-center text-black group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>
        
        {/* Subtle bottom gradient to blend into next section */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
      </section>

      {/* Features Section (Dark Theme Match) */}
      <section className="py-24 px-6 lg:px-12 relative z-20 bg-black border-t border-white/5">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
            {[
              { icon: <Scale className="w-6 h-6 text-[#00d4ff]" />, title: 'Smart Triage', desc: 'AI analyzes your issue directly on your device with high precision, keeping data local.' },
              { icon: <Users className="w-6 h-6 text-purple-400" />, title: 'Lawyer Match', desc: 'Connect with verified legal aid and top-tier specialist advocates in your area.' },
              { icon: <MessageSquare className="w-6 h-6 text-pink-500" />, title: 'Community', desc: 'Access encrypted anonymous forums for shared legal experiences and guidance.' },
            ].map((f, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 p-10 rounded-[2rem] hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300 shadow-xl">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-sans font-bold mb-4 tracking-tight text-white">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm lg:text-base">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
