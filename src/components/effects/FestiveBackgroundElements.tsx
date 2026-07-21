'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatedKolam } from '@/components/ui/AnimatedKolam';

interface Flower {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  type: 'marigold' | 'jasmine' | 'spark_ray';
}

export function FestiveBackgroundElements() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const items: Flower[] = Array.from({ length: 35 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 12 + 6,
      speedY: Math.random() * 0.6 + 0.2,
      speedX: (Math.random() - 0.5) * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      type: Math.random() > 0.4 ? 'marigold' : Math.random() > 0.5 ? 'jasmine' : 'spark_ray',
    }));

    let animId: number;

    const drawMarigold = (x: number, y: number, size: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      const petalCount = 8;
      for (let i = 0; i < petalCount; i++) {
        ctx.rotate((Math.PI * 2) / petalCount);
        ctx.beginPath();
        ctx.ellipse(0, size * 0.5, size * 0.3, size * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? '#F7B733' : '#E85D3F';
        ctx.globalAlpha = 0.45;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD05C';
      ctx.globalAlpha = 0.6;
      ctx.fill();
      ctx.restore();
    };

    const drawJasmine = (x: number, y: number, size: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      const petalCount = 5;
      for (let i = 0; i < petalCount; i++) {
        ctx.rotate((Math.PI * 2) / petalCount);
        ctx.beginPath();
        ctx.ellipse(0, size * 0.4, size * 0.2, size * 0.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 0.5;
        ctx.fill();
      }
      ctx.restore();
    };

    const drawSparkRay = (x: number, y: number, size: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = '#F7B733';
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, size * 1.5);
        ctx.stroke();
      }
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      items.forEach((item) => {
        item.y += item.speedY;
        item.x += item.speedX;
        item.rotation += item.rotationSpeed;

        if (item.y > canvas.height + 20) {
          item.y = -20;
          item.x = Math.random() * canvas.width;
        }
        if (item.x > canvas.width + 20) item.x = -20;
        if (item.x < -20) item.x = canvas.width + 20;

        if (item.type === 'marigold') {
          drawMarigold(item.x, item.y, item.size, item.rotation);
        } else if (item.type === 'jasmine') {
          drawJasmine(item.x, item.y, item.size, item.rotation);
        } else {
          drawSparkRay(item.x, item.y, item.size, item.rotation);
        }
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[-2] opacity-80"
      />

      <div className="fixed top-24 left-2 pointer-events-none z-[-2] opacity-20 hidden md:block">
        <AnimatedKolam size={240} color="#F7B733" />
      </div>
      <div className="fixed top-1/3 right-2 pointer-events-none z-[-2] opacity-20 hidden md:block">
        <AnimatedKolam size={280} color="#F7B733" delay={0.4} />
      </div>
      <div className="fixed bottom-24 left-6 pointer-events-none z-[-2] opacity-15 hidden md:block">
        <AnimatedKolam size={220} color="#FFD05C" delay={0.8} />
      </div>
    </>
  );
}
