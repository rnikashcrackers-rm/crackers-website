'use client';

import { memo } from 'react';

interface FireParticle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
}

const generateParticles = (count: number): FireParticle[] => {
  const colors = ['#e9c349', '#ffe088', '#af8d11', '#ffb77d', '#ff6b35'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 2,
    size: Math.random() * 5 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
};

const particles = generateParticles(50);

export const FireParticles = memo(function FireParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style jsx>{`
        @keyframes fireFloat {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-300px) scale(0);
            opacity: 0;
          }
        }
        .fire-particle {
          position: absolute;
          bottom: 0;
          border-radius: 50%;
          animation: fireFloat linear infinite;
          filter: blur(1px);
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="fire-particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
});
