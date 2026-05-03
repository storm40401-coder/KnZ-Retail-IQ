import React, { useState } from 'react';
import { Sparkles, ArrowRight, Copy, Check, Loader2, Wand2, X } from 'lucide-react';
import { Product } from '../types';
import { optimizeListing } from '../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface ListingOptimizerProps {
  product: Product | null;
  onClose: () => void;
}

export default function ListingOptimizer({ product, onClose }: ListingOptimizerProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    optimizedTitle: string;
    optimizedDescription: string;
    keywords: string[];
  } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!product) return;
    setLoading(true);
    try {
      const data = await optimizeListing(product.name, product.category, product.description);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-end md:items-center justify-center">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        className="bg-white w-full h-[95vh] md:h-auto md:max-h-[85vh] md:max-w-4xl md:rounded-[2.5rem] rounded-t-[2rem] shadow-2xl overflow-hidden flex flex-col transition-all"
      >
        {/* Mobile Sticky Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100 flex-shrink-0 bg-white">
          <div className="flex items-center gap-2 md:gap-3">
             <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-xl flex items-center justify-center">
               <Sparkles className="text-blue-600" size={18} />
             </div>
             <div>
               <h2 className="text-base md:text-xl font-sans font-bold text-[#141414]">Listing Assistant</h2>
               <p className="text-[10px] md:text-xs font-mono text-gray-400 uppercase tracking-widest">{product.sku}</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row overflow-hidden flex-1">
          {/* Left Side: Current Stats */}
          <div className="p-6 md:p-8 md:w-1/3 bg-[#FAFAFA] border-r border-gray-100 overflow-y-auto">
            <h3 className="text-xs font-mono text-gray-400 uppercase italic font-bold mb-6 tracking-widest">Original Data</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase italic">Product Name</label>
                <p className="text-sm font-semibold mt-1">{product.name}</p>
              </div>
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase italic">Category</label>
                <p className="text-sm font-semibold mt-1">{product.category}</p>
              </div>
              <div className="hidden md:block">
                <label className="text-[10px] font-mono text-gray-400 uppercase italic">Description</label>
                <p className="text-xs text-gray-600 mt-2 line-clamp-6 bg-white p-3 rounded-xl border border-gray-100 italic">
                  {product.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: AI Results */}
          <div className="p-6 md:p-8 md:w-2/3 overflow-y-auto relative bg-white flex-1">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 md:py-20">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl md:text-2xl font-sans font-bold text-[#141414]">Ready to Optimize?</h3>
                <p className="text-gray-500 mt-2 text-sm max-w-xs mx-auto">
                  Analyze your product and generate professional copy for your sales channels.
                </p>
                <button 
                  onClick={handleOptimize}
                  className="mt-8 w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#141414] text-white rounded-2xl hover:bg-black transition-all shadow-xl active:scale-[0.98]"
                >
                  <Wand2 size={20} />
                  Generate Listing
                </button>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center py-12">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-base md:text-lg font-sans font-medium text-gray-600 animate-pulse text-center">
                  Consulting KnZ optimization models...
                </p>
              </div>
            )}

            <AnimatePresence>
              {result && !loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 md:space-y-8 pb-8"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg md:text-2xl font-sans font-bold text-[#141414] flex items-center gap-2">
                      <Check className="text-green-500" size={24} />
                      AI Results
                    </h3>
                     <button 
                      onClick={handleOptimize}
                      className="whitespace-nowrap text-[10px] md:text-xs text-blue-600 font-bold uppercase tracking-widest hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full"
                    >
                      <Sparkles size={12} /> Regenerate
                    </button>
                  </div>

                  <div className="bg-blue-50/20 p-5 rounded-2xl md:rounded-3xl border border-blue-50 group">
                    <header className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-mono text-blue-500 uppercase font-bold tracking-widest">Enhanced Title</span>
                      <button 
                        onClick={() => copyToClipboard(result.optimizedTitle, 'title')}
                        className="p-2 bg-white rounded-lg shadow-sm text-gray-400 hover:text-blue-600"
                      >
                        {copied === 'title' ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                    </header>
                    <p className="text-base md:text-lg font-sans font-bold text-[#141414]">{result.optimizedTitle}</p>
                  </div>

                  <div className="p-5 rounded-2xl md:rounded-3xl border border-gray-100 group">
                    <header className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-widest italic">Product Copy</span>
                      <button 
                        onClick={() => copyToClipboard(result.optimizedDescription, 'desc')}
                        className="p-2 bg-gray-50 rounded-lg shadow-sm text-gray-400 hover:text-[#141414]"
                      >
                        {copied === 'desc' ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                    </header>
                    <div className="text-sm font-sans text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {result.optimizedDescription}
                    </div>
                  </div>

                  <div>
                     <span className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-widest italic block mb-3">Seo Metadata / Tags</span>
                     <div className="flex flex-wrap gap-2">
                       {result.keywords.map((kw, i) => (
                         <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-500 text-[10px] font-bold uppercase rounded-full border border-gray-100">
                           #{kw}
                         </span>
                       ))}
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
