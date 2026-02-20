import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Star, ShieldCheck, Plus, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLawyerMatching } from '../hooks/useLawyerMatching.js';

export default function LawyerMatching() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [legalAidOnly, setLegalAidOnly] = useState(false);
  const [displayedLawyers, setDisplayedLawyers] = useState([]);

  const { allLawyers, matches, isLoading, status, findMatches } = useLawyerMatching();

  // Use triageResult from sessionStorage to auto-match if available
  useEffect(() => {
    const stored = sessionStorage.getItem('triageResult');
    if (stored) {
      try {
        const { classification } = JSON.parse(stored);
        if (classification?.label) {
          findMatches(classification.label, 8, { legalAidOnly: false });
        }
      } catch { /* ignore */ }
    }
  }, [findMatches]);

  // When matches update, use them. Otherwise fall back to all lawyers.
  useEffect(() => {
    if (matches.length > 0) {
      setDisplayedLawyers(matches.map(m => m.lawyer));
    } else if (allLawyers.length > 0) {
      setDisplayedLawyers(allLawyers);
    }
  }, [matches, allLawyers]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      findMatches(searchQuery, 8, { legalAidOnly });
    }
  };

  // Apply legal aid filter locally
  const filteredLawyers = legalAidOnly
    ? displayedLawyers.filter(l => l.isLegalAid)
    : displayedLawyers;

  const resultLabel = matches.length > 0
    ? `${filteredLawyers.length} AI-Matched Lawyers`
    : `${filteredLawyers.length} Verified Lawyers`;

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-24 relative overflow-x-hidden">
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none fixed"
        style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(168, 85, 247, 0.4) 2px, transparent 0)',
          backgroundSize: '100px 100px'
        }}
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] mix-blend-screen pointer-events-none fixed" />

      {/* Header Search */}
      <header className="sticky top-0 z-30 px-6 py-4 backdrop-blur-xl bg-black/80 border-b border-white/10 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="DESCRIBE YOUR LEGAL ISSUE..."
            className="w-full bg-white/5 border border-white/10 py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors font-mono tracking-widest text-[#00d4ff] placeholder-gray-600"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-3 border border-purple-500 bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-black transition-all font-mono text-xs tracking-widest"
        >
          AI MATCH
        </button>
        <button
          onClick={() => setShowFilters(true)}
          className="p-3 border border-white/10 hover:border-white/30 bg-white/5 transition-colors relative text-gray-400 hover:text-white"
        >
          <SlidersHorizontal className="w-5 h-5" />
          {legalAidOnly && <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 border-2 border-black" />}
        </button>
      </header>

      {/* Title Section */}
      <div className="px-6 py-12 relative z-10 border-b border-white/10">
        <h1 className="text-3xl lg:text-5xl font-sans font-bold tracking-tight mb-2">
          {matches.length > 0 ? 'Your Best Matches' : 'All Lawyers'}
        </h1>
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="flex items-center gap-2 text-purple-400 font-mono text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Finding best matches...</span>
            </div>
          ) : (
            <p className="text-gray-400 font-mono text-sm tracking-widest">{resultLabel.toUpperCase()}</p>
          )}
        </div>
      </div>

      {/* Lawyer List */}
      <main className="container mx-auto max-w-4xl px-6 py-12 space-y-6 relative z-10">
        {filteredLawyers.map(lawyer => (
          <div key={lawyer.id} className="bg-white/[0.02] border border-white/10 p-6 hover:border-purple-500/50 hover:bg-white/[0.04] transition-all group flex flex-col md:flex-row gap-6 relative overflow-hidden">
            {lawyer.isLegalAid && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />}
            <div className="flex gap-6 flex-1">
              <div className="relative shrink-0">
                <img src={lawyer.image} alt={lawyer.name} className="w-24 h-24 object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500" />
                {lawyer.online && <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-emerald-500 border-2 border-black" />}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-sans font-bold text-2xl truncate tracking-tight">{lawyer.name}</h3>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#00d4ff] border border-[#00d4ff]/30 px-2 py-1 bg-[#00d4ff]/10">
                    <Star className="w-3.5 h-3.5 fill-current" /> {lawyer.rating}
                  </div>
                </div>
                <p className="text-xs font-mono tracking-widest text-gray-500 mb-3">{lawyer.experience}+ YRS EXP</p>
                <div className="flex flex-wrap items-center gap-3">
                  {lawyer.isLegalAid && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/30 px-2 py-1">
                      <ShieldCheck className="w-3 h-3" /> LEGAL AID
                    </span>
                  )}
                  {lawyer.categories?.map(t => (
                    <span key={t} className="text-[10px] font-mono tracking-widest text-gray-400 border border-white/10 px-2 py-1">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-4 border-t border-white/10 md:border-none pt-4 md:pt-0">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                <MapPin className="w-4 h-4 text-purple-400" />
                {`${lawyer.location?.toUpperCase() ?? '?'} · ${lawyer.distanceKm != null ? lawyer.distanceKm + ' KM' : 'NEARBY'}`}
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Link to={`/lawyer/${lawyer.id}`} className="flex-1 md:flex-none text-center px-6 py-3 text-xs font-mono font-bold tracking-widest text-white border border-white/20 hover:border-white transition-colors">
                  PROFILE
                </Link>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-3 border border-purple-500 bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-black transition-all">
                  <span className="text-xs font-mono font-bold tracking-widest">CONNECT</span>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {!isLoading && filteredLawyers.length === 0 && (
          <div className="text-center py-16 text-gray-500 font-mono">
            No lawyers found. Try a different search.
          </div>
        )}
      </main>

      {/* Filters Sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-md" onClick={() => setShowFilters(false)}>
          <div className="bg-black w-full max-w-2xl border border-white/10 p-8 relative" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent left-0" />
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-sans font-bold tracking-tighter uppercase">Filter \ Sort</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 border border-white/10 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="font-mono text-xs text-gray-500 tracking-[0.2em] mb-4">LEGAL AID ONLY</h3>
                <label className="flex items-center justify-between p-4 border border-emerald-500/30 bg-emerald-500/5 cursor-pointer hover:bg-emerald-500/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span className="font-mono font-bold text-emerald-400 text-xs tracking-widest">VERIFIED AID</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={legalAidOnly}
                    onChange={e => setLegalAidOnly(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500"
                  />
                </label>
              </div>
              <button onClick={() => setShowFilters(false)} className="w-full py-5 bg-white text-black font-mono font-bold text-sm tracking-[0.2em] hover:bg-gray-200 transition-colors">
                APPLY FILTERS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
