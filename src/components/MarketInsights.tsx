import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Zap, 
  Search, 
  ArrowRight, 
  Lock,
  Sparkles,
  PieChart,
  LineChart,
  BadgeAlert
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { PLAN_LIMITS } from '../types';

interface MarketInsightsProps {
  isPro: boolean;
  onUpgrade: () => void;
  usage: { marketReports: number };
  onUseReport: () => void;
}

export default function MarketInsights({ isPro, onUpgrade, usage, onUseReport }: MarketInsightsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  if (!isPro) {
    return (
      <div className="p-8 lg:p-12 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        <div className="w-20 h-20 bg-[#141414] text-[#FACC15] rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
          <Lock size={32} />
        </div>
        <h1 className="text-4xl font-sans font-bold tracking-tight text-[#141414]">Market Intelligence</h1>
        <p className="text-gray-500 mt-4 max-w-md leading-relaxed">
          Access real-time price velocity, competitor stock monitoring, and global demand shifts. 
          Market intelligence is available exclusively to Pro partners.
        </p>
        <button 
          onClick={onUpgrade}
          className="mt-12 px-10 py-4 bg-[#FACC15] text-[#141414] rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl flex items-center gap-2"
        >
          Upgrade for Market Access
        </button>
      </div>
    );
  }

  const handleAnalyze = () => {
    if (usage.marketReports >= PLAN_LIMITS.pro.marketReports) {
      alert("Monthly Market Report limit reached. Contact support for enterprise scale.");
      return;
    }
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      onUseReport();
    }, 2000);
  };

  const trendingCategories = [
    { name: 'Home Automation', growth: '+45%', sentiment: 'High' },
    { name: 'Eco-Packaging', growth: '+32%', sentiment: 'Rising' },
    { name: 'Pet Wellness', growth: '+28%', sentiment: 'Stable' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-sans font-bold tracking-tight text-[#141414]">Market Intelligence</h1>
          {!isPro && (
            <span className="px-2 py-1 bg-[#141414] text-[#FACC15] text-[8px] font-mono font-black uppercase rounded shadow-sm">
              Standard
            </span>
          )}
        </div>
        <p className="text-sm font-mono text-gray-500 uppercase tracking-widest mt-1 italic">Real-time Global Demand & Competitive Analysis</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search Bar - Center Piece */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#141414] transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search market trends (e.g., 'Wireless Earbuds 2026')..."
              className="w-full bg-white border border-gray-100 p-6 pl-16 rounded-[2rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FACC15] transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={handleAnalyze}
              disabled={analyzing}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#141414] text-white px-6 py-3 rounded-[1.5rem] text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
            >
              {analyzing ? (
                <span className="animate-spin text-[#FACC15]">●</span>
              ) : (
                <Zap size={14} className="text-[#FACC15]" />
              )}
              {analyzing ? 'Scanning...' : 'Analyze'}
            </button>
          </div>

          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Monthly Reports</span>
              <span className="text-xs font-bold font-mono text-[#141414]">
                {usage.marketReports} / {PLAN_LIMITS.pro.marketReports}
              </span>
            </div>
            <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#FACC15]" 
                style={{ width: `${(usage.marketReports / PLAN_LIMITS.pro.marketReports) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-green-500" />
                Trending Now
              </h3>
              <div className="space-y-4">
                {trendingCategories.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="font-bold text-sm text-[#141414]">{cat.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">Demand Sentiment: {cat.sentiment}</p>
                    </div>
                    <span className="text-xs font-bold text-green-600">{cat.growth}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#141414] p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                <PieChart className="text-white/10 group-hover:rotate-12 transition-transform duration-500" size={80} />
              </div>
              <h3 className="font-bold text-lg mb-2">Price Velocity</h3>
              <p className="text-xs text-gray-400 font-medium mb-6">Market-wide price shifting analysis</p>
              <div className="space-y-2">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-[#FACC15] w-[70%]"></div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  <span>Inflationary</span>
                  <span>Stable</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Locked Features */}
        <div className="space-y-8">
          <div className={cn(
            "bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden",
            !isPro && "opacity-90"
          )}>
            {!isPro && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-8 text-center">
                 <div className="w-12 h-12 bg-[#141414] text-[#FACC15] rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                    <Lock size={20} />
                 </div>
                 <h4 className="font-bold text-[#141414]">Competitive Spy</h4>
                 <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                   Unlock the ability to monitor competitor inventory levels and pricing shifts in real-time.
                 </p>
                 <button 
                  onClick={onUpgrade}
                  className="mt-6 px-6 py-2 bg-[#FACC15] text-[#141414] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                 >
                   Unlock Pro
                 </button>
              </div>
            )}
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Sparkles size={20} className="text-[#FACC15]" />
              AI Recommendations
            </h3>
            <div className="space-y-4">
              <div className="p-4 border border-dashed border-gray-200 rounded-2xl">
                 <p className="text-xs text-gray-400 italic">"Detected 15% increase in competitor stock-outs in the 'Consumer Electronics' niche. Opportunity for price adjustment..."</p>
              </div>
              <div className="p-4 border border-dashed border-gray-200 rounded-2xl">
                 <p className="text-xs text-gray-400 italic">"Global shipping delays expected in Port Qasim. Recommend ordering buffer stock for SKU-882..."</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#141414] to-[#262626] p-8 rounded-[2.5rem] text-white shadow-2xl relative">
             <div className="flex items-center justify-between mb-6">
                <LineChart className="text-[#FACC15]" size={24} />
                <span className="text-[10px] font-mono text-gray-400">MAY 2026 REPORT</span>
             </div>
             <h3 className="font-bold text-lg leading-tight mb-4">Quarterly Strategic Inventory Report</h3>
             <p className="text-xs text-gray-400 leading-relaxed mb-6">
               Deep dive into SKU-level demand forecasting using our new Gemini-4 Pulse engine.
             </p>
             <button className="w-full py-4 bg-white/5 hover:bg-white/10 transition-colors text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                Download PDF <ArrowRight size={14} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
