'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
  y?: number;
  x?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.7,
  once = true,
  y = 40,
  x = 0,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount: 0.1,
    margin: '-50px',
  });

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y,
      x,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Preset variants for common use cases
export const revealPresets = {
  fadeUp: { y: 40, x: 0 },
  fadeDown: { y: -40, x: 0 },
  fadeLeft: { y: 0, x: 40 },
  fadeRight: { y: 0, x: -40 },
  scale: { y: 0, x: 0, scale: 0.9 },
};
