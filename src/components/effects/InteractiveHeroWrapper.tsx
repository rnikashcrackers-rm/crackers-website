'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { RealisticFirework } from './RealisticFirework';

export function InteractiveHeroWrapper({ children }: { children: React.ReactNode }) {
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number; type: 'burst' | 'fountain' | 'spin' | 'sparkle'; color: string }>>([]);

  useEffect(() => {
    // Launch festive firework bursts on page entry — lazy load canvas-confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
    
    let interval: ReturnType<typeof setInterval>;
    
    // Defer loading slightly to let initial paint happen first
    const timer = setTimeout(() => {
      interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        
        const particleCount = 30 * (timeLeft / duration);
        
        import('canvas-confetti').then((confetti) => {
          // Minimal luxury theme color mix (coral, peach, soft gold, warm white, rose pink)
          const themeColors = ['#FF8A6B', '#FF9A6C', '#FF8A6B', '#FFFDF9', '#FF5C7A'];
          confetti.default({
            particleCount,
            startVelocity: 30,
            spread: 360,
            ticks: 70,
            origin: { x: randomInRange(0.1, 0.35), y: randomInRange(0.2, 0.5) },
            colors: themeColors,
          });
          confetti.default({
            particleCount,
            startVelocity: 30,
            spread: 360,
            ticks: 70,
            origin: { x: randomInRange(0.65, 0.9), y: randomInRange(0.2, 0.5) },
            colors: themeColors,
          });
        });
      }, 500);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, []);

  const handleHeroClick = (e: React.MouseEvent) => {
    // Prevent bursts when clicking interactive buttons or links
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    const types = ['burst', 'fountain', 'spin', 'sparkle'] as const;
    const randomType = types[Math.floor(Math.random() * types.length)];
    const brandColors = ['#FF8A6B', '#FF9A6C', '#FF8A6B', '#FF5C7A'];
    const randomColor = brandColors[Math.floor(Math.random() * brandColors.length)];
    const id = Date.now();
    setBursts(prev => [...prev, { id, x: e.clientX, y: e.clientY, type: randomType, color: randomColor }]);
  };

  const removeBurst = useCallback((id: number) => {
    setBursts(prev => prev.filter(b => b.id !== id));
  }, []);

  return (
    <section 
      className="relative min-h-screen flex flex-col overflow-hidden cursor-crosshair bg-[var(--bg)] transition-colors duration-400" 
      onClick={handleHeroClick} 
      id="hero"
    >
      {children}
      <AnimatePresence>
        {bursts.map(b => (
          <RealisticFirework key={b.id} x={b.x} y={b.y} type={b.type} color={b.color} onComplete={() => removeBurst(b.id)} />
        ))}
      </AnimatePresence>
    </section>
  );
}
