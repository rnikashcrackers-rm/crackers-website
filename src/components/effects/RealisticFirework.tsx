'use client';

import React, { useRef, useEffect } from 'react';

type BlastType = 'burst' | 'fountain' | 'spin' | 'sparkle';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
  gravity: number;
  drag: number;
}

export function RealisticFirework({
  x = 0,
  y = 0,
  type = 'burst',
  color = '#FF8A6B',
  onComplete,
}: {
  x?: number;
  y?: number;
  type?: BlastType;
  color?: string;
  onComplete?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const count = type === 'burst' ? 120 : type === 'fountain' ? 150 : type === 'spin' ? 140 : 80;

    // Initialize particles
    for (let i = 0; i < count; i++) {
      let vx = 0;
      let vy = 0;
      let gravity = 0.08;
      let drag = 0.98;
      let size = Math.random() * 2.5 + 1.5;
      let decay = Math.random() * 0.015 + 0.012;

      if (type === 'burst') {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
        gravity = 0.05;
      } else if (type === 'fountain') {
        vx = (Math.random() - 0.5) * 2;
        vy = -(Math.random() * 8 + 6);
        gravity = 0.15;
        decay = Math.random() * 0.02 + 0.015;
      } else if (type === 'spin') {
        const angle = (i / count) * Math.PI * 2 * 6 + (Math.random() * 0.2);
        const speed = Math.random() * 4 + 4;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
        gravity = 0.02;
        drag = 0.97;
      } else { // sparkle
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 1;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
        decay = Math.random() * 0.03 + 0.02;
        gravity = 0.03;
      }

      particles.push({
        x,
        y,
        vx,
        vy,
        color,
        alpha: 1,
        decay,
        size,
        gravity,
        drag,
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;

      // Draw and update particles
      particles.forEach((p) => {
        if (p.alpha <= 0) return;

        alive = true;

        // Apply physics
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          
          // Glow effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;

          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (!alive) {
        onComplete?.();
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [x, y, type, color, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
