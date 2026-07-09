import { cn } from '@/lib/utils';
import { HTMLMotionProps, motion } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'maroon' | 'highlight';
  hover?: boolean;
  children: React.ReactNode;
}

export function GlassCard({
  variant = 'default',
  hover = true,
  className,
  children,
  ...props
}: GlassCardProps) {
  const baseStyles = 'rounded-2xl backdrop-blur-xl transition-all duration-300';

  const variantStyles = {
    default: 'bg-surface-high/50 border border-gold/15',
    maroon: 'bg-maroon/30 border border-maroon-mid/30',
    highlight: 'bg-gold/10 border border-gold/30',
  };

  const hoverStyles = hover
    ? 'hover:border-gold/40 hover:shadow-coral'
    : '';

  return (
    <motion.div
      className={cn(baseStyles, variantStyles[variant], hoverStyles, className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

