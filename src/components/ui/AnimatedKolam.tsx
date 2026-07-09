// @ts-nocheck
'use client';

import { motion } from 'framer-motion';

interface AnimatedKolamProps {
  className?: string;
  size?: number;
  color?: string;
  delay?: number;
}

export function AnimatedKolam({ className, size = 300, color = 'currentColor', delay = 0 }: AnimatedKolamProps) {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 0.4,
      transition: {
        pathLength: { delay: delay + i * 0.2, duration: 2, ease: "easeInOut" },
        opacity: { delay: delay + i * 0.2, duration: 1 }
      }
    })
  };

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.path
          d="M100 60C110 40 130 40 140 60C160 70 160 90 140 100C160 110 160 130 140 140C130 160 110 160 100 140C90 160 70 160 60 140C40 130 40 110 60 100C40 90 40 70 60 60C70 40 90 40 100 60Z"
          stroke={color} strokeWidth="1.5" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
        />
        <motion.path
          d="M100 10L130 40L190 40L160 70L190 100L160 130L190 160L130 160L100 190L70 160L10 160L40 130L10 100L40 70L10 40L70 40L100 10Z"
          stroke={color} strokeWidth="1" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
        />
        {[[100, 100], [100, 30], [100, 170], [30, 100], [170, 100], [60, 60], [140, 60], [60, 140], [140, 140]].map((dot, i) => (
          <motion.circle
            key={i} cx={dot[0]} cy={dot[1]} r="2" fill={color}
            initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 0.6 }} viewport={{ once: true }}
            transition={{ delay: delay + 1.5 + i * 0.1 }}
          />
        ))}
      </svg>
    </div>
  );
}
