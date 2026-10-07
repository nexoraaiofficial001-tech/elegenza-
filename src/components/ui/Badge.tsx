import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'forest' | 'caramel' | 'sage' | 'cream' | 'danger' | 'warning' | 'success';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'forest',
  size = 'sm',
  className = '',
}) => {
  const variants = {
    forest: 'bg-[#0F3D2E] text-[#F6EFE3]',
    caramel: 'bg-[#C48A4A] text-white',
    sage: 'bg-[#6B8F71] text-white',
    cream: 'bg-[#EADFCB] text-[#2B1B12] dark:bg-[#2B1B12] dark:text-[#E2B882]',
    danger: 'bg-[#C0392B]/15 text-[#C0392B] border border-[#C0392B]/20',
    warning: 'bg-[#ED9B1B]/15 text-[#ED9B1B] border border-[#ED9B1B]/20',
    success: 'bg-[#2E7D32]/15 text-[#2E7D32] border border-[#2E7D32]/20',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    md: 'text-xs px-3 py-1 font-semibold uppercase tracking-wider',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};
