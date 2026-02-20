import React from 'react';
import { MessageSquare, ThumbsUp, MessageCircle, AlertTriangle, TrendingUp, Search, Hash, ShieldAlert, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_POSTS = [
  {
    id: 1,
    title: 'Can my landlord evict me without notice?',
    content: "I have been living in this house for 5 years and always paid rent on time via UPI. Suddenly the owner asked me to leave in 2 days because his son is moving in. I don't have a written agreement, only rent receipts. What are my rights in Mumbai?",
    author: 'Anonymous_User_492',
    tag: 'PropertyDisputes',
    replies: 12,
    upvotes: 45,
    topReply: "Under Maharashtra Rent Control Act, even without a written lease, you are a protected tenant. 2 days notice is illegal..."
  },
  {
    id: 2,
    title: 'Company not paying overtime for Diwali work.',
    content: "My factory in Noida asked us to work double shifts during the festival week. Now manager says it was 'voluntary' so no overtime pay. We have the clock-in logs. Can we file a complaint anonymously?",
    author: 'Anonymous_Worker_88',
    tag: 'LaborRights',
    replies: 8,
    upvotes: 132,
  },
  {
    id: 3,
    title: 'Got my PF money after 2 years! NyayaSetu helped.',
    content: "I used the templates from the Legal Library here to write a formal letter to the EPFO office. They finally responded and credited the amount. Don't give up!",
    author: 'Anonymous_User_112',
    tag: 'KnowYourRights',
    replies: 24,
    upvotes: 310,
  }
];

const CATEGORIES = [
  'FamilyLaw', 'LaborRights', 'PropertyDisputes', 'KnowYourRights', 'ConsumerGrievance'
];

export default function Community() {
  return (
    <div className="min-h-screen bg-black text-white font-sans pb-24 relative overflow-hidden">
      {/* Background Glows */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none fixed" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(236, 72, 153, 0.4) 2px, transparent 0)', 
          backgroundSize: '100px 100px' 
        }}
      />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-600/10 blur-[150px] mix-blend-screen pointer-events-none fixed" />

      {/* Header Area */}
      <div className="px-6 py-12 relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-5xl font-sans font-bold tracking-tight mb-4 flex items-center gap-4">
            NyayaSetu <span className="text-pink-500">Bustis</span>
          </h1>
          <p className="text-gray-400 font-mono text-sm tracking-widest max-w-xl">
             ENCRYPTED \ ANONYMOUS \ PEER-TO-PEER LEGAL FORUMS
          </p>
          
          <div className="mt-8 relative max-w-2xl">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="SEARCH DISCUSSIONS..." 
              className="w-full bg-white/5 border border-white/10 py-4 pl-14 pr-4 text-sm focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-colors font-mono tracking-widest text-pink-400 placeholder-gray-600"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            {CATEGORIES.map(cat => (
              <button key={cat} className="flex items-center gap-1.5 px-4 py-2 border border-white/10 bg-white/5 text-gray-400 text-xs font-mono font-bold tracking-widest hover:border-pink-500/50 hover:text-pink-400 transition-colors uppercase">
                <Hash className="w-3.5 h-3.5" /> {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto max-w-6xl px-6 py-12 relative z-10 grid lg:grid-cols-3 gap-10">
        
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-mono text-xs text-gray-500 tracking-[0.2em] uppercase">LATEST IN INDIA</h2>
            <button className="text-xs font-mono font-bold tracking-widest text-pink-400 border-b border-pink-400/30 hover:border-pink-400 transition-colors">
              NEW POST +
            </button>
          </div>
          
          {MOCK_POSTS.map(post => (
            <div key={post.id} className="bg-white/[0.02] border border-white/10 p-6 hover:border-pink-500/50 hover:bg-white/[0.04] transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-white/10 border border-white/20 flex items-center justify-center text-gray-400">
                     <Users className="w-4 h-4" />
                   </div>
                   <span className="font-mono text-xs text-gray-500">{post.author}</span>
                </div>
                <span className="px-3 py-1 border border-pink-500/30 bg-pink-500/10 text-pink-400 text-[10px] font-mono font-bold tracking-widest uppercase">
                  {post.tag}
                </span>
              </div>
              
              <h3 className="text-xl font-bold font-sans mb-3 text-gray-100 group-hover:text-white transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 font-sans">
                {post.content}
              </p>
              
              {post.topReply && (
                <div className="mt-4 mb-6 p-4 border-l-2 border-emerald-500 bg-white/5">
                  <div className="flex items-center gap-2 text-emerald-400 mb-2 font-mono text-[10px] tracking-widest font-bold uppercase">
                     <ShieldAlert className="w-3 h-3" /> VERIFIED BADGE REPLY
                  </div>
                  <p className="text-sm text-gray-300 italic">"{post.topReply}"</p>
                </div>
              )}

              <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                <button className="flex items-center gap-2 text-gray-500 hover:text-pink-400 transition-colors font-mono text-xs font-bold">
                  <ThumbsUp className="w-4 h-4" /> {post.upvotes}
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-mono text-xs font-bold">
                  <MessageCircle className="w-4 h-4" /> {post.replies} REPLIES
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          {/* Rules */}
          <div className="bg-black border border-white/10 p-6">
            <h3 className="font-mono text-xs text-gray-500 tracking-[0.2em] mb-6 flex items-center gap-3 uppercase">
               <ShieldAlert className="w-4 h-4 text-emerald-500" /> COMMUNITY RULES
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex gap-3 items-start">
                <span className="text-emerald-500 font-bold font-mono">01</span>
                <span><strong className="text-white">Privacy First:</strong> Do not share real names or contact details in public posts.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-emerald-500 font-bold font-mono">02</span>
                <span><strong className="text-white">Respect:</strong> Peer support only. Verified lawyers will have badges.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-emerald-500 font-bold font-mono">03</span>
                <span><strong className="text-white">Verify:</strong> Always cross-check advice with the AI Legal Library.</span>
              </li>
            </ul>
          </div>

          {/* Trending */}
          <div className="bg-white/[0.02] border border-white/10 p-6">
            <h3 className="font-mono text-xs text-gray-500 tracking-[0.2em] mb-6 flex items-center gap-3 uppercase">
               <TrendingUp className="w-4 h-4 text-pink-500" /> TRENDING IN INDIA
            </h3>
            <div className="space-y-6">
              <div className="group cursor-pointer">
                <h4 className="font-bold text-gray-200 group-hover:text-pink-400 transition-colors mb-1 font-sans">GST Changes for Small Vendors</h4>
                <p className="text-xs font-mono text-gray-500">Tax Laws • 1.2k Discussions</p>
              </div>
              <div className="group cursor-pointer">
                <h4 className="font-bold text-gray-200 group-hover:text-pink-400 transition-colors mb-1 font-sans">Maternity Benefit Act 2024</h4>
                <p className="text-xs font-mono text-gray-500">Women's Rights • 856 Discussions</p>
              </div>
              <div className="group cursor-pointer">
                <h4 className="font-bold text-gray-200 group-hover:text-pink-400 transition-colors mb-1 font-sans">DPDP Act & Your Privacy</h4>
                <p className="text-xs font-mono text-gray-500">Digital India • 3.4k Discussions</p>
              </div>
            </div>
          </div>

          {/* Urgent Help */}
          <div className="bg-red-500/10 border border-red-500/30 p-6 flex flex-col items-center text-center">
             <AlertTriangle className="w-8 h-8 text-red-500 mb-4" />
             <h3 className="font-bold font-sans text-lg text-white mb-2">Need Urgent Help?</h3>
             <p className="text-red-400 text-sm mb-6 font-mono">Free Legal Aid Helpline</p>
             <div className="px-6 py-3 border border-red-500 font-mono font-bold text-xl tracking-widest text-red-500 w-full">
                1800-NYAYA-SETU
             </div>
             <p className="text-xs text-gray-500 mt-4 uppercase tracking-widest font-mono">24/7 IN 22 LANGUAGES</p>
          </div>

        </div>
      </main>
    </div>
  );
}
