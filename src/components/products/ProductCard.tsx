'use client';

import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart, Leaf, Check } from 'lucide-react';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useEnquiryStore } from '@/lib/store/enquiryStore';
import type { Product } from '@/lib/supabase/types';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const items = useEnquiryStore((state) => state.items);
  const [isAdded, setIsAdded] = useState(false);

  const { addItem, updateQuantity } = useEnquiryStore.getState();

  const cartItem = useMemo(() => items.find(i => String(i.product.id) === String(product.id)), [items, product.id]);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    addItem({ product, quantity: 1 });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const effectiveDiscount = product.discount_percent && product.discount_percent > 0 ? product.discount_percent : 80;

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={product.in_stock ? { x: 4 } : {}}
        transition={{ duration: 0.2 }}
        className={`bg-[#101A36]/90 backdrop-blur-md border border-[#172448] hover:border-[#F7B733]/60 rounded-2xl p-3 sm:p-4 flex gap-3 sm:gap-6 items-center relative transition-all duration-300 shadow-xl ${!product.in_stock ? 'opacity-75' : ''}`}
      >
        {/* Promotional Discount Badge */}
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          <span className="bg-[#F7B733] text-[#101A36] text-[9px] font-black px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">
            {effectiveDiscount}% OFF
          </span>
        </div>

        {/* Image Frame Deck */}
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-[#0B132B] flex items-center justify-center p-1.5 shrink-0 border border-[#172448] shadow-inner overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name_en}
              fill
              sizes="120px"
              className="object-contain p-1.5"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl opacity-30">🎇</span>
            </div>
          )}
          
          <div className="absolute bottom-1 left-1 z-10 flex items-center gap-0.5 bg-[#0B132B]/95 px-1.5 py-0.2 rounded border border-[#F7B733]/40 text-[6px] font-black text-[#F7B733] tracking-wider uppercase select-none pointer-events-none shadow-sm">
            NIKASH
          </div>
        </div>

        {/* Content Details */}
        <div className="flex-grow min-w-0 pr-2">
          <span className="text-[9px] sm:text-[10px] text-[#F7B733] font-black uppercase tracking-widest block mb-0.5">
            {product.category}
          </span>
          <h3 className="text-xs sm:text-base font-bold text-white leading-snug truncate hover:text-[#F7B733] transition-colors">
            {product.name_en}
          </h3>
          {product.name_ta && (
            <p className="text-[10px] sm:text-xs text-slate-300 truncate mt-0.5">
              {product.name_ta}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm sm:text-lg font-black text-[#F7B733]">₹{product.price}</span>
            <span className="text-[10px] sm:text-xs text-slate-400 line-through">₹{product.mrp}</span>
          </div>
        </div>

        {/* Action Button Area */}
        <div className="shrink-0 w-24 sm:w-32">
          {!product.in_stock ? (
            <span className="w-full h-9 bg-[#172448] text-slate-400 border border-[#172448] rounded-xl flex items-center justify-center text-[10px] font-bold opacity-60">
              Out of Stock
            </span>
          ) : inCartQty > 0 ? (
            <div className="flex items-center justify-between bg-[#0B132B] rounded-xl border border-[#F7B733]/40 overflow-hidden h-9 w-full shadow-sm">
              <button
                onClick={() => updateQuantity(product.id, inCartQty - 1)}
                className="w-8 flex justify-center items-center text-slate-300 hover:text-white transition-colors h-full hover:bg-[#172448]"
              >
                <Minus size={12} />
              </button>
              <div className="flex-grow text-center text-xs font-black text-[#F7B733] h-full flex items-center justify-center border-x border-[#172448] select-none">
                {inCartQty}
              </div>
              <button
                onClick={() => updateQuantity(product.id, inCartQty + 1)}
                className="w-8 flex justify-center items-center text-slate-300 hover:text-white transition-colors h-full hover:bg-[#172448]"
              >
                <Plus size={12} />
              </button>
            </div>
          ) : (
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.95 }}
              className={`w-full h-9 rounded-xl flex items-center justify-center gap-1 text-xs font-black transition-all ${
                isAdded
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#F7B733] text-[#101A36] hover:bg-[#FFD05C] shadow-md'
              }`}
            >
              {isAdded ? (
                <><Check size={12} /> Added</>
              ) : (
                <><ShoppingCart size={12} /> Add</>
              )}
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={product.in_stock ? { y: -6 } : {}}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-[#101A36]/90 backdrop-blur-md border border-[#172448] hover:border-[#F7B733]/60 rounded-3xl overflow-hidden flex flex-col group relative transition-all duration-300 shadow-xl ${!product.in_stock ? 'opacity-75' : ''}`}
    >
      {/* Promotional Discount Badge */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        <span className="bg-[#F7B733] text-[#101A36] text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
          {effectiveDiscount}% OFF
        </span>
        {product.is_eco_friendly && (
          <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md border border-emerald-500/30">
            <Leaf size={10} /> Eco
          </span>
        )}
      </div>

      {/* Right Cart Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        {inCartQty > 0 && !isAdded && (
          <div className="bg-emerald-600 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-md flex items-center gap-1">
            <Check size={10} /> {inCartQty} in cart
          </div>
        )}
      </div>

      {/* Image Deck */}
      <div className="p-3">
        <div className="relative w-full aspect-square rounded-2xl bg-[#0B132B] overflow-hidden border border-[#172448] flex items-center justify-center p-3">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name_en}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className={`object-contain p-2.5 transition-transform duration-500 ${product.in_stock ? 'group-hover:scale-105' : 'opacity-40'}`}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl opacity-30">🎇</span>
            </div>
          )}

          {/* Brand Watermark Overlay */}
          <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 bg-[#0B132B]/95 backdrop-blur-md px-2 py-0.5 rounded-md border border-[#F7B733]/40 text-[8px] font-black text-[#F7B733] tracking-widest shadow-sm uppercase select-none pointer-events-none">
            NIKASH CRACKERS
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 pt-0 flex flex-col flex-1">
        <div className="text-[10px] text-[#F7B733] font-black mb-1 uppercase tracking-widest">
          {product.category}
        </div>
        <h3 className="text-sm font-bold text-white mb-2 leading-snug line-clamp-2 group-hover:text-[#F7B733] transition-colors">
          {product.name_en}
        </h3>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg sm:text-xl font-black text-[#F7B733]">₹{product.price}</span>
            <span className="text-xs text-slate-400 line-through">₹{product.mrp}</span>
          </div>

          <div className="flex items-center w-full">
            {!product.in_stock ? (
              <span className="w-full h-10 bg-[#172448] text-slate-400 border border-[#172448] rounded-xl flex items-center justify-center text-xs font-bold opacity-60">
                Out of Stock
              </span>
            ) : inCartQty > 0 ? (
              <div className="flex items-center justify-between bg-[#0B132B] rounded-xl border border-[#F7B733]/40 overflow-hidden h-10 w-full shadow-sm">
                <button
                  onClick={() => updateQuantity(product.id, inCartQty - 1)}
                  className="w-10 flex justify-center items-center text-slate-300 hover:text-white transition-colors h-full hover:bg-[#172448]"
                >
                  <Minus size={12} />
                </button>
                <div className="flex-grow text-center text-xs font-black text-[#F7B733] h-full flex items-center justify-center border-x border-[#172448] select-none">
                  {inCartQty}
                </div>
                <button
                  onClick={() => updateQuantity(product.id, inCartQty + 1)}
                  className="w-10 flex justify-center items-center text-slate-300 hover:text-white transition-colors h-full hover:bg-[#172448]"
                >
                  <Plus size={12} />
                </button>
              </div>
            ) : (
              <motion.button
                onClick={handleAdd}
                whileTap={{ scale: 0.95 }}
                className={`w-full h-10 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black transition-all ${
                  isAdded
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-[#F7B733] text-[#101A36] hover:bg-[#FFD05C] shadow-md'
                }`}
              >
                {isAdded ? (
                  <><Check size={14} /> Added</>
                ) : (
                  <><ShoppingCart size={14} /> Add</>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
