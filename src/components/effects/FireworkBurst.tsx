'use client';

import { useEffect, useState } from 'react';

interface FireworkBurstProps {
  x: number;
  y: number;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
  delay: number;
}

const colors = ['#e9c349', '#ffe088', '#e6e5b9', '#af8d11', '#ffb77d'];

export function FireworkBurst({ x, y, onComplete }: FireworkBurstProps) {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i / 12) * Math.PI * 2,
      distance: Math.random() * 40 + 60,
      size: Math.random() * 3 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.1,
    }))
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 850);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <>
      <style jsx>{`
        @keyframes burstOut {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
        .burst-particle {
          position: absolute;
          border-radius: 50%;
          animation: burstOut 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          pointer-events: none;
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="burst-particle"
          style={{
            left: x,
            top: y,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            '--tx': `${Math.cos(p.angle) * p.distance}px`,
            '--ty': `${Math.sin(p.angle) * p.distance}px`,
            animationDelay: `${p.delay}s`,
            transform: 'translate(-50%, -50%)',
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

// Hook to trigger burst effect
export function useFireworkBurst() {
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const triggerBurst = (x: number, y: number) => {
    const id = Date.now();
    setBursts((prev) => [...prev, { id, x, y }]);
  };

  const removeBurst = (id: number) => {
    setBursts((prev) => prev.filter((b) => b.id !== id));
  };

  return { bursts, triggerBurst, removeBurst };
}
