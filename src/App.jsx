import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Scale, Users, MessageSquare, ShieldAlert } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import AITriage from './pages/AITriage';
import ClassificationResults from './pages/ClassificationResults';
import LawyerMatching from './pages/LawyerMatching';
import LawyerProfile from './pages/LawyerProfile';
import SecureChat from './pages/SecureChat';
import EmergencyAid from './pages/EmergencyAid';
import Community from './pages/Community';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function GlobalNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="sticky top-0 z-50 px-6 py-4 bg-black/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between shadow-2xl">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-bold font-sans tracking-tighter flex items-center gap-3">
          <div className="w-8 h-8 bg-[#00d4ff] text-black flex items-center justify-center font-bold">N</div>
          <span className="hidden md:inline">NyayaSetu</span>
        </Link>
        <div className="flex items-center gap-6 font-mono text-xs tracking-widest uppercase">
          <Link to="/" className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 hover:text-[#00d4ff] transition-colors ${path === '/' ? 'text-[#00d4ff]' : 'text-gray-400'}`}>
            <Home className="w-5 h-5 md:w-4 md:h-4" /> <span className="hidden md:inline">Home</span>
          </Link>
          <Link to="/triage" className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 hover:text-[#00d4ff] transition-colors ${path === '/triage' || path === '/classification' ? 'text-[#00d4ff]' : 'text-gray-400'}`}>
            <Scale className="w-5 h-5 md:w-4 md:h-4" /> <span className="hidden md:inline">Triage</span>
          </Link>
          <Link to="/lawyers" className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 hover:text-[#00d4ff] transition-colors ${path.startsWith('/lawyer') ? 'text-[#00d4ff]' : 'text-gray-400'}`}>
            <Users className="w-5 h-5 md:w-4 md:h-4" /> <span className="hidden md:inline">Lawyers</span>
          </Link>
          <Link to="/community" className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 hover:text-[#00d4ff] transition-colors ${path === '/community' ? 'text-[#00d4ff]' : 'text-gray-400'}`}>
            <MessageSquare className="w-5 h-5 md:w-4 md:h-4" /> <span className="hidden md:inline">Community</span>
          </Link>
          <Link to="/consultation" className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 hover:text-[#00d4ff] transition-colors ${path === '/consultation' ? 'text-[#00d4ff]' : 'text-gray-400'}`}>
            <MessageSquare className="w-5 h-5 md:w-4 md:h-4" /> <span className="hidden md:inline">Chat</span>
          </Link>
        </div>
      </div>
      <div>
        <Link to="/emergency" className="flex items-center gap-2 px-4 py-2 border border-red-500/50 bg-red-500/10 text-red-500 font-mono text-xs font-bold tracking-widest uppercase hover:bg-red-500 hover:text-black transition-all">
          <ShieldAlert className="w-4 h-4" /> <span className="hidden sm:inline">SOS</span>
        </Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router basename="/nyayasetu-app">
      <ScrollToTop />
      <div className="min-h-screen bg-black text-white selection:bg-[#00d4ff]/30 font-sans flex flex-col">
        <GlobalNav />
        <main className="w-full flex-1 relative">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/triage" element={<AITriage />} />
            <Route path="/classification" element={<ClassificationResults />} />
            <Route path="/lawyers" element={<LawyerMatching />} />
            <Route path="/lawyer/:id" element={<LawyerProfile />} />
            <Route path="/community" element={<Community />} />
            <Route path="/consultation" element={<SecureChat />} />
            <Route path="/emergency" element={<EmergencyAid />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
