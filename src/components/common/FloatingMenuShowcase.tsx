import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { MenuItem } from '../../../shared/types';
import {
  Coffee,
  Sparkles,
  Flame,
  Plus,
  Check,
  ShoppingBag,
  Star,
  ChevronRight,
  Pizza,
  Cake,
  GlassWater,
} from 'lucide-react';

import icedCoffeeImg from '../../assets/images/hero_3d_iced_coffee_1791374759296.jpg';
import matchaFrappeImg from '../../assets/images/hero_3d_matcha_frappe_1791374790006.jpg';
import hotLatteImg from '../../assets/images/hero_3d_hot_latte_art_1791374820129.jpg';
import pistachioCakeImg from '../../assets/images/food_3d_pistachio_bliss_1791374902908.jpg';
import artisanPizzaImg from '../../assets/images/food_3d_artisan_pizza_1791374923423.jpg';

interface FloatingMenuShowcaseProps {
  onOpenDetail: (item: MenuItem) => void;
  onExploreFullMenu: () => void;
}

export const FloatingMenuShowcase: React.FC<FloatingMenuShowcaseProps> = ({
  onOpenDetail,
  onExploreFullMenu,
}) => {
  const { language, formatPrice, t } = useLanguage();
  const { addItem, setIsCartOpen } = useCart();
  const isUrdu = language === 'ur';

  const [activeCategory, setActiveCategory] = useState<'all' | 'coffee' | 'pizza' | 'dessert' | 'coolers'>('all');
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  const showcaseItems: (MenuItem & { rating: number; tag: string })[] = [
    {
      id: 'item-showcase-iced-latte',
      name: 'Iced Caramel Macchiato',
      nameUr: 'آئسڈ کیریمل ماکیاٹو',
      slug: 'iced-caramel-macchiato',
      description: 'Layered espresso, vanilla whole milk, crystal ice cubes, and handmade golden caramel drizzle.',
      descriptionUr: 'تازہ ایسپریسو، ونیلا دودھ اور سنہری کیریمل کی تہیں برفیلی ٹھنڈک کے ساتھ۔',
      categoryId: 'cat-coffee',
      price: 780,
      image: icedCoffeeImg,
      tags: ['Bestseller', 'Iced'],
      allergens: ['Dairy'],
      dietary: ['Vegetarian', 'Halal'],
      spiceLevel: 0,
      calories: 240,
      isVeg: true,
      isSpicy: false,
      isNew: false,
      isPopular: true,
      isFeatured: true,
      available: true,
      variants: [],
      addOns: [],
      sortOrder: 1,
      rating: 4.9,
      tag: 'Bestseller',
    },
    {
      id: 'item-showcase-matcha',
      name: 'Matcha Pistachio Frappe',
      nameUr: 'ماچا پستہ فریپے',
      slug: 'matcha-pistachio-frappe',
      description: 'Stone-ground Uji matcha green tea, creamy milk cloud, topped with whipped peaks and crushed pistachio.',
      descriptionUr: 'اصلی ماچا گرین ٹی، وپڈ کریم اور پسے ہوئے پستے کی دلکش سجاوٹ۔',
      categoryId: 'cat-frappe',
      price: 850,
      image: matchaFrappeImg,
      tags: ['New', 'Trending'],
      allergens: ['Dairy', 'Nuts'],
      dietary: ['Vegetarian', 'Halal'],
      spiceLevel: 0,
      calories: 290,
      isVeg: true,
      isSpicy: false,
      isNew: true,
      isPopular: true,
      isFeatured: true,
      available: true,
      variants: [],
      addOns: [],
      sortOrder: 2,
      rating: 5.0,
      tag: 'Trending',
    },
    {
      id: 'item-showcase-swan-latte',
      name: 'Artisan Swan Latte',
      nameUr: 'دست کار سوان لاٹے',
      slug: 'artisan-swan-latte',
      description: 'Single-origin dark roast Arabica espresso, textured whole microfoam, champion swan latte art.',
      descriptionUr: 'خالص عربیکا ڈارک روسٹ کافی، ریشمی جھاگ اور دلکش سوان لاٹے آرٹ۔',
      categoryId: 'cat-coffee',
      price: 750,
      image: hotLatteImg,
      tags: ['Classic', 'Hot'],
      allergens: ['Dairy'],
      dietary: ['Vegetarian', 'Halal'],
      spiceLevel: 0,
      calories: 160,
      isVeg: true,
      isSpicy: false,
      isNew: false,
      isPopular: true,
      isFeatured: true,
      available: true,
      variants: [],
      addOns: [],
      sortOrder: 3,
      rating: 4.9,
      tag: 'Classic',
    },
    {
      id: 'item-showcase-pizza',
      name: 'Wood-Fired Pepperoni',
      nameUr: 'ووڈ فائرڈ پیپرونی پیزا',
      slug: 'wood-fired-pepperoni',
      description: 'Sourdough crust blistered at 450°C, San Marzano tomato reduction, fior di latte mozzarella, beef pepperoni.',
      descriptionUr: 'لکڑی کے تندور کا کھٹا خمیری کرسٹ، اطالوی ٹماٹر سوس اور بیف پیپرونی۔',
      categoryId: 'cat-pizza',
      price: 1850,
      image: artisanPizzaImg,
      tags: ['Wood-Fired', 'Chef Special'],
      allergens: ['Gluten', 'Dairy'],
      dietary: ['Halal'],
      spiceLevel: 1,
      calories: 880,
      isVeg: false,
      isSpicy: true,
      isNew: false,
      isPopular: true,
      isFeatured: true,
      available: true,
      variants: [],
      addOns: [],
      sortOrder: 4,
      rating: 4.9,
      tag: '9/10 Reviewed',
    },
    {
      id: 'item-showcase-pistachio-bliss',
      name: 'Pistachio Dream Bliss',
      nameUr: 'پستہ ڈریم ڈیزرٹ',
      slug: 'pistachio-dream-bliss',
      description: 'Delicate layers of almond sponge, whipped Sicilian pistachio ganache, gold leaf and toasted pistachio crust.',
      descriptionUr: 'پستہ گاناش، بادام کا اسفنج کیک اور سنہری ورق کی شاہکار مٹھاس۔',
      categoryId: 'cat-dessert',
      price: 950,
      image: pistachioCakeImg,
      tags: ['Artisan Pastry', 'Signature'],
      allergens: ['Dairy', 'Nuts', 'Eggs'],
      dietary: ['Vegetarian', 'Halal'],
      spiceLevel: 0,
      calories: 320,
      isVeg: true,
      isSpicy: false,
      isNew: true,
      isPopular: true,
      isFeatured: true,
      available: true,
      variants: [],
      addOns: [],
      sortOrder: 5,
      rating: 5.0,
      tag: 'Chef Choice',
    },
  ];

  const filteredItems = showcaseItems.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'coffee') return item.categoryId === 'cat-coffee' || item.categoryId === 'cat-frappe';
    if (activeCategory === 'pizza') return item.categoryId === 'cat-pizza';
    if (activeCategory === 'dessert') return item.categoryId === 'cat-dessert';
    return true;
  });

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    addItem(item);
    setAddedItemId(item.id);
    setTimeout(() => {
      setAddedItemId(null);
      setIsCartOpen(true);
    }, 450);
  };

  return (
    <section className="relative z-20 -mt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Floating Glassmorphic Container (Inspo Image 1 & 2) */}
      <div className="bg-[#1C130D]/90 dark:bg-[#0A2A20]/90 backdrop-blur-2xl rounded-[32px] p-6 sm:p-8 border border-white/15 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] space-y-6">
        {/* Header & Category Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#C48A4A]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive 3D Menu Showcase</span>
            </div>
            <h2 className="font-serif-display font-bold text-2xl sm:text-3xl text-white">
              Signature Solarium Creations
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: 'All Items', icon: Sparkles },
              { id: 'coffee', label: 'Coffee & Frappes', icon: Coffee },
              { id: 'pizza', label: 'Wood-Fired Pizza', icon: Pizza },
              { id: 'dessert', label: 'Pastries & Desserts', icon: Cake },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C48A4A] text-white shadow-caramel-sm'
                      : 'bg-white/5 hover:bg-white/10 text-white/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Realistic Cards Horizontal Scroll / Grid (Inspo Image 2 & 3) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.slice(0, 4).map((item) => {
            const isJustAdded = addedItemId === item.id;
            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={() => onOpenDetail(item)}
                className="group relative bg-[#0A2A20] rounded-3xl overflow-hidden border border-white/15 shadow-xl flex flex-col justify-between cursor-pointer"
              >
                {/* Image Container with realistic lighting */}
                <div className="relative w-full aspect-square bg-[#0F3D2E] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A20] via-transparent to-transparent opacity-80" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C48A4A] text-white text-[10px] font-bold uppercase tracking-wider shadow">
                      {item.tag}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-[#E2B882] flex items-center gap-1 border border-white/10">
                    <Star className="w-3 h-3 fill-current text-[#C48A4A]" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-serif-display font-bold text-lg text-white group-hover:text-[#E2B882] transition-colors line-clamp-1">
                      {isUrdu && item.nameUr ? item.nameUr : item.name}
                    </h4>
                    <p className="text-xs text-white/70 line-clamp-2 mt-1 leading-relaxed">
                      {isUrdu && item.descriptionUr ? item.descriptionUr : item.description}
                    </p>
                  </div>

                  {/* Price & Add Button */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="font-serif-display font-bold text-base text-[#E2B882]">
                        {formatPrice(item.price)}
                      </span>
                      {item.calories && (
                        <span className="text-[10px] text-white/50 block">
                          {item.calories} kcal
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, item)}
                      aria-label={`Add ${item.name}`}
                      className={`p-2.5 rounded-full font-bold transition-all active:scale-90 flex items-center justify-center cursor-pointer shadow-md ${
                        isJustAdded
                          ? 'bg-[#2E7D32] text-white'
                          : 'bg-[#C48A4A] hover:bg-[#B37939] text-white'
                      }`}
                    >
                      {isJustAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Link to Full Menu */}
        <div className="pt-2 flex items-center justify-between text-xs text-white/60">
          <span>Total 38 handcrafted creations ready for delivery and dine-in.</span>
          <button
            type="button"
            onClick={onExploreFullMenu}
            className="text-[#E2B882] hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Complete Menu</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
