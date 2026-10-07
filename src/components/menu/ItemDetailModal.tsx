import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem } from '../../../shared/types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { AllergenIcons } from '../common/AllergenIcons';
import { QuantityStepper } from '../ui/QuantityStepper';
import { Button } from '../ui/Button';
import { X, Flame, Clock, Sparkles } from 'lucide-react';

interface ItemDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  const { language, formatPrice, isRtl, t } = useLanguage();
  const { addItem, setIsCartOpen } = useCart();

  const [selectedVariantName, setSelectedVariantName] = useState<string | undefined>(
    item?.variants?.[0]?.name
  );
  const [selectedAddOnNames, setSelectedAddOnNames] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  if (!item) return null;

  const isUrdu = language === 'ur';
  const displayName = isUrdu && item.nameUr ? item.nameUr : item.name;
  const displayDesc = isUrdu && item.descriptionUr ? item.descriptionUr : item.description;

  // Selected Variant Price Delta
  const selectedVariant = item.variants?.find((v) => v.name === selectedVariantName);
  const variantDelta = selectedVariant?.priceDelta || 0;

  // Selected Add-ons Total
  const addOnsTotal = (item.addOns || [])
    .filter((a) => selectedAddOnNames.includes(a.name))
    .reduce((sum, a) => sum + a.price, 0);

  const unitTotal = item.price + variantDelta + addOnsTotal;
  const lineTotal = unitTotal * quantity;

  const toggleAddOn = (addOnName: string) => {
    setSelectedAddOnNames((prev) =>
      prev.includes(addOnName) ? prev.filter((n) => n !== addOnName) : [...prev, addOnName]
    );
  };

  const handleAddToCart = () => {
    addItem(item, selectedVariantName, selectedAddOnNames, quantity, notes);
    onClose();
    setIsCartOpen(true);
  };

  const isSoldOut = !item.available || (typeof item.stockCount === 'number' && item.stockCount <= 0);
  const isLowStock = typeof item.stockCount === 'number' && item.stockCount > 0 && item.stockCount <= 10;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm">
        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-[#F6EFE3] dark:bg-[#0A2A20] text-[#2B1B12] dark:text-[#F6EFE3] rounded-3xl shadow-2xl overflow-hidden border border-[#2B1B12]/10 dark:border-white/10"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur transition-all active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header Image */}
          <div className="relative w-full h-56 sm:h-64 shrink-0 bg-[#EADFCB] dark:bg-[#1C130D] overflow-hidden">
            <img
              src={item.image}
              alt={displayName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {item.isNew && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C48A4A] text-white shadow">
                  {t('specials.newBadge')}
                </span>
              )}
              {item.isPopular && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0F3D2E] text-[#F6EFE3] shadow">
                  {t('specials.popularBadge')}
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif-display text-white">
                  {displayName}
                </h3>
                {item.calories && (
                  <span className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                    <Flame className="w-3.5 h-3.5 text-[#E2B882]" />
                    {item.calories} kcal
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#E2B882] font-serif-display">
                  {formatPrice(unitTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Body Scrollable */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Description */}
            <p className="text-sm sm:text-base text-[#6B5E55] dark:text-[#C5B5A5] leading-relaxed">
              {displayDesc}
            </p>

            {/* Allergen & Dietary Info */}
            <AllergenIcons
              allergens={item.allergens}
              dietary={item.dietary}
              spiceLevel={item.spiceLevel}
            />

            {/* Low stock notice */}
            {isLowStock && (
              <div className="p-2.5 rounded-xl bg-[#ED9B1B]/15 text-[#ED9B1B] text-xs font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t('menu.onlyLeft', { count: item.stockCount! })}
              </div>
            )}

            {/* Variants / Sizes */}
            {item.variants && item.variants.length > 0 && (
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F3D2E] dark:text-[#E2B882]">
                  {t('menu.selectVariant')}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {item.variants.map((variant) => {
                    const variantTitle = isUrdu && variant.nameUr ? variant.nameUr : variant.name;
                    const isSelected = selectedVariantName === variant.name;
                    return (
                      <button
                        key={variant.name}
                        type="button"
                        onClick={() => setSelectedVariantName(variant.name)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-[#0F3D2E] dark:border-[#C48A4A] bg-[#0F3D2E]/10 dark:bg-[#C48A4A]/20 font-semibold'
                            : 'border-[#2B1B12]/15 dark:border-white/10 hover:border-[#0F3D2E]/40'
                        }`}
                      >
                        <span className="text-sm">{variantTitle}</span>
                        {variant.priceDelta > 0 && (
                          <span className="text-xs text-[#C48A4A] font-bold">
                            +{formatPrice(variant.priceDelta)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add-ons & Extras */}
            {item.addOns && item.addOns.length > 0 && (
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F3D2E] dark:text-[#E2B882]">
                  {t('menu.addOns')}
                </label>
                <div className="space-y-2">
                  {item.addOns.map((addOn) => {
                    const addOnTitle = isUrdu && addOn.nameUr ? addOn.nameUr : addOn.name;
                    const isChecked = selectedAddOnNames.includes(addOn.name);
                    return (
                      <label
                        key={addOn.name}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                          isChecked
                            ? 'border-[#C48A4A] bg-[#C48A4A]/10'
                            : 'border-[#2B1B12]/15 dark:border-white/10 hover:border-[#C48A4A]/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAddOn(addOn.name)}
                            className="w-4 h-4 rounded text-[#0F3D2E] focus:ring-[#0F3D2E]"
                          />
                          <span className="text-sm font-medium">{addOnTitle}</span>
                        </div>
                        <span className="text-xs font-bold text-[#C48A4A]">
                          +{formatPrice(addOn.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B5E55] dark:text-[#C5B5A5]">
                {t('menu.specialNotes')}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={200}
                rows={2}
                placeholder="e.g. Extra hot, crushed ice on the side..."
                className="w-full p-3 rounded-2xl border border-[#2B1B12]/15 dark:border-white/10 bg-white/70 dark:bg-black/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
              />
            </div>
          </div>

          {/* Modal Footer (Sticky) */}
          <div className="p-4 sm:p-5 border-t border-[#2B1B12]/10 dark:border-white/10 bg-[#EADFCB]/60 dark:bg-[#0A2A20] flex items-center justify-between gap-4">
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              size="md"
            />

            <Button
              variant="caramel"
              size="lg"
              disabled={isSoldOut}
              onClick={handleAddToCart}
              className="flex-1"
            >
              {isSoldOut ? t('menu.soldOut') : `${t('menu.addFor', { price: formatPrice(lineTotal) })}`}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
