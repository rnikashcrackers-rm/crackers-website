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
        className={`bg-[#101A36]/90 backdrop-blur-md border border-[#172448] hover:border-[#F7B733]/60 rounded-2xl p-2 sm:p-4 flex gap-2 sm:gap-5 items-center relative transition-all duration-300 shadow-xl ${!product.in_stock ? 'opacity-75' : ''}`}
      >
        {/* Promotional Discount Badge */}
        <div className="absolute top-1.5 left-1.5 z-10 pointer-events-none">
          <span className="bg-[#F7B733] text-[#101A36] text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
            {effectiveDiscount}% OFF
          </span>
        </div>

        {/* Image Frame Deck */}
        <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl bg-[#0B132B] flex items-center justify-center p-1 shrink-0 border border-[#172448] shadow-inner overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name_en}
              fill
              sizes="100px"
              className="object-contain p-1"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg opacity-30">🎇</span>
            </div>
          )}
          
          <div className="absolute bottom-0.5 left-0.5 z-10 flex items-center gap-0.5 bg-[#0B132B]/95 px-1 py-0.2 rounded border border-[#F7B733]/40 text-[6px] font-black text-[#F7B733] tracking-wider uppercase select-none pointer-events-none shadow-sm">
            NIKASH
          </div>
        </div>

        {/* Content Details */}
        <div className="flex-grow min-w-0 pr-1">
          <span className="text-[8px] sm:text-[10px] text-[#F7B733] font-black uppercase tracking-wider block mb-0.5 truncate">
            {product.category}
          </span>
          <h3 className="text-[11px] sm:text-base font-bold text-white leading-tight sm:leading-snug line-clamp-2 hover:text-[#F7B733] transition-colors">
            {product.name_en}
          </h3>
          {product.name_ta && (
            <p className="text-[9px] sm:text-xs text-slate-300 truncate mt-0.5 hidden sm:block">
              {product.name_ta}
            </p>
          )}

          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xs sm:text-lg font-black text-[#F7B733]">₹{product.price}</span>
            <span className="text-[9px] sm:text-xs text-slate-400 line-through">₹{product.mrp}</span>
          </div>
        </div>

        {/* Action Button Area */}
        <div className="shrink-0 w-24 sm:w-36">
          {!product.in_stock ? (
            <span className="w-full min-h-[40px] sm:min-h-[44px] h-10 sm:h-11 bg-[#172448] text-slate-400 border border-[#172448] rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold opacity-60">
              Out of Stock
            </span>
          ) : inCartQty > 0 ? (
            <div className="flex items-center justify-between bg-[#0B132B] rounded-xl border border-[#F7B733]/40 overflow-hidden min-h-[40px] sm:min-h-[44px] h-10 sm:h-11 w-full shadow-sm">
              <button
                onClick={() => updateQuantity(product.id, inCartQty - 1)}
                className="w-8 sm:w-10 min-h-[40px] sm:min-h-[44px] flex justify-center items-center text-slate-300 hover:text-white transition-colors h-full hover:bg-[#172448] cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus size={13} className="sm:w-3.5 sm:h-3.5" />
              </button>
              <div className="flex-grow text-center text-xs font-black text-[#F7B733] h-full flex items-center justify-center border-x border-[#172448] select-none">
                {inCartQty}
              </div>
              <button
                onClick={() => updateQuantity(product.id, inCartQty + 1)}
                className="w-8 sm:w-10 min-h-[40px] sm:min-h-[44px] flex justify-center items-center text-slate-300 hover:text-white transition-colors h-full hover:bg-[#172448] cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus size={13} className="sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          ) : (
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.95 }}
              className={`w-full min-h-[40px] sm:min-h-[44px] h-10 sm:h-11 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                isAdded
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#F7B733] text-[#101A36] hover:bg-[#FFD05C] shadow-md'
              }`}
            >
              {isAdded ? (
                <><Check size={13} className="sm:w-3.5 sm:h-3.5" /> Added</>
              ) : (
                <><ShoppingCart size={13} className="sm:w-3.5 sm:h-3.5" /> Add to Cart</>
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
      className={`bg-[#101A36]/90 backdrop-blur-md border border-[#172448] hover:border-[#F7B733]/60 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between h-full group relative transition-all duration-300 shadow-xl ${!product.in_stock ? 'opacity-75' : ''}`}
    >
      {/* Promotional Discount Badge */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1">
        <span className="bg-[#F7B733] text-[#101A36] text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-md uppercase tracking-wider">
          {effectiveDiscount}% OFF
        </span>
        {product.is_eco_friendly && (
          <span className="bg-emerald-500/20 text-emerald-400 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1 backdrop-blur-md border border-emerald-500/30">
            <Leaf size={10} /> Eco
          </span>
        )}
      </div>

      {/* Right Cart Status Badge */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
        {inCartQty > 0 && !isAdded && (
          <div className="bg-emerald-600 text-white text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-md flex items-center gap-1">
            <Check size={10} /> {inCartQty} in cart
          </div>
        )}
      </div>

      {/* Image Deck */}
      <div className="p-1.5 sm:p-3">
        <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl bg-[#0B132B] overflow-hidden border border-[#172448] flex items-center justify-center p-1.5 sm:p-3">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name_en}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-contain p-1.5 sm:p-2.5 transition-transform duration-500 ${product.in_stock ? 'group-hover:scale-105' : 'opacity-40'}`}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl sm:text-4xl opacity-30">🎇</span>
            </div>
          )}

          {/* Brand Watermark Overlay */}
          <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 z-10 flex items-center gap-0.5 bg-[#0B132B]/95 backdrop-blur-md px-1.5 py-0.5 rounded border border-[#F7B733]/40 text-[7px] sm:text-[8px] font-black text-[#F7B733] tracking-wider sm:tracking-widest shadow-sm uppercase select-none pointer-events-none">
            NIKASH
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-2 sm:p-4 pt-0 flex flex-col flex-1 justify-between">
        <div>
          <div className="text-[8px] sm:text-[10px] text-[#F7B733] font-black mb-0.5 sm:mb-1 uppercase tracking-wider truncate">
            {product.category}
          </div>
          <div className="h-[2.2rem] sm:h-[2.6rem] flex items-center mb-1.5 sm:mb-2">
            <h3 className="text-[10px] sm:text-xs md:text-sm font-bold text-white leading-tight sm:leading-snug line-clamp-2 group-hover:text-[#F7B733] transition-colors">
              {product.name_en}
            </h3>
          </div>
        </div>

        <div className="mt-auto pt-1 sm:pt-2">
          <div className="flex items-baseline gap-1 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-xs sm:text-base md:text-xl font-black text-[#F7B733]">₹{product.price}</span>
            <span className="text-[9px] sm:text-xs text-slate-400 line-through">₹{product.mrp}</span>
          </div>

          <div className="flex items-center w-full">
            {!product.in_stock ? (
              <span className="w-full min-h-[36px] sm:min-h-[44px] h-9 sm:h-11 bg-[#172448] text-slate-400 border border-[#172448] rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold opacity-60">
                Out of Stock
              </span>
            ) : inCartQty > 0 ? (
              <div className="flex items-center justify-between bg-[#0B132B] rounded-xl border border-[#F7B733]/40 overflow-hidden min-h-[36px] sm:min-h-[44px] h-9 sm:h-11 w-full shadow-sm">
                <button
                  onClick={() => updateQuantity(product.id, inCartQty - 1)}
                  className="w-8 sm:w-11 min-h-[36px] sm:min-h-[44px] flex justify-center items-center text-slate-300 hover:text-white transition-colors h-full hover:bg-[#172448] cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus size={12} className="sm:w-3.5 sm:h-3.5" />
                </button>
                <div className="flex-grow text-center text-[10px] sm:text-xs font-black text-[#F7B733] h-full flex items-center justify-center border-x border-[#172448] select-none">
                  {inCartQty}
                </div>
                <button
                  onClick={() => updateQuantity(product.id, inCartQty + 1)}
                  className="w-8 sm:w-11 min-h-[36px] sm:min-h-[44px] flex justify-center items-center text-slate-300 hover:text-white transition-colors h-full hover:bg-[#172448] cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus size={12} className="sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            ) : (
              <motion.button
                onClick={handleAdd}
                whileTap={{ scale: 0.95 }}
                className={`w-full min-h-[36px] sm:min-h-[44px] h-9 sm:h-11 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  isAdded
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-[#F7B733] text-[#101A36] hover:bg-[#FFD05C] shadow-md'
                }`}
              >
                {isAdded ? (
                  <><Check size={12} className="sm:w-3.5 sm:h-3.5" /> Added</>
                ) : (
                  <><ShoppingCart size={12} className="sm:w-3.5 sm:h-3.5" /> Add</>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

