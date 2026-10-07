import React from 'react';
import { Allergen, DietaryTag } from '../../../shared/types';
import { Milk, Nut, Wheat, Egg, Fish, Leaf, Sparkles, CheckCircle2 } from 'lucide-react';

interface AllergenIconsProps {
  allergens?: Allergen[];
  dietary?: DietaryTag[];
  spiceLevel?: 0 | 1 | 2 | 3;
}

export const AllergenIcons: React.FC<AllergenIconsProps> = ({
  allergens = [],
  dietary = [],
  spiceLevel = 0,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      {/* Dietary Badges */}
      {dietary.map((tag) => (
        <span
          key={tag}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
            tag === 'Vegetarian'
              ? 'bg-[#2E7D32]/10 text-[#2E7D32]'
              : tag === 'Vegan'
              ? 'bg-[#6B8F71]/15 text-[#0F3D2E] dark:text-[#6B8F71]'
              : tag === 'Halal'
              ? 'bg-[#0F3D2E]/10 text-[#0F3D2E] dark:text-[#E2B882]'
              : 'bg-[#C48A4A]/15 text-[#C48A4A]'
          }`}
        >
          {tag === 'Vegetarian' || tag === 'Vegan' ? <Leaf className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
          {tag}
        </span>
      ))}

      {/* Spice Level Indicator */}
      {spiceLevel > 0 && (
        <span
          className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#C0392B]/10 text-[#C0392B] font-medium"
          title={`Spice level ${spiceLevel} of 3`}
        >
          {Array.from({ length: spiceLevel }).map((_, i) => (
            <span key={i} className="text-xs">🌶️</span>
          ))}
          <span className="text-[10px] ml-1">Spicy</span>
        </span>
      )}

      {/* Allergens warning tags */}
      {allergens.length > 0 && (
        <span className="text-[11px] text-[#6B5E55] dark:text-[#C5B5A5] italic">
          Contains: {allergens.join(', ')}
        </span>
      )}
    </div>
  );
};
