import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outlined' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const GoldButton = forwardRef<HTMLButtonElement, GoldButtonProps>(
  ({ variant = 'gold', size = 'md', className, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-extrabold rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md min-h-[44px]';

    const variantStyles = {
      gold: 'bg-[#F7B733] text-[#101A36] hover:bg-[#FFD05C] border border-[#FFF0BF]',
      outlined:
        'border border-[#F7B733]/60 text-[#F7B733] hover:bg-[#F7B733]/15 hover:border-[#F7B733]',
      whatsapp:
        'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md',
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-xs sm:text-sm',
      lg: 'px-8 py-4 text-sm sm:text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GoldButton.displayName = 'GoldButton';
