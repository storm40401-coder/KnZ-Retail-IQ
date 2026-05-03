import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, AlertCircle, Edit2, Sparkles, Zap, Lock } from 'lucide-react';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface InventoryGridProps {
  products: Product[];
  onOptimize: (product: Product) => void;
  onEdit: (product: Product) => void;
  onAdd: () => void;
  isPro: boolean;
  onUpgrade: () => void;
}

export default function InventoryGrid({ products, onOptimize, onEdit, onAdd, isPro, onUpgrade }: InventoryGridProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#F5F5F0] min-h-screen p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-sans font-bold text-[#141414]">Master Inventory</h1>
          <p className="text-[10px] md:text-sm text-gray-500 font-mono italic">Product Catalog & SKU Tracking</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search SKU or Product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 md:py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FACC15] transition-all w-full md:w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex-1 md:flex-none p-3 md:p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex justify-center">
              <Filter size={20} className="text-gray-600" />
            </button>
            <button 
              onClick={onAdd}
              className="flex-3 md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:py-2 bg-[#141414] text-white rounded-xl hover:bg-black transition-all text-sm font-semibold active:scale-[0.98]"
            >
              <Plus size={18} />
              <span>New Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-bottom border-gray-100 bg-[#FAFAFA]">
                <th className="px-6 py-4 text-[11px] font-mono font-medium text-gray-400 uppercase tracking-widest italic">Product</th>
                <th className="px-6 py-4 text-[11px] font-mono font-medium text-gray-400 uppercase tracking-widest italic">SKU / ID</th>
                <th className="px-6 py-4 text-[11px] font-mono font-medium text-gray-400 uppercase tracking-widest italic">Availability</th>
                <th className="px-6 py-4 text-[11px] font-mono font-medium text-gray-400 uppercase tracking-widest italic">Price</th>
                <th className="px-6 py-4 text-[11px] font-mono font-medium text-gray-400 uppercase tracking-widest italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product, i) => {
                const isLowStock = product.stock <= product.minStock;
                return (
                  <motion.tr 
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-[#141414]">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{product.sku}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm font-bold",
                          isLowStock ? "text-red-500" : "text-gray-900"
                        )}>
                          {product.stock}
                        </span>
                        {isLowStock && (
                          <AlertCircle size={14} className="text-red-500" />
                        )}
                        <span className="text-[10px] text-gray-400 font-mono"> / MIN {product.minStock}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold">${product.price.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onOptimize(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group/tooltip relative"
                          title="Optimize Listing"
                        >
                          <Sparkles size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            if (!isPro) {
                              onUpgrade();
                            } else {
                              // Logic for Pro forecast
                              alert("Pulse Forecast: This SKU is predicted to see a 20% spike in demand next week based on trending sentiment.");
                            }
                          }}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            isPro ? "text-purple-600 hover:bg-purple-50" : "text-gray-200"
                          )}
                          title="Pulse Forecast"
                        >
                          {isPro ? <Zap size={18} /> : <Lock size={14} />}
                        </button>
                        <button 
                          onClick={() => onEdit(product)}
                          className="p-2 text-gray-400 hover:text-[#141414] hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredProducts.map((product, i) => {
          const isLowStock = product.stock <= product.minStock;
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[#141414]">{product.name}</h3>
                  <p className="text-xs text-gray-500 uppercase font-mono tracking-wider">{product.category}</p>
                </div>
                <span className="text-xs font-mono font-bold bg-gray-50 text-gray-400 px-2 py-1 rounded">
                  {product.sku}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-y border-gray-50">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 uppercase font-mono">Stock Level</p>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-lg font-bold",
                      isLowStock ? "text-red-500" : "text-[#141414]"
                    )}>
                      {product.stock}
                    </span>
                    {isLowStock && <AlertCircle size={14} className="text-red-500" />}
                    <span className="text-xs text-gray-400 font-mono">/ {product.minStock}</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] text-gray-400 uppercase font-mono">Unit Price</p>
                  <p className="text-lg font-bold text-[#141414]">${product.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                <button 
                  onClick={() => onOptimize(product)}
                  className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs"
                >
                  <Sparkles size={14} />
                  Optimize
                </button>
                <button 
                  onClick={() => {
                    if (!isPro) {
                      onUpgrade();
                    } else {
                      alert("Pulse Forecast: This SKU is predicted to see a 20% spike in demand next week.");
                    }
                  }}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs",
                    isPro ? "bg-purple-50 text-purple-600" : "bg-gray-50 text-gray-200"
                  )}
                >
                  {isPro ? <Zap size={14} /> : <Lock size={12} />}
                  Forecast
                </button>
                <button 
                  onClick={() => onEdit(product)}
                  className="flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold text-xs"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
        
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center text-gray-400 italic font-sans">
            No products found matching your search criteria.
          </div>
        )}
    </div>
  );
}
