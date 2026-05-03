import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Building2, 
  Plus, 
  Clock,
  ShieldCheck,
  Lock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface FinancialsProps {
  isPro: boolean;
  onUpgrade: () => void;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'income', amount: 12500, description: 'Sales Payout', category: 'Inventory', date: '2026-05-02' },
  { id: '2', type: 'expense', amount: 4500, description: 'Shipping Labels', category: 'Logistics', date: '2026-05-01' },
  { id: '3', type: 'expense', amount: 2000, description: 'KnZ Pro Subscription', category: 'Software', date: '2026-04-28' },
];

export default function Financials({ isPro, onUpgrade }: FinancialsProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [bankConnected, setBankConnected] = useState(false);

  const handleConnectBank = () => {
    setIsConnecting(true);
    // Simulate Plaid/Stripe Link
    setTimeout(() => {
      setIsConnecting(false);
      setBankConnected(true);
    }, 3000);
  };

  if (!isPro) {
    return (
      <div className="p-8 lg:p-12 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        <div className="w-20 h-20 bg-[#FACC15] text-[#141414] rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(250,204,21,0.3)]">
          <Lock size={32} />
        </div>
        <h1 className="text-4xl font-sans font-bold tracking-tight text-[#141414]">Financial Intelligence</h1>
        <p className="text-gray-500 mt-4 max-w-md leading-relaxed">
          Connect your bank account to automate payouts, track real-time profitability, and access enterprise funding.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[
            { icon: Building2, title: "Bank Sync", desc: "Connect local & international banks" },
            { icon: Wallet, title: "Profit Tracking", desc: "Calculate margins automatically" },
            { icon: ShieldCheck, title: "Tax Ready", desc: "Export reports for tax season" }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <feature.icon size={24} className="text-[#FACC15] mb-3" />
              <h4 className="font-bold text-sm text-[#141414]">{feature.title}</h4>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{feature.desc}</p>
            </div>
          ))}
        </div>
        <button 
          onClick={onUpgrade}
          className="mt-12 px-10 py-4 bg-[#141414] text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl flex items-center gap-2"
        >
          Upgrade to Pro
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-sans font-bold tracking-tight text-[#141414]">Financials</h1>
          <p className="text-sm font-mono text-gray-500 uppercase tracking-widest mt-1 italic">Enterprise Banking & Cashflow</p>
        </div>
        {!bankConnected && (
          <button 
            onClick={handleConnectBank}
            disabled={isConnecting}
            className="px-6 py-3 bg-[#FACC15] text-[#141414] rounded-2xl font-bold flex items-center gap-2 hover:bg-[#EAB308] transition-colors shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            {isConnecting ? 'Initializing Link...' : 'Connect Bank'}
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Account Overview */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#141414] p-8 rounded-[2rem] text-white overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-8">
                <CreditCard className="text-white/10" size={64} />
              </div>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2">Available Balance</p>
              <h2 className="text-4xl font-bold text-[#FACC15]">PKR 450,230</h2>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center gap-1 text-[10px] bg-green-500/20 text-green-500 px-2 py-1 rounded-full border border-green-500/30">
                  <ArrowUpRight size={10} />
                  <span>+12.5% vs last month</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm"
            >
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2">Net Profit (MTD)</p>
              <h2 className="text-4xl font-bold text-[#141414]">PKR 82,410</h2>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                  <Wallet size={20} className="text-gray-400" />
                </div>
                <span className="text-xs text-gray-500 font-medium">85 Transactions processed</span>
              </div>
            </motion.div>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-sans font-bold text-lg">Detailed Transactions</h3>
              <button className="text-xs text-gray-400 hover:text-[#141414] font-mono uppercase tracking-wider flex items-center gap-1">
                View All <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_TRANSACTIONS.map((tx, i) => (
                <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      tx.type === 'income' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>
                      {tx.type === 'income' ? <Plus size={20} /> : <Clock size={18} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#141414]">{tx.description}</h4>
                      <p className="text-[10px] text-gray-400 uppercase font-mono">{tx.category} • {tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-bold text-sm",
                      tx.type === 'income' ? "text-green-600" : "text-[#141414]"
                    )}>
                      {tx.type === 'income' ? '+' : '-'} PKR {tx.amount.toLocaleString()}
                    </p>
                    <p className="text-[9px] text-gray-400 uppercase font-mono">Confirmed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Bank Connectivity */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="font-sans font-bold text-lg mb-6 flex items-center gap-2">
              <Building2 size={20} className="text-[#FACC15]" />
              Bank Connection
            </h3>
            
            <AnimatePresence mode="wait">
              {!bankConnected ? (
                <motion.div 
                  key="disconnected"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <p className="text-xs text-gray-500 leading-relaxed italic">
                    Connect your bank account via KnZ Financial Link to enable automatic trade settlement and real-time cashflow auditing.
                  </p>
                  <div className="p-4 bg-yellow-50 rounded-2xl flex items-start gap-4">
                    <AlertCircle className="text-yellow-600 mt-1" size={24} />
                    <p className="text-[10px] text-yellow-800 leading-relaxed font-medium">
                      Pro users get priority settlement (T+0). Connect your primary business account for optimal sync.
                    </p>
                  </div>
                  <button 
                    onClick={handleConnectBank}
                    disabled={isConnecting}
                    className="w-full py-4 bg-[#141414] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl active:scale-95 disabled:opacity-50"
                  >
                    {isConnecting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} className="text-[#FACC15]" />}
                    {isConnecting ? 'Connecting...' : 'Secure Connection'}
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="connected"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 p-6 bg-green-50 rounded-[1.5rem] border border-green-100">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Building2 className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#141414] text-sm">HBL Business Account</h4>
                      <p className="text-[10px] text-green-600 font-mono font-bold uppercase tracking-widest">Active & Verified</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-mono text-gray-400">
                      <span>SYNC STATUS</span>
                      <span className="text-[#141414] font-bold">100% SECURE</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-[100%]"></div>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed text-center">
                    Last sync: Just now. Next sync scheduled for 06:00 AM UTC.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-[#141414] p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACC15] blur-[80px] opacity-20 transition-all group-hover:opacity-40"></div>
            <h3 className="font-sans font-bold text-lg mb-4 flex items-center gap-2">
              <Plus size={18} className="text-[#FACC15]" />
              KnZ Credit
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6 font-medium">
              Based on your inventory health and sales flow, you are eligible for enterprise expansion credit.
            </p>
            <div className="mb-6">
              <span className="text-[10px] font-mono text-[#FACC15] uppercase tracking-widest block mb-1">Pre-approved amount</span>
              <span className="text-2xl font-bold">PKR 1,500,000</span>
            </div>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 transition-colors text-white rounded-2xl font-bold text-sm tracking-tight active:scale-95">
              Review Terms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
