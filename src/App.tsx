/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InventoryGrid from './components/InventoryGrid';
import ListingOptimizer from './components/ListingOptimizer';
import ProductModal from './components/ProductModal';
import SubscriptionModal from './components/SubscriptionModal';
import Financials from './components/Financials';
import MarketInsights from './components/MarketInsights';
import Auth from './components/Auth';
import { Product, View, InventoryStats, PLAN_LIMITS, UserUsage } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, Menu, X, Lock, Loader2 } from 'lucide-react';
import { auth, onAuthStateChanged, firebaseSignOut } from './lib/firebase';

// Mock Initial Data - Starting empty for the user
const INITIAL_PRODUCTS: Product[] = [];

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [optimizingProduct, setOptimizingProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<string | null>(null);
  const [isPlanExpired, setIsPlanExpired] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [usage, setUsage] = useState<UserUsage>({
    aiOptimizations: 0,
    marketReports: 0,
    forecasts: 0
  });

  const owners = useMemo(() => [
    'storm40401@gmail.com', 
    'mibrahim.acca@gmail.com', 
    'knzassociates@gmail.com', 
    'stormlightning10000@gmail.com', 
    'knzcollections011@gmail.com', 
    'luxyrontimepieces@gmail.com'
  ], []);

  const isVIP = useMemo(() => userEmail ? owners.includes(userEmail) : false, [userEmail, owners]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        handleLogin(user.email || 'user@knz.ai');
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
      }
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const stats = useMemo<InventoryStats>(() => {
    const totalItems = products.length;
    const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
    const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
    
    const cats: Record<string, number> = {};
    products.forEach(p => {
      cats[p.category] = (cats[p.category] || 0) + 1;
    });

    return {
      totalItems,
      totalValue,
      lowStockCount,
      categoryDistribution: Object.entries(cats).map(([name, value]) => ({ name, value }))
    };
  }, [products]);

  const handleOptimize = (product: Product) => {
    setOptimizingProduct(product);
    // Track usage for analytics even if unlimited
    setUsage(prev => ({ ...prev, aiOptimizations: prev.aiOptimizations + 1 }));
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (formData: Partial<Product>) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...formData, lastUpdated: new Date().toISOString() } as Product : p));
    } else {
      const newProduct: Product = {
        ...formData,
        id: Math.random().toString(36).substring(7),
        lastUpdated: new Date().toISOString()
      } as Product;
      setProducts([...products, newProduct]);
    }
    setIsProductModalOpen(false);
  };

  const handleSubscribe = (plan: 'weekly' | 'monthly' | 'yearly') => {
    setIsPro(true);
    setIsPlanExpired(false);
    const now = new Date();
    let expiry = new Date();
    
    if (plan === 'weekly') expiry.setDate(now.getDate() + 7);
    if (plan === 'monthly') expiry.setMonth(now.getMonth() + 1);
    if (plan === 'yearly') expiry.setFullYear(now.getFullYear() + 1);
    
    setSubscriptionExpiry(expiry.toISOString());
    setIsSubscriptionModalOpen(false);
  };

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    
    // Auto-activate Pro for owners with far-future expiry
    if (owners.includes(email)) {
      setIsPro(true);
      setSubscriptionExpiry(new Date(2099, 11, 31).toISOString());
    } else {
      // Deactivate Pro for non-owners regardless of previous state for now
      setIsPro(false);
      setSubscriptionExpiry(null);
      setIsPlanExpired(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      setIsAuthenticated(false);
      setUserEmail(null);
      setIsPro(false);
      setIsPlanExpired(false);
      setCurrentView('dashboard');
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#141414]" size={40} />
          <p className="text-sm font-mono uppercase tracking-widest text-gray-400">Verifying Identity...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen relative">
      <AnimatePresence>
        {isPlanExpired && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-[#141414]/90 backdrop-blur-xl flex items-center justify-center p-6 text-center"
          >
            <div className="max-w-md bg-white p-10 rounded-[3rem] shadow-2xl">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="text-red-500" size={32} />
              </div>
              <h2 className="text-2xl font-sans font-bold text-[#141414] mb-4">Plan Expired</h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                Your KnZ Pro plan has expired. To prevent data lockout and maintain access to your intelligence tools, please renew your subscription.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="w-full py-4 bg-[#141414] text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95"
                >
                  Renew Now
                </button>
                <button 
                  onClick={handleSignOut}
                  className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all active:scale-95"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        currentView={currentView} 
        onViewChange={(view) => {
          if (isPlanExpired) return;
          setCurrentView(view);
          closeSidebar();
        }} 
        onUpgrade={() => {
          setIsSubscriptionModalOpen(true);
          closeSidebar();
        }}
        onSignOut={handleSignOut}
        isPro={isPro}
        isVIP={isVIP}
      />
      
      <main className="lg:ml-64 flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-[#141414] text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FACC15] rounded-lg flex items-center justify-center">
              <Sparkles className="text-[#141414]" size={18} />
            </div>
            <span className="font-bold tracking-tight">KnZIQ</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Dashboard products={products} stats={stats} />
            </motion.div>
          )}

          {currentView === 'inventory' && (
            <motion.div
              key="inventory"
               initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <InventoryGrid 
                products={products} 
                onOptimize={handleOptimize}
                onEdit={handleEdit}
                onAdd={handleAdd}
                isPro={isPro}
                onUpgrade={() => setIsSubscriptionModalOpen(true)}
              />
            </motion.div>
          )}

          {currentView === 'financials' && (
            <motion.div
              key="financials"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Financials isPro={isPro} onUpgrade={() => setIsSubscriptionModalOpen(true)} />
            </motion.div>
          )}

          {currentView === 'optimizer' && (
             <motion.div
              key="optimizer-landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 h-screen flex flex-col items-center justify-center text-center max-w-4xl mx-auto"
            >
              <div className="w-24 h-24 bg-[#141414] rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl relative">
                <Sparkles size={40} className="text-[#FACC15]" />
                <div className="absolute -top-2 -right-2 bg-[#FACC15] text-[#141414] text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">AI</div>
              </div>
              <h1 className="text-4xl font-sans font-bold tracking-tight text-[#141414]">KnZ Listing Intelligence</h1>
              <p className="text-gray-500 mt-4 max-w-md leading-relaxed">
                Select a product from your inventory to optimize its market positioning using KnZ's pulse-aware Gemini model.
              </p>
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                 <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-left flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#141414] opacity-40">Monthly Usage</span>
                      <span className="text-xs font-bold font-mono text-[#141414]">
                        {usage.aiOptimizations} / ∞
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-1000 ease-out" 
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                 </div>
                 <button 
                  onClick={() => setCurrentView('inventory')}
                  className="group px-8 py-4 bg-[#141414] text-white rounded-[2rem] font-bold hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                >
                  Browse Inventory 
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {currentView === 'market-insights' && (
            <motion.div
              key="market-insights"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <MarketInsights 
                isPro={isPro} 
                onUpgrade={() => setIsSubscriptionModalOpen(true)} 
                usage={usage}
                onUseReport={() => setUsage(prev => ({ ...prev, marketReports: prev.marketReports + 1 }))}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {optimizingProduct && (
        <ListingOptimizer 
          product={optimizingProduct} 
          onClose={() => setOptimizingProduct(null)} 
        />
      )}

      <ProductModal 
        isOpen={isProductModalOpen}
        product={editingProduct}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onSubscribe={handleSubscribe}
        userEmail={userEmail || undefined}
      />
    </div>
  );
}

