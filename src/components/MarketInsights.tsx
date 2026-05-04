import React, { useState, useRef } from 'react';
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
  Download,
  FileText,
  Loader2,
  BadgeAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { PLAN_LIMITS } from '../types';
import { generateMarketReport } from '../lib/gemini';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface MarketInsightsProps {
  isPro: boolean;
  onUpgrade: () => void;
  usage: { marketReports: number };
  onUseReport: () => void;
}

export default function MarketInsights({ isPro, onUpgrade, usage, onUseReport }: MarketInsightsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

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

  const handleAnalyze = async () => {
    if (!searchTerm.trim()) return;
    if (usage.marketReports >= PLAN_LIMITS.pro.marketReports) {
      alert("Monthly Market Report limit reached. Contact support for enterprise scale.");
      return;
    }

    setAnalyzing(true);
    try {
      const data = await generateMarketReport(searchTerm);
      setReportData(data);
      onUseReport();
    } catch (error) {
      console.error("Analysis Failed:", error);
      alert("AI Intelligence nodes are busy. Try again soon.");
    } finally {
      setAnalyzing(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`KNZ-Market-Report-${searchTerm.replace(/\s+/g, '-')}.pdf`);
  };

  // Default data for empty state
  const trendingCategories = reportData?.trending || [
    { name: 'Home Automation', growth: '+45%', sentiment: 'High' },
    { name: 'Eco-Packaging', growth: '+32%', sentiment: 'Rising' },
    { name: 'Pet Wellness', growth: '+28%', sentiment: 'Stable' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-sans font-bold tracking-tight text-[#141414]">Market Intelligence</h1>
            <span className="px-2 py-1 bg-[#141414] text-[#FACC15] text-[8px] font-mono font-black uppercase rounded shadow-sm">
              Pro Pulse
            </span>
          </div>
          <p className="text-sm font-mono text-gray-500 uppercase tracking-widest mt-1 italic">KnZ Intelligence Agency • Multi-Platform Signal Extraction</p>
        </div>
        
        {reportData && (
          <button 
            onClick={downloadPDF}
            className="flex items-center gap-2 px-6 py-3 bg-[#141414] text-[#FACC15] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
          >
            <Download size={14} /> Download PDF Report
          </button>
        )}
      </header>

      {/* Main Analysis Container */}
      <div ref={reportRef} className="space-y-8 bg-transparent p-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#141414] transition-colors">
                <Search size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Query market trends (e.g., 'Skincare Trends in Punjab 2026')..."
                className="w-full bg-white border border-gray-100 p-6 pl-16 rounded-[2rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FACC15] transition-all text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <button 
                onClick={handleAnalyze}
                disabled={analyzing}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#141414] text-white px-6 py-3 rounded-[1.5rem] text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
              >
                {analyzing ? (
                  <Loader2 size={14} className="animate-spin text-[#FACC15]" />
                ) : (
                  <Zap size={14} className="text-[#FACC15]" />
                )}
                {analyzing ? 'Scanning...' : 'Analyze'}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {reportData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="text-blue-500" size={20} />
                    <h3 className="font-bold text-lg text-[#141414]">Executive Summary</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-blue-500 pl-6 py-2 bg-blue-50/20 rounded-r-xl">
                    {reportData.summary}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-green-500" />
                  Demand Velocity
                </h3>
                <div className="space-y-4">
                  {trendingCategories.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-bold text-sm text-[#141414]">{cat.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">Sentiment: {cat.sentiment}</p>
                      </div>
                      <span className="text-xs font-bold text-green-600">{cat.growth}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#141414] p-8 rounded-[2.5rem] text-white relative overflow-hidden group min-h-[300px] flex flex-col">
                <div className="absolute top-0 right-0 p-8">
                  <PieChart className="text-white/10 group-hover:rotate-12 transition-transform duration-500" size={80} />
                </div>
                <h3 className="font-bold text-lg mb-2">Demand Pulse Engine</h3>
                <p className="text-xs text-gray-400 font-medium mb-6">Market momentum visualized</p>
                
                <div className="flex-1 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={reportData?.chartData || [
                        { month: 'Jan', value: 30 },
                        { month: 'Feb', value: 45 },
                        { month: 'Mar', value: 25 },
                        { month: 'Apr', value: 60 },
                        { month: 'May', value: 85 },
                        { month: 'Jun', value: 50 },
                      ]}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="month" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ background: '#141414', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                          itemStyle={{ color: '#FACC15' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#FACC15" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Sparkles size={20} className="text-[#FACC15]" />
                  AI Recommendations
                </h3>
                <div className="space-y-4">
                  {(reportData?.recommendations || [
                    "Detected 15% increase in competitor stock-outs in the niche.",
                    "Global shipping delays expected. Order buffer stock for SKU-882."
                  ]).map((rec: string, i: number) => (
                    <div key={i} className="p-4 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                      <p className="text-xs text-gray-500 italic leading-relaxed">"{rec}"</p>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-[#141414] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Price Volatility Index</span>
                  <BadgeAlert className="text-[#FACC15]" size={16} />
                </div>
                <div className="text-4xl font-sans font-bold mb-4">
                  {reportData?.priceVelocity || 42}<span className="text-sm font-mono text-[#FACC15] ml-1">vP</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
                   <div 
                    className="h-full bg-gradient-to-r from-green-500 via-[#FACC15] to-red-500 transition-all duration-1000"
                    style={{ width: `${reportData?.priceVelocity || 42}%` }}
                   />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                  <span>Stable</span>
                  <span>Hyper-Volatile</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

