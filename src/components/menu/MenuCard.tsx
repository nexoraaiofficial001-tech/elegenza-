import React, { useState, useRef } from 'react';
import { MenuItem } from '../../../shared/types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { AllergenIcons } from '../common/AllergenIcons';
import { Plus, Flame, Clock } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onOpenDetail: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onOpenDetail }) => {
  const { language, formatPrice, isRtl, t } = useLanguage();
  const { addItem, setIsCartOpen } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const isUrdu = language === 'ur';
  const displayName = isUrdu && item.nameUr ? item.nameUr : item.name;
  const displayDesc = isUrdu && item.descriptionUr ? item.descriptionUr : item.description;

  const isSoldOut = !item.available || (typeof item.stockCount === 'number' && item.stockCount <= 0);
  const isLowStock = typeof item.stockCount === 'number' && item.stockCount > 0 && item.stockCount <= 10;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle artisan 3D tilt: max ~7 degrees
    const rotateX = Number((((centerY - y) / centerY) * 7).toFixed(2));
    const rotateY = Number((((x - centerX) / centerX) * 7).toFixed(2));
    const glareX = Number(((x / rect.width) * 100).toFixed(1));
    const glareY = Number(((y / rect.height) * 100).toFixed(1));

    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) return;
    // If has variants or add-ons, open modal to let customer choose
    if ((item.variants && item.variants.length > 0) || (item.addOns && item.addOns.length > 0)) {
      onOpenDetail(item);
    } else {
      addItem(item);
      setIsCartOpen(true);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenDetail(item)}
      style={{
        perspective: '1000px',
      }}
      className="relative cursor-pointer"
    >
      <div
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.025, 1.025, 1.025) translateY(-4px)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0px)',
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease'
            : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease',
        }}
        className={`group relative flex flex-col bg-white dark:bg-[#0A2A20] rounded-3xl overflow-hidden border border-[#2B1B12]/8 dark:border-white/10 transition-shadow duration-300 ${
          isHovered
            ? 'shadow-2xl shadow-[#C48A4A]/20 ring-1 ring-[#C48A4A]/30'
            : 'shadow-sm'
        }`}
      >
        {/* Subtle dynamic specular sheen across the 3D tilt plane */}
        {isHovered && (
          <div
            className="pointer-events-none absolute inset-0 z-20 rounded-3xl opacity-20 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 280px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.7) 0%, rgba(226,184,130,0.2) 40%, transparent 80%)`,
            }}
          />
        )}

        {/* Card Image Container with slight z-translation for true depth */}
        <div
          style={{ transform: isHovered ? 'translateZ(14px)' : 'translateZ(0px)', transition: 'transform 0.3s ease-out' }}
          className="relative w-full aspect-[4/3] bg-[#EADFCB] dark:bg-[#1C130D] overflow-hidden"
        >
          <img
            src={item.image}
            alt={displayName}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />

          {/* Subtle dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-60" />

          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {item.isNew && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#C48A4A] text-white shadow-md">
                {t('specials.newBadge')}
              </span>
            )}
            {item.isPopular && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#0F3D2E] text-[#F6EFE3] shadow-md border border-[#E2B882]/30">
                {t('specials.popularBadge')}
              </span>
            )}
            {isSoldOut && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#C0392B] text-white shadow-md">
                {t('menu.soldOut')}
              </span>
            )}
          </div>

          {/* Low Stock Badge */}
          {isLowStock && !isSoldOut && (
            <div className="absolute bottom-3 left-3 z-10 px-2 py-0.5 rounded-full bg-[#ED9B1B]/95 backdrop-blur text-white text-[10px] font-semibold flex items-center gap-1 shadow">
              <Clock className="w-3 h-3" />
              {t('menu.onlyLeft', { count: item.stockCount! })}
            </div>
          )}

          {/* Calories if specified */}
          {item.calories && (
            <div className="absolute bottom-3 right-3 z-10 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur text-white/95 text-[10px] font-medium flex items-center gap-1 shadow">
              <Flame className="w-3 h-3 text-[#E2B882]" />
              {item.calories} kcal
            </div>
          )}
        </div>

        {/* Card Content with subtle 3D translation for artisan feel */}
        <div
          style={{ transform: isHovered ? 'translateZ(18px)' : 'translateZ(0px)', transition: 'transform 0.3s ease-out' }}
          className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3"
        >
          <div>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h4 className="font-serif-display font-bold text-lg sm:text-xl text-[#2B1B12] dark:text-[#F6EFE3] line-clamp-1 group-hover:text-[#0F3D2E] dark:group-hover:text-[#E2B882] transition-colors">
                {displayName}
              </h4>
              <span className="font-serif-display font-bold text-base sm:text-lg text-[#0F3D2E] dark:text-[#E2B882] shrink-0">
                {formatPrice(item.price)}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#C5B5A5] line-clamp-2 leading-relaxed">
              {displayDesc}
            </p>
          </div>

          <div className="pt-2 border-t border-[#2B1B12]/8 dark:border-white/5 flex items-center justify-between gap-2">
            {/* Dietary & Allergen previews */}
            <AllergenIcons
              dietary={item.dietary?.slice(0, 2)}
              spiceLevel={item.spiceLevel}
            />

            {/* Quick Add Button */}
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isSoldOut}
              aria-label={`Add ${displayName} to cart`}
              className={`p-2.5 rounded-full font-semibold transition-all active:scale-90 flex items-center justify-center shrink-0 cursor-pointer ${
                isSoldOut
                  ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  : 'bg-[#0F3D2E] hover:bg-[#C48A4A] text-white shadow-md group-hover:shadow-caramel-sm'
              }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
