'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface MarqueeBannerProps {
  initialText?: string;
  initialDiscount?: string;
}

export function MarqueeBanner({ initialText, initialDiscount }: MarqueeBannerProps) {
  const [text, setText] = useState<string>(initialText || '');
  const [discount, setDiscount] = useState<string>(initialDiscount || '80');

  useEffect(() => {
    if (!initialText || !initialDiscount) {
      fetch('/api/settings')
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            if (data.marquee) setText(data.marquee);
            if (data.global_discount) setDiscount(data.global_discount);
          }
        })
        .catch((e) => console.error('Failed to load marquee settings:', e));
    }
  }, [initialText, initialDiscount]);

  const rawText = text || 'Welcome to Nikash Crackers Sivakasi - Direct Factory Price Quality Fireworks! Special Festive Discounts & Super Fast Delivery!';
  const formattedText = rawText.includes('{discount}')
    ? rawText.replace(/{discount}/g, discount)
    : rawText;

  return (
    <div className="w-full bg-gradient-to-r from-[#F7B733] via-[#FFD05C] to-[#F7B733] text-[#101A36] py-2.5 px-4 overflow-hidden relative shadow-lg my-6 border-y border-[#F7B733]/50">
      <div className="flex whitespace-nowrap animate-marquee items-center gap-10 font-black text-xs sm:text-sm tracking-wider uppercase select-none">
        <span className="flex items-center gap-2">
          <Sparkles size={16} className="shrink-0 text-[#101A36]" /> {formattedText}
        </span>
        <span className="flex items-center gap-2">
          <Sparkles size={16} className="shrink-0 text-[#101A36]" /> 🔥 SPECIAL FESTIVE DISCOUNT: UP TO {discount}% OFF FLAT!
        </span>
        <span className="flex items-center gap-2">
          <Sparkles size={16} className="shrink-0 text-[#101A36]" /> {formattedText}
        </span>
        <span className="flex items-center gap-2">
          <Sparkles size={16} className="shrink-0 text-[#101A36]" /> 🔥 SPECIAL FESTIVE DISCOUNT: UP TO {discount}% OFF FLAT!
        </span>
      </div>
    </div>
  );
}
