import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  className = '',
}) => {
  const isSm = size === 'sm';

  return (
    <div
      className={`inline-flex items-center rounded-full bg-[#EADFCB] dark:bg-[#2B1B12] border border-[#2B1B12]/10 dark:border-white/10 p-1 ${className}`}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={(e) => {
          e.stopPropagation();
          if (value > min) onChange(value - 1);
        }}
        disabled={value <= min}
        className={`flex items-center justify-center rounded-full transition-all text-[#2B1B12] dark:text-[#F6EFE3] hover:bg-[#0F3D2E] hover:text-white disabled:opacity-30 disabled:pointer-events-none active:scale-90 ${
          isSm ? 'w-6 h-6' : 'w-8 h-8'
        }`}
      >
        <Minus className={isSm ? 'w-3 h-3' : 'w-4 h-4'} />
      </button>

      <span
        className={`font-semibold text-center select-none text-[#2B1B12] dark:text-[#F6EFE3] tabular-nums ${
          isSm ? 'w-6 text-xs' : 'w-9 text-sm'
        }`}
      >
        {value}
      </span>

      <button
        type="button"
        aria-label="Increase quantity"
        onClick={(e) => {
          e.stopPropagation();
          if (value < max) onChange(value + 1);
        }}
        disabled={value >= max}
        className={`flex items-center justify-center rounded-full transition-all text-[#2B1B12] dark:text-[#F6EFE3] hover:bg-[#0F3D2E] hover:text-white disabled:opacity-30 disabled:pointer-events-none active:scale-90 ${
          isSm ? 'w-6 h-6' : 'w-8 h-8'
        }`}
      >
        <Plus className={isSm ? 'w-3 h-3' : 'w-4 h-4'} />
      </button>
    </div>
  );
};
