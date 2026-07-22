'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useEnquiryStore } from '@/lib/store/enquiryStore';

export function MobileStickyCartBar() {
  const [mounted, setMounted] = useState(false);
  const [minOrderValue, setMinOrderValue] = useState(2000);
  
  const items = useEnquiryStore((state) => state.items);
  const getTotal = useEnquiryStore((state) => state.getTotal);

  useEffect(() => {
    setMounted(true);
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.min_order_value) {
          setMinOrderValue(parseInt(data.min_order_value) || 2000);
        }
      })
      .catch(() => {});
  }, []);

  if (!mounted || items.length === 0) return null;

  const itemCount = items.length; // Unique item count per spec
  const netSubtotal = getTotal();
  const progressPercent = Math.min(100, Math.round((netSubtotal / minOrderValue) * 100));
  const isMinReached = netSubtotal >= minOrderValue;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#101A36]/95 backdrop-blur-xl border-t border-[#F7B733]/40 p-3 sm:p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
      {/* Dynamic Order Minimum Progress Line */}
      <div className="w-full bg-[#0B132B] h-1.5 rounded-full overflow-hidden mb-2.5 border border-[#172448]">
        <div 
          className={`h-full transition-all duration-500 ${isMinReached ? 'bg-emerald-400' : 'bg-gradient-to-r from-[#F7B733] to-[#FFD05C]'}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#F7B733] text-[#101A36] flex items-center justify-center font-black shadow-md">
              <ShoppingCart size={18} />
            </div>
            <span className="absolute -top-1.5 -right-1.5 bg-[#D95136] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-[#101A36] shadow-sm">
              {itemCount}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-slate-300 font-bold">Total:</span>
              <span className="text-base font-black text-[#F7B733]">₹{netSubtotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              {isMinReached ? (
                <span className="text-emerald-400 font-bold">✓ Min Order Met</span>
              ) : (
                `Add ₹${(minOrderValue - netSubtotal).toLocaleString('en-IN')} more`
              )}
            </p>
          </div>
        </div>

        <Link
          href="/enquiry"
          className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#F7B733] px-4 py-2.5 text-xs font-black text-[#101A36] hover:bg-[#FFD05C] transition-all active:scale-95 shadow-lg min-h-[42px]"
        >
          <span>Checkout</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
