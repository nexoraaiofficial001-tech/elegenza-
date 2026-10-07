import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'caramel' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:pointer-events-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary:
      'bg-[#0F3D2E] hover:bg-[#0A2A20] text-[#F6EFE3] shadow-md hover:shadow-forest focus:ring-[#0F3D2E]',
    secondary:
      'bg-[#6B8F71] hover:bg-[#5A7C5F] text-[#F6EFE3] focus:ring-[#6B8F71]',
    caramel:
      'bg-[#C48A4A] hover:bg-[#B37939] text-[#FFFFFF] shadow-caramel-sm hover:shadow-caramel focus:ring-[#C48A4A]',
    outline:
      'border-2 border-[#0F3D2E] dark:border-[#C48A4A] text-[#0F3D2E] dark:text-[#E2B882] hover:bg-[#0F3D2E]/5 dark:hover:bg-[#C48A4A]/10 focus:ring-[#0F3D2E]',
    ghost:
      'text-[#2B1B12] dark:text-[#F6EFE3] hover:bg-black/5 dark:hover:bg-white/5 focus:ring-[#0F3D2E]',
    danger:
      'bg-[#C0392B] hover:bg-[#A93226] text-white shadow-md focus:ring-[#C0392B]',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5 font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
