'use client';

export function DeepamFlameIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Outer Glow Halo */}
      <div className="absolute inset-0 bg-amber-500/40 rounded-full blur-md animate-pulse" />
      
      {/* Diya Clay Pot Base */}
      <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
        {/* Flame */}
        <path
          d="M20 5 C23 12, 25 15, 20 22 C15 15, 17 12, 20 5 Z"
          fill="url(#flameGradient)"
          className="animate-pulse origin-bottom transform scale-105"
        />
        {/* Inner Flame Core */}
        <path
          d="M20 10 C21.5 14, 22.5 16, 20 20 C17.5 16, 18.5 14, 20 10 Z"
          fill="#FFF9E6"
        />
        {/* Diya Lamp Body */}
        <path
          d="M8 22 C8 22, 12 33, 20 33 C28 33, 32 22, 32 22 C32 22, 25 25, 20 25 C15 25, 8 22, 8 22 Z"
          fill="url(#diyaGradient)"
          stroke="#F7B733"
          strokeWidth="1"
        />
        {/* Diya Rim */}
        <ellipse cx="20" cy="22" rx="12" ry="2.5" fill="#D49619" />

        <defs>
          <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF0BF" />
            <stop offset="40%" stopColor="#FFD05C" />
            <stop offset="80%" stopColor="#F7B733" />
            <stop offset="100%" stopColor="#D95136" />
          </linearGradient>
          <linearGradient id="diyaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D49619" />
            <stop offset="50%" stopColor="#B87E0C" />
            <stop offset="100%" stopColor="#101A36" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function MarigoldGarlandBanner() {
  return (
    <div className="w-full flex items-center justify-between px-4 py-2 pointer-events-none select-none overflow-hidden opacity-95 bg-gradient-to-r from-transparent via-[#172448]/40 to-transparent border-y border-[#F7B733]/20">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 shrink-0">
          {/* Deepam Oil Lamp */}
          <div className="relative flex items-center justify-center">
            <DeepamFlameIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          {/* Golden Thread Divider line */}
          <div className="w-6 sm:w-10 h-0.5 bg-gradient-to-r from-[#F7B733]/60 via-[#FFD05C]/30 to-[#F7B733]/60 rounded-full" />
        </div>
      ))}
    </div>
  );
}

