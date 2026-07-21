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
  const baseStyles = 'rounded-3xl backdrop-blur-md transition-all duration-300 text-white';

  const variantStyles = {
    default: 'bg-[#101A36]/90 border border-[#172448] shadow-2xl',
    maroon: 'bg-[#101A36]/95 border border-[#D95136]/40 shadow-2xl',
    highlight: 'bg-[#172448]/90 border border-[#F7B733]/40 shadow-2xl',
  };

  const hoverStyles = hover
    ? 'hover:border-[#F7B733]/60 hover:-translate-y-1'
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
