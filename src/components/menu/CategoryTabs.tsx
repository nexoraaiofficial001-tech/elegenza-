import React from 'react';
import { motion } from 'motion/react';
import { Category } from '../../../shared/types';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sparkles,
  Coffee,
  Flame,
  IceCream,
  GlassWater,
  Wine,
  CupSoda,
  UtensilsCrossed,
  Pizza,
  Beef,
  LayoutGrid,
} from 'lucide-react';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Sparkles': return <Sparkles className="w-4 h-4" />;
    case 'Coffee': return <Coffee className="w-4 h-4" />;
    case 'Flame': return <Flame className="w-4 h-4" />;
    case 'IceCream': return <IceCream className="w-4 h-4" />;
    case 'GlassWater': return <GlassWater className="w-4 h-4" />;
    case 'Wine': return <Wine className="w-4 h-4" />;
    case 'CupSoda': return <CupSoda className="w-4 h-4" />;
    case 'UtensilsCrossed': return <UtensilsCrossed className="w-4 h-4" />;
    case 'Pizza': return <Pizza className="w-4 h-4" />;
    case 'Beef': return <Beef className="w-4 h-4" />;
    default: return <Coffee className="w-4 h-4" />;
  }
};

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const { language, t } = useLanguage();
  const isUrdu = language === 'ur';

  return (
    <div className="relative w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-max px-1">
        {/* All Items Pill */}
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`relative px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
            selectedCategoryId === 'all'
              ? 'text-white'
              : 'text-[#2B1B12] dark:text-[#F6EFE3] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          {selectedCategoryId === 'all' && (
            <motion.div
              layoutId="categoryPill"
              className="absolute inset-0 bg-[#0F3D2E] rounded-full shadow-md z-0"
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            {t('menu.allCategories')}
          </span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const label = isUrdu && cat.nameUr ? cat.nameUr : cat.name;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`relative px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'text-white'
                  : 'text-[#2B1B12] dark:text-[#F6EFE3] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="categoryPill"
                  className="absolute inset-0 bg-[#0F3D2E] rounded-full shadow-md z-0"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {getCategoryIcon(cat.icon)}
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
