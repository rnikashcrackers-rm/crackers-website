import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'gold'
    | 'maroon'
    | 'green'
    | 'amber'
    | 'popular'
    | 'premium';
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm';

  const variantStyles = {
    default: 'bg-surface-higher/80 text-text border border-gold/20',
    gold: 'bg-gold/20 text-gold-light border border-gold/40',
    maroon: 'bg-maroon/60 text-gold border border-gold/40',
    green: 'bg-green-wa/20 text-green-wa border border-green-wa/40',
    amber: 'bg-amber-500/20 text-amber-400 border border-amber-400/40',
    popular:
      'bg-gradient-to-r from-gold to-gold-light text-bg border border-gold-dim',
    premium: 'bg-maroon text-gold border-2 border-gold',
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
}
