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
  const addItem = useEnquiryStore((state) => state.addItem);
  const updateQuantity = useEnquiryStore((state) => state.updateQuantity);
  const [isAdded, setIsAdded] = useState(false);

  const cartItem = useMemo(() => items.find(i => String(i.product.id) === String(product.id)), [items, product.id]);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    // Guard: if already in cart (race condition safety), just increment qty
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    } else {
      addItem({ product, quantity: 1 });
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const effectiveDiscount = product.discount_percent && product.discount_percent > 0 ? product.discount_percent : 80;

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={product.in_stock ? { x: 4 } : {}}
        transition={{ duration: 0.2 }}
        className={`bg-[#101A36]/90 backdrop-blur-md border border-[#172448] hover:border-[#F7B733]/60 rounded-xl p-1.5 sm:p-3.5 flex gap-1.5 sm:gap-4 items-center relative transition-all duration-300 shadow-xl min-w-0 w-full overflow-hidden ${!product.in_stock ? 'opacity-75' : ''}`}
      >
        {/* Promotional Discount Badge */}
        <div className="absolute top-1 left-1 z-10 pointer-events-none">
          <span className="bg-[#F7B733] text-[#101A36] text-[7.5px] sm:text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-md uppercase tracking-wider">
            {effectiveDiscount}% OFF
          </span>
        </div>

        {/* Image Frame Deck */}
        <div className="relative w-12 h-12 sm:w-20 sm:h-20 rounded-lg bg-[#0B132B] flex items-center justify-center p-0.5 shrink-0 border border-[#172448] shadow-inner overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name_en}
              fill
              sizes="80px"
              className="object-contain p-0.5"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base opacity-30">🎇</span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="flex-1 min-w-0 w-0 pr-0.5">
          <span className="text-[7.5px] sm:text-[9.5px] text-[#F7B733] font-black uppercase tracking-wider block mb-0.5 truncate">
            {product.category}
          </span>
          <h3 className="text-[10px] sm:text-sm font-bold text-white leading-tight sm:leading-snug line-clamp-2 hover:text-[#F7B733] transition-colors break-words">
            {product.name_en}
          </h3>

          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-[11px] sm:text-base font-black text-[#F7B733]">₹{product.price}</span>
            <span className="text-[8px] sm:text-xs text-slate-400 line-through">₹{product.mrp}</span>
          </div>
        </div>

        {/* Action Button Area */}
        <div className="shrink-0 w-[76px] sm:w-32 flex items-center justify-end">
          {!product.in_stock ? (
            <span className="w-full min-h-[36px] sm:min-h-[40px] h-9 sm:h-10 bg-[#172448] text-slate-400 border border-[#172448] rounded-lg flex items-center justify-center text-[9px] sm:text-xs font-bold opacity-60">
              Out
            </span>
          ) : inCartQty > 0 ? (
            <div className="flex items-center justify-between bg-[#0B132B] rounded-lg border border-[#F7B733]/40 overflow-hidden min-h-[36px] sm:min-h-[40px] h-9 sm:h-10 w-full shadow-sm">
              <button
                onClick={() => updateQuantity(product.id, inCartQty - 1)}
                className="w-6 sm:w-9 min-h-[36px] sm:min-h-[40px] flex justify-center items-center text-slate-300 hover:text-white transition-colors h-full hover:bg-[#172448] cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus size={11} className="sm:w-3.5 sm:h-3.5" />
              </button>
              <div className="flex-grow text-center text-[10.5px] sm:text-xs font-black text-[#F7B733] h-full flex items-center justify-center border-x border-[#172448] select-none">
                {inCartQty}
              </div>
              <button
                onClick={() => updateQuantity(product.id, inCartQty + 1)}
                className="w-6 sm:w-9 min-h-[36px] sm:min-h-[40px] flex justify-center items-center text-slate-300 hover:text-white transition-colors h-full hover:bg-[#172448] cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus size={11} className="sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          ) : (
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.95 }}
              className={`w-full min-h-[36px] sm:min-h-[40px] h-9 sm:h-10 rounded-lg flex items-center justify-center gap-0.5 sm:gap-1 text-[9.5px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-md ${
                isAdded
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#F7B733] text-[#101A36] hover:bg-[#FFD05C] shadow-md'
              }`}
            >
              {isAdded ? (
                <><Check size={11} className="sm:w-3.5 sm:h-3.5" /> Added</>
              ) : (
                <><ShoppingCart size={11} className="sm:w-3.5 sm:h-3.5" /> Add</>
              )}
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={product.in_stock ? { y: -4 } : {}}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-[#101A36]/90 backdrop-blur-md border border-[#172448] hover:border-[#F7B733]/60 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between h-full min-w-0 w-full group relative transition-all duration-300 shadow-xl ${!product.in_stock ? 'opacity-75' : ''}`}
    >
      {/* Promotional Discount Badge */}
      <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10 flex flex-col gap-1">
        <span className="bg-[#F7B733] text-[#101A36] text-[7.5px] sm:text-[9.5px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">
          {effectiveDiscount}% OFF
        </span>
        {product.is_eco_friendly && (
          <span className="bg-emerald-500/20 text-emerald-400 text-[7.5px] sm:text-[8.5px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 backdrop-blur-md border border-emerald-500/30">
            <Leaf size={9} /> Eco
          </span>
        )}
      </div>

      {/* Right Cart Status Badge */}
      <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10">
        {inCartQty > 0 && !isAdded && (
          <div className="bg-emerald-600 text-white text-[7.5px] sm:text-[9.5px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
            <Check size={9} /> {inCartQty} in cart
          </div>
        )}
      </div>

      {/* Image Deck */}
      <div className="p-1 sm:p-2.5">
        <div className="relative w-full aspect-square rounded-lg sm:rounded-xl bg-[#0B132B] overflow-hidden border border-[#172448] flex items-center justify-center p-1 sm:p-2">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name_en}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-contain p-1 sm:p-2 transition-transform duration-500 ${product.in_stock ? 'group-hover:scale-105' : 'opacity-40'}`}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl sm:text-3xl opacity-30">🎇</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-1.5 sm:p-3 pt-0 flex flex-col flex-1 justify-between min-w-0 w-full">
        <div>
          <div className="text-[7.5px] sm:text-[9.5px] text-[#F7B733] font-black mb-0.5 uppercase tracking-wider truncate">
            {product.category}
          </div>
          <div className="h-[2rem] sm:h-[2.4rem] flex items-center mb-1 min-w-0 w-full">
            <h3 className="text-[9.5px] sm:text-xs md:text-sm font-bold text-white leading-tight sm:leading-snug line-clamp-2 group-hover:text-[#F7B733] transition-colors break-words">
              {product.name_en}
            </h3>
          </div>
        </div>

        <div className="mt-auto pt-1 w-full shrink-0 min-w-0">
          <div className="flex items-baseline gap-1 sm:gap-1.5 mb-1.5">
            <span className="text-xs sm:text-base md:text-lg font-black text-[#F7B733]">₹{product.price}</span>
            <span className="text-[8.5px] sm:text-xs text-slate-400 line-through">₹{product.mrp}</span>
          </div>

          <div className="flex items-center w-full min-w-0 shrink-0">
            {!product.in_stock ? (
              <span className="w-full min-h-[36px] sm:min-h-[40px] h-9 sm:h-10 bg-[#172448] text-slate-400 border border-[#172448] rounded-lg sm:rounded-xl flex items-center justify-center text-[9.5px] sm:text-xs font-bold opacity-60">
                Out of Stock
              </span>
            ) : inCartQty > 0 ? (
              <div className="flex items-center justify-between bg-[#0B132B] rounded-lg sm:rounded-xl border border-[#F7B733]/40 overflow-hidden min-h-[36px] sm:min-h-[40px] h-9 sm:h-10 w-full shadow-sm">
                <button
                  onClick={() => updateQuantity(product.id, inCartQty - 1)}
                  className="w-7 sm:w-10 min-h-[36px] sm:min-h-[40px] flex justify-center items-center text-slate-300 hover:text-white transition-colors h-full hover:bg-[#172448] cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus size={11} className="sm:w-3.5 sm:h-3.5" />
                </button>
                <div className="flex-grow text-center text-[10.5px] sm:text-xs font-black text-[#F7B733] h-full flex items-center justify-center border-x border-[#172448] select-none">
                  {inCartQty}
                </div>
                <button
                  onClick={() => updateQuantity(product.id, inCartQty + 1)}
                  className="w-7 sm:w-10 min-h-[36px] sm:min-h-[40px] flex justify-center items-center text-slate-300 hover:text-white transition-colors h-full hover:bg-[#172448] cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus size={11} className="sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            ) : (
              <motion.button
                onClick={handleAdd}
                whileTap={{ scale: 0.95 }}
                className={`w-full min-h-[36px] sm:min-h-[40px] h-9 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center gap-1 text-[9.5px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-md ${
                  isAdded
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-[#F7B733] text-[#101A36] hover:bg-[#FFD05C] shadow-md'
                }`}
              >
                {isAdded ? (
                  <><Check size={11} className="sm:w-3.5 sm:h-3.5" /> Added</>
                ) : (
                  <><ShoppingCart size={11} className="sm:w-3.5 sm:h-3.5" /> Add</>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

