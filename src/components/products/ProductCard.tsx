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

  // Retrieve actions statically to avoid SSR / React 19 hydration issues
  const { addItem, updateQuantity } = useEnquiryStore.getState();

  // Check if this product is already in the cart and get its quantity
  const cartItem = useMemo(() => items.find(i => String(i.product.id) === String(product.id)), [items, product.id]);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    addItem({ product, quantity: 1 });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={product.in_stock ? { x: 4 } : {}}
        transition={{ duration: 0.2 }}
        className={`glass-card glass-shimmer rounded-2xl p-3 sm:p-4 flex gap-3 sm:gap-6 items-center relative transition-opacity duration-300 ${!product.in_stock ? 'opacity-75' : ''}`}
      >
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-0.5 pointer-events-none">
          {product.badge_text && (
            <span className="bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-white text-[6px] sm:text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider border border-white/10">
              {product.badge_text}
            </span>
          )}
        </div>

        {/* Image Frame Deck */}
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-white flex items-center justify-center p-1.5 flex-shrink-0 border border-[#E8E2D8]/50 shadow-inner overflow-hidden">
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
            <div className="absolute inset-0 flex items-center justify-center shimmer">
              <span className="text-xl opacity-30">🎇</span>
            </div>
          )}
          
          {/* Dynamic brand watermark label */}
          <div className="absolute bottom-1 left-1 z-10 flex items-center gap-0.5 bg-white/95 backdrop-blur-xs px-1.5 py-0.2 rounded border border-white/60 text-[5px] font-black text-[#8C1D1D] tracking-wider uppercase select-none pointer-events-none shadow-sm">
            NIKASH
          </div>
        </div>

        {/* Content Details */}
        <div className="flex-grow min-w-0 pr-2">
          <span className="text-[8px] sm:text-[9px] text-[var(--color-coral)] font-bold uppercase tracking-[0.12em] block mb-0.5 sm:mb-1">
            {product.category}
          </span>
          <h3 className="text-xs sm:text-base font-bold text-[var(--text)] leading-snug line-clamp-1 hover:text-[var(--color-coral)] transition-colors">
            {product.name_en}
          </h3>
          {product.name_ta && (
            <p className="text-[10px] sm:text-xs text-[var(--text-muted)] truncate mt-0.5">
              {product.name_ta}
            </p>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2 mt-2">
            <span className="text-sm sm:text-lg font-bold text-[var(--text)]">₹{product.price}</span>
            <span className="text-[9px] sm:text-xs text-[var(--text-muted)] line-through">₹{product.mrp}</span>
            {product.discount_percent && product.discount_percent > 0 && (
              <span className="text-[8px] sm:text-[10px] font-black bg-[#F43F5E]/10 text-[#F43F5E] px-1.5 py-0.5 rounded">
                {product.discount_percent}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Action Button Area */}
        <div className="flex-shrink-0 w-24 sm:w-32">
          {!product.in_stock ? (
            <span className="w-full h-8 sm:h-9 bg-[var(--surface-high)] text-[var(--text-muted)] border border-[var(--border)] rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-bold opacity-60">
              Out of Stock
            </span>
          ) : inCartQty > 0 ? (
            <div className="flex items-center justify-between bg-[var(--surface-high)] rounded-lg border border-[var(--border)] overflow-hidden h-8 sm:h-9 w-full shadow-sm">
              <button
                onClick={() => updateQuantity(product.id, inCartQty - 1)}
                className="w-7 sm:w-9 flex justify-center items-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors h-full hover:bg-[var(--surface-highest)]"
              >
                <Minus size={10} />
              </button>
              <div className="flex-grow text-center text-[10px] sm:text-xs font-bold text-[var(--text)] h-full flex items-center justify-center border-x border-[var(--border)] select-none">
                {inCartQty}
              </div>
              <button
                onClick={() => updateQuantity(product.id, inCartQty + 1)}
                className="w-7 sm:w-9 flex justify-center items-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors h-full hover:bg-[var(--surface-highest)]"
              >
                <Plus size={10} />
              </button>
            </div>
          ) : (
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.95 }}
              className={`w-full h-8 sm:h-9 rounded-lg flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold transition-all duration-300 ${
                isAdded
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-white hover:shadow-md'
              }`}
            >
              {isAdded ? (
                <><Check size={10} /> Added</>
              ) : (
                <><ShoppingCart size={10} /> Add</>
              )}
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={product.in_stock ? { y: -8 } : {}}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-card glass-shimmer rounded-2xl overflow-hidden flex flex-col group relative transition-opacity duration-300 ${!product.in_stock ? 'opacity-75' : ''}`}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1">
        {product.badge_text && (
          <span className="bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-white text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md uppercase tracking-wider border border-white/10">
            {product.badge_text}
          </span>
        )}
        {product.is_eco_friendly && (
          <span className="bg-emerald-500/20 text-emerald-500 text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1 backdrop-blur-sm border border-emerald-500/20">
            <Leaf size={8} className="sm:w-2.5 sm:h-2.5" /> Eco
          </span>
        )}
        {!product.in_stock && (
          <span className="bg-rose-500/90 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1 backdrop-blur-sm border border-rose-500/20 uppercase tracking-wider shadow-md">
            Out of Stock
          </span>
        )}
      </div>

      {/* Right Badges */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex flex-col gap-1 items-end">
        {product.discount_percent && product.discount_percent > 0 && (!product.badge_text || !product.badge_text.includes(`${product.discount_percent}%`)) && (
          <div className="bg-[#F43F5E] text-white text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-md">
            {product.discount_percent}% OFF
          </div>
        )}
        {inCartQty > 0 && !isAdded && (
          <div className="bg-emerald-500 text-white text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-md flex items-center gap-0.5 sm:gap-1">
            <Check size={8} className="sm:w-2.5 sm:h-2.5" /> {inCartQty} in cart
          </div>
        )}
      </div>

      {/* Image Frame Deck (New framed style) */}
      <div className="p-3">
        <div className="relative w-full aspect-square rounded-2xl bg-white overflow-hidden shadow-inner border border-[#E8E2D8]/45 flex items-center justify-center p-3">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name_en}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-contain p-2.5 transition-all duration-500 ${product.in_stock ? 'group-hover:scale-105' : 'opacity-40 grayscale-[20%]'}`}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center shimmer">
              <span className="text-4xl opacity-30">🎇</span>
            </div>
          )}
          {/* Gradient overlay on hover */}
          {product.in_stock && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          )}

          {/* Dynamic Brand Watermark Overlay Stamp */}
          <div className="absolute bottom-2 left-2 z-10 flex items-center gap-0.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/60 text-[7px] font-black text-[#8C1D1D] tracking-wider shadow-sm uppercase select-none pointer-events-none">
            <span>🎇</span> NIKASH CRACKERS
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-4 pt-0 sm:pt-0 flex flex-col flex-grow">
        <div className="text-[9px] sm:text-[10px] text-[var(--color-coral)] font-bold mb-0.5 sm:mb-1 uppercase tracking-[0.15em] leading-normal">
          {product.category}
        </div>
        <h3 className={`text-xs sm:text-sm font-bold text-[var(--text)] mb-2 sm:mb-3 leading-normal pb-0.5 line-clamp-2 transition-colors ${product.in_stock ? 'group-hover:text-[var(--color-coral)]' : 'opacity-70'}`}>
          {product.name_en}
        </h3>

        <div className="mt-auto">
          <div className="flex items-end gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
            <span className="text-base sm:text-xl font-bold text-[var(--text)]">₹{product.price}</span>
            <span className="text-[10px] sm:text-xs text-[var(--text-muted)] line-through mb-0.5">₹{product.mrp}</span>
          </div>

          <div className="flex items-center w-full">
            {!product.in_stock ? (
              <span className="w-full h-8 sm:h-9 bg-[var(--surface-high)] text-[var(--text-muted)] border border-[var(--border)] rounded-lg flex items-center justify-center text-[11px] sm:text-xs font-bold opacity-60">
                Out of Stock
              </span>
            ) : inCartQty > 0 ? (
              /* Inline Quantity Controller directly on the card */
              <div className="flex items-center justify-between bg-[var(--surface-high)] rounded-lg border border-[var(--border)] overflow-hidden h-8 sm:h-9 w-full shadow-sm">
                <button
                  onClick={() => updateQuantity(product.id, inCartQty - 1)}
                  className="w-8 flex justify-center items-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors h-full hover:bg-[var(--surface-highest)]"
                >
                  <Minus size={10} className="sm:w-3 sm:h-3" />
                </button>
                <div className="flex-grow text-center text-[11px] sm:text-xs font-bold text-[var(--text)] h-full flex items-center justify-center border-x border-[var(--border)] select-none">
                  {inCartQty}
                </div>
                <button
                  onClick={() => updateQuantity(product.id, inCartQty + 1)}
                  className="w-8 flex justify-center items-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors h-full hover:bg-[var(--surface-highest)]"
                >
                  <Plus size={10} className="sm:w-3 sm:h-3" />
                </button>
              </div>
            ) : (
              /* Clean "Add" Button */
              <motion.button
                onClick={handleAdd}
                whileTap={{ scale: 0.95 }}
                className={`w-full h-8 sm:h-9 rounded-lg flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold transition-all duration-300 ${
                  isAdded
                    ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-white hover:shadow-md'
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
