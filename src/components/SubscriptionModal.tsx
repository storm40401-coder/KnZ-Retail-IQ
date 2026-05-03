import React, { useState } from 'react';
import { X, Check, Zap, Shield, Rocket, Globe, CreditCard, Lock, ArrowLeft, Loader2, Building2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (plan: 'weekly' | 'monthly' | 'yearly') => void;
  userEmail?: string;
}

const VIP_EMAILS = [
  'storm40401@gmail.com', 
  'mibrahim.acca@gmail.com', 
  'knzassociates@gmail.com', 
  'stormlightning10000@gmail.com', 
  'knzcollections011@gmail.com', 
  'luxyrontimepieces@gmail.com'
]; // Your email and other owners

export default function SubscriptionModal({ isOpen, onClose, onSubscribe, userEmail = 'guest@example.com' }: SubscriptionModalProps) {
  const [step, setStep] = useState<'selection' | 'payment' | 'processing'>('selection');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'local'>('card');
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const isVIP = VIP_EMAILS.includes(userEmail);

  const plans = [
    {
      id: 'weekly',
      name: 'Weekly',
      price: '500',
      period: 'week',
      description: 'Perfect for quick audits',
      features: ['Multi-store Sync', 'Basic SEO Audit', 'Priority Support']
    },
    {
      id: 'monthly',
      name: 'Monthly',
      price: '2000',
      period: 'month',
      description: 'The professional standard',
      features: ['AI Optimizer (500/mo)', 'Market Insights', 'Competitor Analysis', 'Pulse Forecasts'],
      popular: true
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '5000',
      period: 'year',
      description: 'The ultimate commitment',
      features: ['All Pro Features', 'Dedicated Support', 'Early Beta Access', 'White-labeling'],
      save: 'Best Value'
    }
  ];

  const activePlan = plans.find(p => p.id === selectedPlan)!;

  const handleAction = () => {
    if (isVIP) {
      setStep('processing');
      setTimeout(() => onSubscribe(selectedPlan), 1500);
    } else {
      setStep('payment');
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    try {
      const response = await fetch('/api/verify-subscription-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          method: paymentMethod,
          amount: activePlan.price
        })
      });
      const data = await response.json();
      if (data.success) {
        onSubscribe(selectedPlan);
      } else {
        alert(data.error || "Payment failed");
        setStep('payment');
      }
    } catch (error) {
      alert("System error. Try again later.");
      setStep('payment');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative min-h-[500px]"
          >
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"
            >
              <X size={20} className="text-gray-400" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
              {/* Left Side - Hero Info */}
              <div className="bg-[#141414] p-10 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                   <div className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full bg-[#FACC15] blur-3xl"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-[#FACC15] rounded-2xl flex items-center justify-center mb-6">
                    <Rocket className="text-[#141414]" size={24} />
                  </div>
                  <h2 className="text-3xl font-sans font-bold leading-tight mb-4">
                    Upgrade to <span className="text-[#FACC15]">KnZ Pro</span>
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8">
                    Take your business to the next level with our advanced intelligence tools.
                  </p>

                  <ul className="space-y-3">
                    {[
                      { icon: Globe, text: "Multi-store sync", sub: "HBL, Stripe & POS" },
                      { icon: Zap, text: isVIP ? "Unlimited AI optimizations" : "500 AI optimizations", sub: "Enterprise listing audits" },
                      { icon: TrendingUp, text: "Market Intelligence", sub: "Trend spy & analysis" },
                      { icon: CreditCard, text: "Bank Connectivity", sub: "PKR 1.5M credit limit" },
                      { icon: Shield, text: "Pulse Forecasting", sub: "Predictive stock buffers" }
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <item.icon size={16} className="text-[#FACC15]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-none mb-1">{item.text}</p>
                          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest leading-none">{item.sub}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest px-1">Powered by KnZ</p>
                  {isVIP && (
                    <div className="flex items-center gap-2 bg-[#FACC15]/20 px-3 py-1 rounded-full border border-[#FACC15]/30">
                      <Shield size={10} className="text-[#FACC15]" />
                      <span className="text-[10px] text-[#FACC15] font-bold uppercase tracking-tighter">Owner Access</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Dynamic Content */}
              <div className="p-10 bg-gray-50 flex flex-col">
                <AnimatePresence mode="wait">
                  {step === 'selection' && (
                    <motion.div
                      key="selection"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-6">Choose your plan</h3>
                      
                      <div className="space-y-4">
                        {plans.map((plan) => (
                          <button
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id as 'weekly' | 'monthly' | 'yearly')}
                            className={`w-full text-left p-6 rounded-3xl border-2 transition-all relative ${
                              selectedPlan === plan.id 
                                ? 'border-[#FACC15] bg-white shadow-xl scale-[1.02]' 
                                : 'border-transparent bg-white/50 hover:bg-white'
                            }`}
                          >
                            {plan.popular && (
                              <span className="absolute -top-3 right-6 bg-[#FACC15] text-[#141414] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Best Value
                              </span>
                            )}
                            {plan.save && (
                              <span className="absolute -top-3 right-6 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {plan.save}
                              </span>
                            )}
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-[#141414]">{plan.name}</h4>
                                <p className="text-[10px] text-gray-400 uppercase font-mono">{plan.description}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-xl font-bold text-[#141414]">
                                  {isVIP ? 'FREE' : `PKR ${plan.price}`}
                                </span>
                                <span className="text-[10px] text-gray-400 block uppercase font-mono">/ {plan.period}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                selectedPlan === plan.id ? 'bg-[#FACC15]' : 'border-2 border-gray-200'
                              }`}>
                                {selectedPlan === plan.id && <Check size={12} className="text-[#141414]" />}
                              </div>
                              <span className="text-xs font-medium text-gray-600">Select this plan</span>
                            </div>
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleAction}
                        className="w-full mt-8 py-4 bg-[#141414] text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        {isVIP ? <Zap size={18} className="text-[#FACC15]" /> : <CreditCard size={18} />}
                        {isVIP ? 'Free Activation' : 'Activate Plan'}
                      </button>
                    </motion.div>
                  )}

                  {step === 'payment' && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <button 
                        onClick={() => setStep('selection')}
                        className="flex items-center gap-2 text-gray-400 hover:text-[#141414] text-xs mb-6 transition-colors"
                      >
                        <ArrowLeft size={14} /> Back to plans
                      </button>
                      
                      <h3 className="text-xl font-sans font-bold text-[#141414] mb-2">Secure Checkout</h3>
                      <div className="flex gap-2 mb-6">
                        <button 
                          onClick={() => setPaymentMethod('card')}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                            paymentMethod === 'card' ? 'bg-white border-2 border-[#FACC15] text-[#141414] shadow-md' : 'bg-gray-50 border-2 border-transparent text-gray-400'
                          }`}
                        >
                          Card / Global
                        </button>
                        <button 
                          onClick={() => setPaymentMethod('local')}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                            paymentMethod === 'local' ? 'bg-white border-2 border-[#FACC15] text-[#141414] shadow-md' : 'bg-gray-50 border-2 border-transparent text-gray-400'
                          }`}
                        >
                          Local Bank / PK
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mb-6 italic">Paying PKR {activePlan.price} for {activePlan.name} access.</p>

                      <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        {paymentMethod === 'card' ? (
                          <>
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono uppercase text-gray-400 font-bold tracking-widest">Card Details</label>
                              <div className="relative">
                                <input 
                                  required
                                  placeholder="0000 0000 0000 0000"
                                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FACC15] outline-none transition-all placeholder:text-gray-300"
                                />
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-mono uppercase text-gray-400 font-bold tracking-widest">Expiry</label>
                                <input 
                                  required
                                  placeholder="MM/YY"
                                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FACC15] outline-none transition-all placeholder:text-gray-300"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-mono uppercase text-gray-400 font-bold tracking-widest">CVV</label>
                                <div className="relative">
                                  <input 
                                    required
                                    type="password"
                                    maxLength={3}
                                    placeholder="***"
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FACC15] outline-none transition-all placeholder:text-gray-300"
                                  />
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                              </div>
                            </div>
                          </>
                         ) : (
                          <div className="space-y-4 bg-white p-4 rounded-2xl border border-gray-100">
                             <div className="flex items-center gap-3 mb-2">
                               <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                 <Building2 className="text-green-600" size={16} />
                               </div>
                               <div>
                                 <p className="text-[10px] font-bold text-[#141414]">Any Bank Account / Wallet</p>
                                 <p className="text-[8px] text-gray-400 uppercase tracking-widest">EasyPaisa, JazzCash or 1LINK</p>
                               </div>
                             </div>
                             <p className="text-[10px] text-gray-500 leading-relaxed italic">
                               Transfer PKR {activePlan.price} to KnZ official account and enter the transaction ID or account title here for instant verification.
                             </p>
                             <input 
                               required
                               placeholder="Transaction ID / Account Title"
                               className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-[#FACC15] outline-none"
                             />
                          </div>
                        )}

                        <button
                          type="submit"
                          className="w-full mt-6 py-4 bg-[#141414] text-[#FACC15] rounded-2xl font-bold hover:bg-black transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                          <Lock size={16} /> {paymentMethod === 'card' ? 'Pay & Activate' : 'Verify & Activate'}
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {step === 'processing' && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex-1 flex flex-col items-center justify-center text-center"
                    >
                      <Loader2 className="animate-spin text-[#FACC15] mb-6" size={48} />
                      <h3 className="text-xl font-sans font-bold text-[#141414]">Securing your access...</h3>
                      <p className="text-sm text-gray-500 mt-2">KnZ Intelligence is initializing your Pro dashboard.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="mt-auto pt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400">
                  <Shield size={12} />
                  <span>Payments secured by KnZ Shield v2.0</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
