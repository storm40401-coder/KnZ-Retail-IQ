import React, { useState, useEffect } from 'react';
import { X, Save, Package } from 'lucide-react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
  isOpen: boolean;
}

export default function ProductModal({ product, onClose, onSave, isOpen }: ProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: '',
    price: 0,
    stock: 0,
    minStock: 5,
    description: ''
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        sku: 'SKU-' + Math.random().toString(36).substring(7).toUpperCase(),
        category: '',
        price: 0,
        stock: 0,
        minStock: 5,
        description: ''
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FACC15] bg-opacity-10 rounded-2xl flex items-center justify-center">
                    <Package className="text-[#FACC15]" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-sans font-bold text-[#141414]">
                      {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <p className="text-xs text-gray-400 font-mono">STOCK MANAGEMENT SYSTEM</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-gray-400 tracking-widest font-bold">Product Name</label>
                    <input 
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#FACC15] outline-none transition-all"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-gray-400 tracking-widest font-bold">Category</label>
                    <input 
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#FACC15] outline-none transition-all"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-gray-400 tracking-widest font-bold">SKU</label>
                    <input 
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#FACC15] outline-none transition-all font-mono"
                      value={formData.sku}
                      onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-gray-400 tracking-widest font-bold">Price ($)</label>
                    <input 
                      required
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#FACC15] outline-none transition-all"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-gray-400 tracking-widest font-bold">Initial Stock</label>
                    <input 
                      required
                      type="number"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#FACC15] outline-none transition-all"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-gray-400 tracking-widest font-bold">Min. Safety Stock</label>
                    <input 
                      required
                      type="number"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#FACC15] outline-none transition-all"
                      value={formData.minStock}
                      onChange={e => setFormData({ ...formData, minStock: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-400 tracking-widest font-bold">Description (Optional)</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#FACC15] outline-none transition-all resize-none"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="submit"
                    className="flex-1 px-8 py-4 bg-[#FACC15] text-[#141414] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#EAB308] transition-all shadow-xl hover:scale-[1.02]"
                  >
                    <Save size={20} />
                    {product ? 'Update Details' : 'Register Product'}
                  </button>
                  <button 
                    type="button"
                    onClick={onClose}
                    className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
