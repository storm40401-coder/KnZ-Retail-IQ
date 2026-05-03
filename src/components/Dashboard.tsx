import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Package, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp,
  Package2,
  Box
} from 'lucide-react';
import { Product, InventoryStats } from '../types';
import { motion } from 'motion/react';

interface DashboardProps {
  products: Product[];
  stats: InventoryStats;
}

const COLORS = ['#141414', '#FACC15', '#5A5A40', '#4a4a4a'];

export default function Dashboard({ products, stats }: DashboardProps) {
  return (
    <div className="space-y-6 lg:space-y-8 p-4 md:p-6 lg:p-8 bg-[#F5F5F5] min-h-screen">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-4xl font-sans font-semibold tracking-tight text-[#141414]">
          Command Center
        </h1>
        <p className="text-[10px] md:text-sm font-sans text-gray-500 uppercase tracking-[0.2em]">
          KnZ Intelligence Overview
        </p>
      </header>

      {products.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-12 rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 text-gray-400">
            <Package size={32} />
          </div>
          <h3 className="text-xl font-sans font-bold text-[#141414]">No Inventory Found</h3>
          <p className="text-gray-500 mt-2 max-w-sm">
            Ready to scale? Add your first product to see intelligence insights and marketing optimizations.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[
              { label: 'Total Items', value: stats.totalItems, icon: Package, color: 'text-blue-600' },
              { label: 'Inventory Value', value: `$${stats.totalValue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
              { label: 'Low Stock Alerts', value: stats.lowStockCount, icon: AlertTriangle, color: 'text-yellow-500' },
              { label: 'Categories', value: stats.categoryDistribution.length, icon: Box, color: 'text-purple-600' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0"
              >
                <div>
                  <p className="text-[9px] md:text-xs font-mono uppercase text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-xl md:text-2xl font-sans font-bold text-[#141414] truncate">{stat.value}</p>
                </div>
                <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl ${stat.color} bg-opacity-10 self-start md:self-auto`}>
                  <stat.icon size={20} className="md:w-6 md:h-6" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Distribution */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                 <h3 className="text-base md:text-lg font-sans font-semibold flex items-center gap-2">
                   <Package2 size={18} className="text-[#FACC15]" />
                   Inventory Allocation
                 </h3>
                 <span className="text-[10px] font-mono text-gray-400">BY CATEGORY</span>
              </div>
              <div className="h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Stock Level Trends */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                 <h3 className="text-base md:text-lg font-sans font-semibold flex items-center gap-2">
                   <TrendingUp size={18} className="text-green-500" />
                   Stock Levels
                 </h3>
                 <span className="text-[10px] font-mono text-gray-400">TOP 5 ITEMS</span>
              </div>
              <div className="h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={products.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fill: '#9CA3AF' }}
                      interval={0}
                      hide={window.innerWidth < 768}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9CA3AF' }} />
                    <Tooltip 
                       cursor={{ fill: 'rgba(250, 204, 21, 0.05)' }}
                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    />
                    <Bar dataKey="stock" fill="#141414" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Critical Stock Alert */}
          {stats.lowStockCount > 0 && (
            <section className="bg-[#141414] text-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-sans font-bold flex items-center justify-center md:justify-start gap-3">
                  <AlertTriangle className="text-[#FACC15]" />
                  Action Required
                </h2>
                <p className="text-gray-400 text-xs md:text-sm mt-1">You have {stats.lowStockCount} items below minimum safety levels.</p>
              </div>
              <button className="w-full md:w-auto px-8 py-3 bg-[#FACC15] hover:bg-[#EAB308] transition-colors rounded-2xl font-sans font-bold text-sm text-[#141414] active:scale-[0.98]">
                Optimize Supply Chain
              </button>
            </section>
          )}
        </>
      )}
    </div>
  );
}
