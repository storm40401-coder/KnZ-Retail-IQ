import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Sparkles, 
  Settings, 
  LogOut,
  ChevronRight,
  Store,
  TrendingUp,
  Lock,
  X
} from 'lucide-react';
import { View } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: View;
  onViewChange: (view: View) => void;
  onUpgrade: () => void;
  onSignOut: () => void;
  isPro: boolean;
  isVIP: boolean;
}

export default function Sidebar({ isOpen, onClose, currentView, onViewChange, onUpgrade, onSignOut, isPro, isVIP }: SidebarProps) {
  const items = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory' as const, label: 'Inventory', icon: Package },
    { id: 'market-insights' as const, label: 'Market Insights', icon: TrendingUp, pro: true },
    { id: 'optimizer' as const, label: 'AI Optimizer', icon: Sparkles, pro: true },
  ];

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <div className={cn(
        "w-64 bg-[#141414] text-white flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 shadow-2xl lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FACC15] rounded-xl flex items-center justify-center">
              <Store className="text-[#141414]" size={24} />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight">KnZIQ</span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-white/10 rounded-xl text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group",
              currentView === item.id 
                ? "bg-white/10 text-white shadow-lg" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className={cn(
                currentView === item.id ? "text-[#FACC15]" : "text-gray-500 group-hover:text-gray-300"
              )} />
              <div className="flex items-center gap-2">
                <span className="font-sans font-medium text-sm">{item.label}</span>
                {item.pro && !isPro && (
                  <Lock size={10} className="text-gray-600" />
                )}
              </div>
            </div>
            {currentView === item.id && (
              <ChevronRight size={14} className="text-white animate-pulse" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className={cn(
          "p-4 rounded-3xl mb-4 transition-all",
          isPro 
            ? "bg-[#FACC15] text-[#141414] shadow-[0_0_20px_rgba(250,204,21,0.2)]" 
            : "bg-white/5 text-white"
        )}>
          <div className="flex items-center justify-between mb-2">
             <p className={cn(
               "text-[10px] font-mono uppercase tracking-widest italic",
               isPro ? "text-[#141414] font-bold" : "text-gray-500"
             )}>
               {isPro ? 'Pro Active' : 'Pro Version'}
             </p>
             {isPro && <Sparkles size={12} className="text-[#141414]" />}
          </div>
          <p className={cn(
            "text-xs font-sans",
            isPro ? "text-[#141414]/80 font-medium" : "text-gray-300"
          )}>
            {isPro 
              ? 'All enterprise features are now unlocked for your store.' 
              : 'Unlock market intelligence, multi-store sync and advanced SEO audits.'}
          </p>
          {!isPro && (
            <button 
              onClick={onUpgrade}
              className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-[10px] font-bold uppercase tracking-widest text-white border border-white/10"
            >
              Upgrade Now
            </button>
          )}
        </div>
        
        <button 
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-sans font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </div>
    </>
  );
}
