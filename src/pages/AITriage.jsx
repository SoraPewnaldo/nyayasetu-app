import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldAlert, Mic, Send, Box, Loader2, ArrowRight, Users, RotateCcw } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import { useAITriage } from '../hooks/useAITriage.js';

class SplineErrorWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) { console.error('Spline rendering error:', error); }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// Quick-reply suggestions shown before the user types
const SUGGESTIONS = [
  'My landlord is threatening to evict me without notice',
  'My employer hasn\'t paid salary for 2 months',
  'Got an FIR filed against me, what are my rights?',
  'My online order was never delivered and seller is refusing refund',
];

export default function AITriage() {
  const [input, setInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 0,
      sender: 'AI',
      text: 'Namaste 🙏 I\'m NyayaSetu — your on-device legal mentor. Everything you share stays on your device.\n\nTell me your legal concern and I\'ll help you understand your rights, relevant Indian laws, and next steps.',
    }
  ]);
  const [isDesktop, setIsDesktop] = useState(true);
  const [hasStarted, setHasStarted] = useState(false); // hide suggestions after first message
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const msgIdRef = useRef(1);

  const { status, classification, urgency, streamingText, fullResponse, error, runTriage, reset } = useAITriage();

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Scroll to bottom whenever something new arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, streamingText]);

  // Emergency: navigate immediately
  useEffect(() => {
    if (status === 'emergency') {
      navigate('/emergency');
    }
  }, [status, navigate]);

  // When generation finishes, update the streaming bubble to the final AI message
  // and add action buttons — NO auto-redirect
  useEffect(() => {
    if (status === 'done' && fullResponse) {
      setChatMessages(prev => {
        const updated = [...prev];
        // Find the last streaming bubble and finalise it
        const idx = updated.findLastIndex(m => m.streaming);
        if (idx !== -1) {
          updated[idx] = {
            ...updated[idx],
            text: fullResponse,
            streaming: false,
            classification,
            urgency,
            showActions: true,
          };
        }
        return updated;
      });
      // Persist for ClassificationResults page (optional deep-link)
      sessionStorage.setItem('triageResult', JSON.stringify({ classification, urgency, response: fullResponse }));
      reset(); // reset hook state so user can send another message
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, fullResponse]);

  const sendMessage = useCallback(async (text) => {
    const userText = text?.trim() || input.trim();
    if (!userText || status === 'classifying' || status === 'generating') return;
    setInput('');
    setHasStarted(true);

    const userId = msgIdRef.current++;
    const aiId = msgIdRef.current++;

    // Add user bubble
    setChatMessages(prev => [...prev, { id: userId, sender: 'user', text: userText }]);
    // Add streaming AI bubble
    setChatMessages(prev => [...prev, { id: aiId, sender: 'AI', text: null, streaming: true }]);

    await runTriage(userText);
  }, [input, status, runTriage]);

  const handleSend = () => sendMessage(input);
  const handleSuggestion = (s) => sendMessage(s);

  const isProcessing = status === 'classifying' || status === 'generating';

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans relative">

      {/* 3D Robot Background - Desktop Only */}
      {isDesktop && (
        <div className="fixed inset-0 z-0 flex items-center justify-center opacity-60 pointer-events-auto">
          <div className="w-full h-full">
            <SplineErrorWrapper>
              <Spline scene={`${import.meta.env.BASE_URL}robot.splinecode`} />
            </SplineErrorWrapper>
          </div>
        </div>
      )}

      {/* Dot grid background */}
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
          <span className="font-bold text-lg tracking-widest uppercase text-gray-200">Legal Mentor</span>
        </div>
        {classification && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#00d4ff] border border-[#00d4ff]/30 px-3 py-1.5 bg-[#00d4ff]/5">
            <span className="uppercase tracking-widest">{classification.label}</span>
          </div>
        )}
      </header>

      {/* Chat Feed */}
      <div className="flex-1 p-4 md:p-6 space-y-6 pb-44 md:pb-36 relative z-10">

        {/* Session badge */}
        <div className="flex justify-center">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest border border-white/10 px-4 py-2 bg-black/50 backdrop-blur-sm">
            Secure Session · On-Device AI · Zero Data Transmitted
          </div>
        </div>

        {/* Messages */}
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] md:max-w-2xl p-5 border ${
              msg.sender === 'user'
                ? 'bg-[#00d4ff]/10 border-[#00d4ff]/30 text-[#00d4ff]'
                : 'bg-white/[0.03] border-white/10 text-gray-300'
            }`}>
              {msg.streaming ? (
                streamingText ? (
                  <p className="text-[15px] leading-relaxed tracking-wide font-mono whitespace-pre-wrap">
                    <span className="text-pink-500 font-bold mr-2">{'>'}</span>
                    {streamingText}
                    <span className="animate-pulse text-[#00d4ff]">▌</span>
                  </p>
                ) : (
                  <div className="flex items-center gap-3 text-[#00d4ff] text-sm font-mono uppercase tracking-widest">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{status === 'classifying' ? 'Classifying case...' : 'Generating response...'}</span>
                  </div>
                )
              ) : (
                <>
                  <p className="text-[15px] leading-relaxed tracking-wide font-mono whitespace-pre-wrap">
                    {msg.sender === 'AI' && <span className="text-pink-500 font-bold mr-2">{'>'}</span>}
                    {msg.text}
                  </p>

                  {/* Action buttons after AI response */}
                  {msg.showActions && (
                    <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-3">
                      <Link
                        to="/lawyers"
                        className="flex items-center gap-2 px-4 py-2 border border-purple-500/50 bg-purple-500/10 text-purple-400 text-xs font-mono font-bold tracking-widest hover:bg-purple-500 hover:text-black transition-all"
                      >
                        <Users className="w-3.5 h-3.5" /> FIND A LAWYER
                      </Link>
                      <Link
                        to="/classification"
                        className="flex items-center gap-2 px-4 py-2 border border-white/20 bg-white/5 text-gray-300 text-xs font-mono font-bold tracking-widest hover:border-white transition-all"
                      >
                        <ArrowRight className="w-3.5 h-3.5" /> FULL ANALYSIS
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {/* Error display */}
        {error && (
          <div className="flex justify-start">
            <div className="max-w-2xl p-4 border border-red-500/30 bg-red-500/5 text-red-400 text-sm font-mono">
              <ShieldAlert className="inline w-4 h-4 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Quick suggestions (shown before first send) */}
        {!hasStarted && !isProcessing && (
          <div className="space-y-3 max-w-2xl mx-auto pt-4">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest text-center mb-4">Common legal questions</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(s)}
                  className="text-left p-4 border border-white/10 bg-white/[0.02] hover:border-[#00d4ff]/40 hover:bg-[#00d4ff]/5 transition-all text-sm text-gray-400 hover:text-[#00d4ff] font-sans leading-relaxed"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area — z-40 so it sits above ModelStatusBar (z-30) */}
      <div className="fixed bottom-0 left-0 right-0 px-4 md:px-6 pb-4 pt-4 bg-gradient-to-t from-black via-black/95 to-transparent z-40 pointer-events-none">
        <div className="pointer-events-auto max-w-3xl mx-auto">

          {/* "Ask another question" hint when processing done */}
          {status === 'idle' && hasStarted && (
            <p className="text-center text-xs font-mono text-gray-600 uppercase tracking-widest mb-2 animate-pulse">
              Ask a follow-up question ↓
            </p>
          )}

          <div className="flex items-end gap-3 p-2 bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl">
            <button className="p-3 bg-white/5 border border-white/10 hover:border-[#00d4ff]/50 text-gray-400 hover:text-[#00d4ff] transition-all shrink-0">
              <Mic className="w-5 h-5" />
            </button>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
              placeholder={isProcessing ? 'AI is thinking...' : 'Describe your legal situation... (Enter to send)'}
              disabled={isProcessing}
              className="flex-1 bg-transparent border-0 focus:ring-0 text-[#00d4ff] placeholder-gray-600 p-3 font-mono text-sm tracking-wide disabled:opacity-50 resize-none overflow-hidden min-h-[48px]"
            />
            <button
              onClick={handleSend}
              disabled={isProcessing || !input.trim()}
              className="p-3 border border-[#00d4ff]/50 bg-[#00d4ff]/10 text-[#00d4ff] hover:bg-[#00d4ff] hover:text-black transition-all shadow-[0_0_15px_rgba(0,212,255,0.2)] disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-center text-[10px] font-mono text-gray-600 mt-2 tracking-widest uppercase">
            On-device AI · Not legal advice · Always consult a licensed advocate
          </p>
        </div>
      </div>
    </div>
  );
}
