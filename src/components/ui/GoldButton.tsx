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
      'inline-flex items-center justify-center font-bold rounded-full transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      gold: 'bg-gradient-to-br from-[#FF8A6B] to-[#FF5C7A] text-white shadow-lg hover:shadow-[#FF8A6B]/40',
      outlined:
        'border-2 border-[#FF8A6B]/60 text-[#FF8A6B] hover:bg-[#FF8A6B]/10 hover:border-[#FF8A6B]',
      whatsapp:
        'bg-gradient-to-br from-green-wa to-green-700 text-white shadow-lg hover:shadow-green-wa/40',
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
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
