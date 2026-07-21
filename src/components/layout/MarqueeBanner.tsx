'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export function MarqueeBanner() {
  const [text, setText] = useState<string>('');
  const [discount, setDiscount] = useState<string>('80');

  const fetchMarquee = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data) {
          if (data.marquee) setText(data.marquee);
          if (data.global_discount) setDiscount(data.global_discount);
        }
      }
    } catch (e) {
      console.error('Failed to load marquee settings:', e);
    }
  };

  useEffect(() => {
    fetchMarquee();
    // Poll every 10s for instant admin update propagation
    const interval = setInterval(fetchMarquee, 10000);
    return () => clearInterval(interval);
  }, []);

  // Format text: replace {discount} or any percentage pattern with dynamic global discount
  const rawText = text || 'Welcome to Nikash Crackers Sivakasi - Direct Factory Price Quality Fireworks! We Give Special Festive Discounts! Buy More Save More!';
  const formattedText = rawText.includes('{discount}')
    ? rawText.replace(/{discount}/g, discount)
    : rawText;

  return (
    <div className="bg-gradient-to-r from-[#F7B733] via-[#FFD05C] to-[#F7B733] text-[#101A36] py-1.5 px-4 overflow-hidden relative border-b border-[#F7B733]/40 shadow-sm z-50">
      <div className="flex whitespace-nowrap animate-marquee items-center gap-8 font-black text-[11px] sm:text-xs tracking-wider uppercase select-none">
        <span className="flex items-center gap-2">
          <Sparkles size={14} className="shrink-0 text-[#101A36]" /> {formattedText}
        </span>
        <span className="flex items-center gap-2">
          <Sparkles size={14} className="shrink-0 text-[#101A36]" /> 🔥 SPECIAL FESTIVE DISCOUNT: UP TO {discount}% OFF FLAT!
        </span>
        <span className="flex items-center gap-2">
          <Sparkles size={14} className="shrink-0 text-[#101A36]" /> {formattedText}
        </span>
        <span className="flex items-center gap-2">
          <Sparkles size={14} className="shrink-0 text-[#101A36]" /> 🔥 SPECIAL FESTIVE DISCOUNT: UP TO {discount}% OFF FLAT!
        </span>
      </div>
    </div>
  );
}
