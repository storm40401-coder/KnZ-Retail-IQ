import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, Github, Chrome, Sparkles, Store, ShieldCheck, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../lib/firebase';
import { FirebaseError } from 'firebase/app';

interface AuthProps {
  onLogin: (email: string) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onLogin(userCredential.user.email || 'user@knz.ai');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        onLogin(userCredential.user.email || 'user@knz.ai');
      }
    } catch (err) {
      const firebaseError = err as FirebaseError;
      setError(firebaseError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin(result.user.email || 'user@knz.ai');
    } catch (err) {
      const firebaseError = err as FirebaseError;
      setError(firebaseError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]"
      >
        {/* Left Side - Brand & Features */}
        <div className="md:w-5/12 bg-[#141414] p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-20%] right-[-20%] w-96 h-96 rounded-full bg-[#FACC15] blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 rounded-full bg-white/10 blur-[80px]"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-[#FACC15] rounded-xl flex items-center justify-center">
                <Store className="text-[#141414]" size={24} />
              </div>
              <span className="font-sans font-bold text-2xl tracking-tight">KnZIQ</span>
            </div>

            <h1 className="text-5xl font-sans font-bold leading-[1.1] mb-8 tracking-tight">
              Retail <span className="text-[#FACC15]">Intelligence</span> for the Modern Era.
            </h1>
            
            <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-md">
              Manage inventory, optimize listings, and scale your store with AI-driven insights.
            </p>

            <div className="space-y-6">
              {[
                { icon: Sparkles, text: "AI-Powered Listing Assistant" },
                { icon: ShieldCheck, text: "Safety Stock & Intelligent Alerts" },
                { icon: Store, text: "Multi-store Synchronization" }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 text-sm font-medium text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <feature.icon size={16} className="text-[#FACC15]" />
                  </div>
                  {feature.text}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/10">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">System Status: Optimal</span>
             </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-7/12 p-12 md:p-20 relative bg-white">
          <div className="max-w-md mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-sans font-bold text-[#141414] mb-2">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-gray-500">
                {isLogin ? 'Enter your credentials to access your store board.' : 'Start your 14-day free trial of KnZ Pro today.'}
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm"
              >
                <AlertCircle size={18} />
                <p>{error}</p>
              </motion.div>
            )}

            <div className="space-y-4 mb-8">
              <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-4 px-6 bg-white border border-gray-200 rounded-2xl flex items-center justify-center gap-3 font-sans font-bold text-[#141414] hover:bg-gray-50 transition-all hover:border-[#141414] active:scale-[0.98] disabled:opacity-50"
              >
                <Chrome size={20} className="text-red-500" />
                Continue with Google
              </button>
              <button 
                disabled={isLoading}
                className="w-full py-4 px-6 bg-white border border-gray-200 rounded-2xl flex items-center justify-center gap-3 font-sans font-bold text-[#141414] hover:bg-gray-50 transition-all hover:border-[#141414] active:scale-[0.98] disabled:opacity-50"
              >
                <Github size={20} />
                Continue with GitHub
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-400 font-mono tracking-widest">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-gray-400 font-bold tracking-widest">Email Address</label>
                <div className="relative">
                  <input 
                    required
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#FACC15] focus:bg-white outline-none transition-all placeholder:text-gray-300"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono uppercase text-gray-400 font-bold tracking-widest">Password</label>
                  {isLogin && <button type="button" className="text-[10px] uppercase font-bold text-[#FACC15] tracking-widest hover:underline">Forgot?</button>}
                </div>
                <div className="relative">
                  <input 
                    required
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#FACC15] focus:bg-white outline-none transition-all placeholder:text-gray-300"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#141414] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isLogin ? 'Sign In to Board' : 'Create My Account'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#141414] font-bold hover:underline"
              >
                {isLogin ? 'Create one now' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
