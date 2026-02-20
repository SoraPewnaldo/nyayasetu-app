import React, { useState } from 'react';
import { MapPin, Star, Clock, Languages, Award, MessageSquare, Calendar, ChevronLeft, CheckCircle2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LawyerProfile() {
  const [showBooking, setShowBooking] = useState(false);

  const mockLawyer = {
    name: 'Adv. Ananya Sharma',
    rating: 4.8,
    reviews: 142,
    exp: '12+ Years',
    specs: ['Property Law', 'Civil Disputes', 'Family Law'],
    langs: ['English', 'Hindi', 'Marathi'],
    location: 'Connaught Place, New Delhi',
    bio: 'Ananya is a seasoned advocate specializing in property and civil disputes. She is committed to providing accessible legal aid and has successfully resolved over 300+ complex tenancy and property cases.',
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-24 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none fixed" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(168, 85, 247, 0.4) 2px, transparent 0)', 
          backgroundSize: '100px 100px' 
        }}
      />
      
      {/* Header */}
      <header className="sticky top-0 z-30 px-6 py-4 backdrop-blur-xl bg-black/80 border-b border-white/10 flex items-center gap-4">
        <span className="font-mono text-xs tracking-[0.2em] text-purple-400 uppercase">Profile \ ADV. SHARMA</span>
      </header>

      <main className="container mx-auto max-w-2xl px-6 py-10 space-y-8 relative z-10">
        
        {/* Profile Card */}
        <div className="bg-white/[0.02] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.04] transition-colors overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-purple-900/40 via-purple-600/20 to-black border-b border-white/10 relative">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
          </div>
          
          <div className="px-8 pb-8 -mt-20 relative z-10">
            <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-6">
              <img 
                src="https://i.pravatar.cc/300?u=a" 
                alt="Lawyer" 
                className="w-32 h-32 object-cover border-4 border-black bg-black grayscale hover:grayscale-0 transition-all duration-500"
              />
              <div className="flex gap-4">
                <Link to="/consultation" className="p-4 border border-white/20 bg-white/5 hover:border-purple-500 hover:text-purple-400 transition-all text-white">
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <button 
                  onClick={() => setShowBooking(true)}
                  className="px-6 py-4 flex items-center gap-3 bg-purple-500/10 border border-purple-500 text-purple-400 text-xs font-mono font-bold tracking-widest hover:bg-purple-500 hover:text-black transition-all"
                >
                  <Calendar className="w-4 h-4" /> BOOK
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <h1 className="text-4xl font-sans font-bold tracking-tight mb-2">{mockLawyer.name}</h1>
              <div className="flex items-center gap-4 text-xs font-mono font-bold tracking-widest text-[#00d4ff]">
                <div className="flex items-center gap-1 border border-[#00d4ff]/30 px-2 py-1 bg-[#00d4ff]/10">
                  <Star className="w-3 h-3 fill-current" /> {mockLawyer.rating}
                </div>
                <span className="text-gray-500">({mockLawyer.reviews} REVIEWS)</span>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed pt-4 border-t border-white/10 text-sm">{mockLawyer.bio}</p>
          </div>
        </div>

        {/* Info Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Clock />, label: 'EXP', value: mockLawyer.exp },
            { icon: <Award />, label: 'RANK', value: 'High Court' },
            { icon: <Languages />, label: 'LANGS', value: mockLawyer.langs.length },
            { icon: <MapPin />, label: 'AREA', value: 'Delhi' },
          ].map((item, i) => (
            <div key={i} className="p-4 border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.08] transition-colors group">
              <div className="text-gray-500 group-hover:text-purple-400 transition-colors">
                {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
              </div>
              <div className="text-xs font-mono tracking-widest text-gray-400">{item.label}</div>
              <div className="font-bold text-lg font-mono tracking-tight">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Expertise Space */}
        <div className="p-8 border border-white/10 bg-white/[0.02]">
          <h2 className="font-mono text-xs text-gray-500 tracking-[0.2em] mb-6 uppercase">EXPERTISE \ TAGS</h2>
          <div className="flex flex-wrap gap-3">
            {mockLawyer.specs.map(spec => (
              <span key={spec} className="px-4 py-2 border border-purple-500/30 bg-purple-500/5 text-purple-400 text-xs font-mono font-bold tracking-widest uppercase">
                {spec}
              </span>
            ))}
          </div>
        </div>
        
        {/* Office Location Placeholder */}
        <div className="p-8 border border-white/10 bg-white/[0.02] space-y-4">
          <h2 className="font-mono text-xs text-gray-500 tracking-[0.2em] uppercase flex items-center gap-3">
             <MapPin className="w-4 h-4 text-[#00d4ff]" /> LOCATION
          </h2>
          <p className="text-gray-300 font-sans tracking-wide">{mockLawyer.location}</p>
          <div className="w-full h-32 border border-white/10 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=New+Delhi&zoom=13&size=600x300&maptype=roadmap&style=feature:all|element:labels.text.fill|color:0x8a8a8a&style=feature:all|element:labels.text.stroke|visibility:on|color:0x000000|weight:2&style=feature:all|element:labels.icon|visibility:off&style=feature:administrative|element:geometry.fill|color:0x000000&style=feature:administrative|element:geometry.stroke|color:0x144b53&style=feature:landscape|element:all|color:0x08304b&style=feature:poi|element:geometry|color:0x0c4152&style=feature:road.highway|element:geometry.fill|color:0x000000&style=feature:road.highway|element:geometry.stroke|color:0x0b434f&style=feature:road.arterial|element:geometry.fill|color:0x000000&style=feature:road.arterial|element:geometry.stroke|color:0x0b3d51&style=feature:road.local|element:geometry|color:0x000000&style=feature:transit|element:all|color:0x146474&style=feature:water|element:all|color:0x021019')] bg-cover bg-center grayscale contrast-125 opacity-70"></div>
        </div>

      </main>

      {/* Booking Simulation Overlay */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md" onClick={() => setShowBooking(false)}>
          <div className="w-full max-w-md bg-black border border-white/10 p-10 relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 left-0 w-1 h-full bg-[#00d4ff]" />
            <button 
              onClick={() => setShowBooking(false)}
              className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border border-[#00d4ff]/50 bg-[#00d4ff]/10 text-[#00d4ff] flex items-center justify-center select-none shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold font-sans text-center mb-2 tracking-tight">Request Sent</h2>
            <p className="text-gray-400 text-center text-sm mb-8 font-sans leading-relaxed">
              Consultation request sent to {mockLawyer.name}. They will review and confirm a time shortly.
            </p>
            
            <button 
              onClick={() => setShowBooking(false)}
              className="w-full py-4 bg-white text-black font-mono font-bold tracking-[0.2em] text-xs hover:bg-gray-200 transition-colors uppercase"
            >
              CLOSE \ RETURN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
