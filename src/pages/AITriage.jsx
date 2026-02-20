import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Mic, Send, Box, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

export default function AITriage() {
  const [input, setInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'AI', text: 'Namaste. Secure session initialized. Describe your legal concern and I will analyze it on-device.' }
  ]);
  const [isDesktop, setIsDesktop] = useState(true);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const { status, classification, urgency, streamingText, fullResponse, error, runTriage } = useAITriage();

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, streamingText]);

  // When Emergency is detected, navigate immediately
  useEffect(() => {
    if (status === 'emergency') {
      navigate('/emergency');
    }
  }, [status, navigate]);

  // When generation is done, navigate to classification results
  useEffect(() => {
    if (status === 'done' && fullResponse) {
      // Store result in sessionStorage so ClassificationResults page can read it
      sessionStorage.setItem('triageResult', JSON.stringify({ classification, urgency, response: fullResponse }));
      navigate('/classification');
    }
  }, [status, fullResponse, classification, urgency, navigate]);

  const handleSend = async () => {
    if (!input.trim() || status === 'classifying' || status === 'generating') return;
    const userText = input.trim();
    setInput('');

    // Add user message to chat display
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);

    // Add "analyzing" AI response bubble
    setChatMessages(prev => [...prev, { sender: 'AI', text: null, streaming: true }]);

    // Run full triage pipeline
    await runTriage(userText);
  };

  const isProcessing = status === 'classifying' || status === 'generating';

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans relative">
      {/* 3D Robot Background - Desktop Only */}
      {isDesktop && (
        <div className="fixed inset-0 z-0 flex items-center justify-center -mt-10 opacity-70 pointer-events-auto">
          <div className="w-full h-full">
            <SplineErrorWrapper>
              <Spline scene={`${import.meta.env.BASE_URL}robot.splinecode`} />
            </SplineErrorWrapper>
          </div>
        </div>
      )}

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
        {classification && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#00d4ff] border border-[#00d4ff]/30 px-3 py-1.5 bg-[#00d4ff]/5">
            <span className="uppercase tracking-widest">{classification.label}</span>
          </div>
        )}
      </header>

      {/* Chat Feed */}
      <div className="flex-1 p-6 space-y-8 pb-32 relative z-10 pointer-events-none">
        <div className="flex justify-center mb-8">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest border border-white/10 px-4 py-2 bg-black/50 backdrop-blur-sm pointer-events-auto">
            Secure Session Initialized · On-Device AI Active
          </div>
        </div>

        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`pointer-events-auto max-w-[85%] md:max-w-md p-5 border ${
              msg.sender === 'user'
                ? 'bg-[#00d4ff]/10 border-[#00d4ff]/30 text-[#00d4ff]'
                : 'bg-white/[0.03] border-white/10 text-gray-300'
            }`}>
              {msg.streaming ? (
                // Streaming AI response bubble
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
                <p className="text-[15px] leading-relaxed tracking-wide font-mono">
                  {msg.sender === 'AI' && <span className="text-pink-500 font-bold mr-2">{'>'}</span>}
                  {msg.text}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Error display */}
        {error && (
          <div className="flex justify-start">
            <div className="pointer-events-auto max-w-md p-4 border border-red-500/30 bg-red-500/5 text-red-400 text-sm font-mono">
              <ShieldAlert className="inline w-4 h-4 mr-2" />
              {error}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent z-40 pointer-events-none">
        <div className="pointer-events-auto max-w-3xl mx-auto flex items-end gap-3 p-2 bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl">
          <button className="p-3 bg-white/5 border border-white/10 hover:border-[#00d4ff]/50 text-gray-400 hover:text-[#00d4ff] transition-all">
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={isProcessing ? 'AI IS PROCESSING...' : 'INPUT CONCERN...'}
            disabled={isProcessing}
            className="flex-1 bg-transparent border-0 focus:ring-0 text-[#00d4ff] placeholder-gray-600 p-3 h-12 font-mono uppercase tracking-wider disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isProcessing || !input.trim()}
            className="p-3 border border-[#00d4ff]/50 bg-[#00d4ff]/10 text-[#00d4ff] hover:bg-[#00d4ff] hover:text-black transition-all shadow-[0_0_15px_rgba(0,212,255,0.2)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
