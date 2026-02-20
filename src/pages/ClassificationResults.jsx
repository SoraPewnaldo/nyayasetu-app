import React, { useEffect, useState } from 'react';
import { CheckCircle2, FileText, ArrowRight, ShieldCheck, Zap, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const URGENCY_COLORS = {
  Low: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
  Medium: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5',
  High: 'text-red-400 border-red-500/30 bg-red-500/5',
};

export default function ClassificationResults() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('triageResult');
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, []);

  // Fallback display if result is missing
  const classification = result?.classification ?? { label: 'Property & Tenancy', confidence: 0.94 };
  const urgency = result?.urgency ?? { level: 'Medium' };
  const response = result?.response;

  const urgencyStyle = URGENCY_COLORS[urgency.level] ?? URGENCY_COLORS.Medium;
  const confidencePct = Math.round((classification.confidence ?? 0.9) * 100);

  // Detect classification-only result (no LLM model loaded)
  const isModelNotReady = response && (
    response.includes('model not downloaded') ||
    response.includes('model is loading') ||
    response.includes('status bar') 
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-24 relative overflow-hidden">
      {/* Background Dots */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(0, 212, 255, 0.4) 2px, transparent 0)',
          backgroundSize: '100px 100px'
        }}
      />
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d4ff]/20 blur-[100px] mix-blend-screen pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-10 px-6 py-5 backdrop-blur-xl border-b border-white/10 flex justify-between items-center">
        <h1 className="font-mono font-bold text-sm tracking-[0.2em] text-[#00d4ff] uppercase">Analysis \ Complete</h1>
        <div className={`flex items-center gap-2 text-xs font-mono font-bold border px-3 py-1 ${urgencyStyle}`}>
          <Zap className="w-3 h-3" />
          {urgency.level} Urgency
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-6 py-12 space-y-8 relative z-10 flex flex-col items-center">

        {/* Result Hero Card */}
        <div className="w-full bg-white/[0.02] border border-white/10 p-10 relative overflow-hidden group hover:border-[#00d4ff]/50 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#00d4ff]" />
          <div className="relative z-10 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00d4ff]/10 text-[#00d4ff] text-xs font-mono font-bold tracking-[0.1em] uppercase border border-[#00d4ff]/30 mb-6">
              <CheckCircle2 className="w-4 h-4" /> [ {confidencePct}% CONFIDENCE ]
            </div>
            <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight mb-4">{classification.label}</h2>
            <p className="text-gray-400 font-mono text-sm leading-relaxed">
              Case classified using on-device AI. Zero data transmitted.
            </p>
          </div>
        </div>

        {/* AI Legal Analysis — shown only when model produced a real response */}
        {response && !isModelNotReady && (
          <div className="w-full bg-white/[0.02] p-8 border border-white/10">
            <h3 className="font-bold text-sm font-mono tracking-widest text-gray-400 uppercase mb-6 flex items-center gap-3">
              <div className="w-8 h-8 border border-[#00d4ff]/50 bg-[#00d4ff]/10 flex items-center justify-center text-[#00d4ff]">
                <Brain className="w-4 h-4" />
              </div>
              AI Legal Analysis
            </h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">{response}</p>
          </div>
        )}

        {/* Model not ready — nudge user to download */}
        {isModelNotReady && (
          <div className="w-full bg-yellow-500/5 p-6 border border-yellow-500/20 flex items-start gap-4">
            <div className="w-8 h-8 border border-yellow-500/50 bg-yellow-500/10 flex items-center justify-center text-yellow-400 shrink-0">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <p className="font-mono text-xs font-bold text-yellow-400 tracking-widest uppercase mb-2">AI Model Not Loaded</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Case classified successfully. Download the AI model using the status bar (bottom right) for a detailed legal analysis.
              </p>
            </div>
          </div>
        )}

        {/* Fallback Legal Summary (if no AI response) */}
        {!response && (
          <div className="w-full bg-white/[0.02] p-8 border border-white/10">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-4 border-b border-white/10 pb-4">
              <div className="w-10 h-10 border border-[#00d4ff]/50 bg-[#00d4ff]/10 flex items-center justify-center text-[#00d4ff]">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-mono tracking-widest uppercase text-[#00d4ff] text-sm">Conclusion</span>
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Your case has been classified and analyzed. Consult with a specialized lawyer for detailed advice on your specific situation.
            </p>
          </div>
        )}

        {/* Actions & Privacy */}
        <div className="w-full pt-8 space-y-6 flex flex-col items-center">
          <Link to="/lawyers" className="w-full flex items-center justify-between px-8 py-5 border border-white/20 bg-white/5 hover:border-[#00d4ff]/50 hover:bg-[#00d4ff]/10 transition-all group">
            <span className="font-mono font-bold tracking-widest uppercase text-[#00d4ff] group-hover:text-white transition-colors">Find Specialized Lawyers</span>
            <div className="w-10 h-10 border border-white/20 flex items-center justify-center text-gray-400 group-hover:bg-[#00d4ff] group-hover:text-black group-hover:border-[#00d4ff] transition-all">
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
          <div className="flex items-center justify-center gap-3 text-xs text-gray-500 font-mono border border-white/10 px-4 py-2 bg-black/50">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>LOCAL \ NO CLOUD TRANSFER</span>
          </div>
        </div>
      </main>
    </div>
  );
}
