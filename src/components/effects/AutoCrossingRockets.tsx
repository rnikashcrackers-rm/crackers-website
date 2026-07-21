'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
  sparkle?: boolean;
}

interface RocketParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  progress: number;
  speed: number;
  color: string;
  trail: Array<{ x: number; y: number; alpha: number; size: number }>;
  hasExploded: boolean;
}

export function AutoCrossingRockets() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const launchSequence = () => {
      const W = canvas.width = window.innerWidth;
      const H = canvas.height = window.innerHeight;

      // Center crossover target point
      const targetX = W * 0.5;
      const targetY = H * 0.28;

      // 4 Rockets: 2 from Left, 2 from Right
      const rockets: RocketParticle[] = [
        // Left Rockets
        {
          x: W * 0.05,
          y: H * 0.95,
          startX: W * 0.05,
          startY: H * 0.95,
          targetX: targetX - 45,
          targetY: targetY - 15,
          progress: 0,
          speed: 0.014,
          color: '#F7B733',
          trail: [],
          hasExploded: false,
        },
        {
          x: W * 0.15,
          y: H * 0.95,
          startX: W * 0.15,
          startY: H * 0.95,
          targetX: targetX - 15,
          targetY: targetY + 25,
          progress: 0,
          speed: 0.015,
          color: '#FFD05C',
          trail: [],
          hasExploded: false,
        },
        // Right Rockets
        {
          x: W * 0.95,
          y: H * 0.95,
          startX: W * 0.95,
          startY: H * 0.95,
          targetX: targetX + 45,
          targetY: targetY - 15,
          progress: 0,
          speed: 0.014,
          color: '#D95136',
          trail: [],
          hasExploded: false,
        },
        {
          x: W * 0.85,
          y: H * 0.95,
          startX: W * 0.85,
          startY: H * 0.95,
          targetX: targetX + 15,
          targetY: targetY + 25,
          progress: 0,
          speed: 0.015,
          color: '#E85D3F',
          trail: [],
          hasExploded: false,
        },
      ];

      const burstParticles: Particle[] = [];
      const colors = ['#F7B733', '#FFD05C', '#D95136', '#E85D3F', '#38BDF8', '#4ADE80', '#F43F5E', '#FFFFFF'];

      const createExplosion = (cx: number, cy: number) => {
        const count = 100;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 8.5 + 2;
          burstParticles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 4 + 1.5,
            alpha: 1,
            decay: Math.random() * 0.016 + 0.01,
            sparkle: Math.random() > 0.4,
          });
        }
      };

      const render = () => {
        ctx.clearRect(0, 0, W, H);

        let activeRockets = false;

        rockets.forEach((r) => {
          if (!r.hasExploded) {
            activeRockets = true;
            r.progress += r.speed;

            if (r.progress >= 1) {
              r.hasExploded = true;
              createExplosion(r.targetX, r.targetY);
            } else {
              r.x = r.startX + (r.targetX - r.startX) * r.progress;
              r.y = r.startY + (r.targetY - r.startY) * Math.sin(r.progress * Math.PI * 0.5);

              r.trail.push({ x: r.x, y: r.y, alpha: 1, size: Math.random() * 3 + 2 });

              // Trail
              r.trail.forEach((t, idx) => {
                t.alpha -= 0.04;
                if (t.alpha > 0) {
                  ctx.beginPath();
                  ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
                  ctx.fillStyle = r.color;
                  ctx.globalAlpha = t.alpha;
                  ctx.fill();
                } else {
                  r.trail.splice(idx, 1);
                }
              });

              // Rocket Head
              ctx.save();
              ctx.beginPath();
              ctx.arc(r.x, r.y, 5, 0, Math.PI * 2);
              ctx.fillStyle = '#FFFFFF';
              ctx.shadowColor = r.color;
              ctx.shadowBlur = 12;
              ctx.globalAlpha = 1;
              ctx.fill();
              ctx.restore();
            }
          }
        });

        // Burst Particles
        burstParticles.forEach((p, idx) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.06; // gravity
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.alpha -= p.decay;
          p.size *= 0.98;

          if (p.alpha <= 0 || p.size < 0.2) {
            burstParticles.splice(idx, 1);
            return;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          if (p.sparkle && Math.random() > 0.3) {
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 6;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.fill();
        });

        if (activeRockets || burstParticles.length > 0) {
          animId = requestAnimationFrame(render);
        }
      };

      render();
    };

    // Auto-launch sequence after 800ms delay on entry
    const startTimer = setTimeout(() => {
      launchSequence();
    }, 800);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[80] mix-blend-screen"
    />
  );
}
