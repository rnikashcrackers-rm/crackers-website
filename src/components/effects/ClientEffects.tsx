'use client';

import { useEffect, useState } from 'react';
import { useEnquiryStore } from '@/lib/store/enquiryStore';
import { SparkCursor } from './SparkCursor';
import { GlobalAtmosphere } from './GlobalAtmosphere';
import { FestiveBackgroundElements } from './FestiveBackgroundElements';
import { AutoCrossingRockets } from './AutoCrossingRockets';

interface BurstParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

export function ClientEffects() {
  const [entryBursting, setEntryBursting] = useState(true);

  useEffect(() => {
    const { checkCartExpiry } = useEnquiryStore.getState();

    // Suppress THREE.Clock deprecation warnings
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) {
        return;
      }
      originalWarn(...args);
    };

    // Initial check on mount
    checkCartExpiry();

    // Periodic check every 5 seconds for 5-minute inactivity timeout
    const interval = setInterval(() => {
      checkCartExpiry();
    }, 5000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkCartExpiry();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);

    const entryTimer = setTimeout(() => {
      setEntryBursting(false);
    }, 2500);

    return () => {
      console.warn = originalWarn;
      clearInterval(interval);
      clearTimeout(entryTimer);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <>
      {/* Cracker Cursor Sparks across all pages */}
      <SparkCursor />

      {/* Traditional Tamil Floating Flowers, Spark Rays & Kolams */}
      <FestiveBackgroundElements />

      {/* Traditional 3D Floating Diyas & Atmospheric Gold Glow */}
      <GlobalAtmosphere />

      {/* Auto-Launching 4 Crossing Rockets (2 Left, 2 Right) */}
      <AutoCrossingRockets />

      {/* Initial Entry Firework Bursts Effect */}
      {entryBursting && <EntryFireworkBursts />}
    </>
  );
}

function EntryFireworkBursts() {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef) return;
    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;

    canvasRef.width = window.innerWidth;
    canvasRef.height = window.innerHeight;

    const colors = ['#F7B733', '#FFD05C', '#D95136', '#E85D3F', '#FFFFFF', '#FFAE00'];
    const particles: BurstParticle[] = [];

    const centers = [
      { x: window.innerWidth * 0.25, y: window.innerHeight * 0.3 },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.2 },
      { x: window.innerWidth * 0.75, y: window.innerHeight * 0.35 },
    ];

    centers.forEach(c => {
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        particles.push({
          id: Math.random(),
          x: c.x,
          y: c.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    });

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life -= 0.02;
        p.size *= 0.97;

        if (p.life <= 0 || p.size < 0.3) {
          particles.splice(idx, 1);
          return;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
      });

      if (particles.length > 0) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [canvasRef]);

  return (
    <canvas
      ref={setCanvasRef}
      className="fixed inset-0 pointer-events-none z-[99] mix-blend-screen"
    />
  );
}
