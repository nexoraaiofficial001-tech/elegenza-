import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  Star,
  Plus,
  ShoppingBag,
  Check,
  RotateCcw,
} from 'lucide-react';

import icedCoffeeImg from '../../assets/images/hero_3d_iced_coffee_1791374759296.jpg';
import matchaFrappeImg from '../../assets/images/hero_3d_matcha_frappe_1791374790006.jpg';
import hotLatteImg from '../../assets/images/hero_3d_hot_latte_art_1791374820129.jpg';

interface Hero3DExperienceProps {
  onOrderNow: () => void;
  onExploreMenu: () => void;
  onSelectProduct?: (item: any) => void;
}

interface SignatureDrink {
  id: string;
  name: string;
  nameUr: string;
  subtitle: string;
  subtitleUr: string;
  tagline: string;
  roastProfile: string;
  temperature: string;
  price: number;
  calories: number;
  rating: number;
  image: string;
  colorAccent: string;
  flavorNotes: string[];
}

export const Hero3DExperience: React.FC<Hero3DExperienceProps> = ({
  onOrderNow,
  onExploreMenu,
}) => {
  const { language, t, formatPrice } = useLanguage();
  const { addItem, setIsCartOpen } = useCart();
  const isUrdu = language === 'ur';

  const drinks: SignatureDrink[] = [
    {
      id: 'item-iced-caramel',
      name: 'Iced Caramel Cloud',
      nameUr: 'آئسڈ کیریمل کلاؤڈ',
      subtitle: 'Single-origin espresso, cold-pressed whole milk, sea-salt golden caramel drizzle and crystal ice cubes.',
      subtitleUr: 'سنگل اوریجن ایسپریسو، ٹھنڈا دودھ، سنہری کیریمل اور کرسٹل آئس۔',
      tagline: 'CREAMY · RICH · BOLD',
      roastProfile: 'Dark French Roast',
      temperature: 'Iced - 2°C',
      price: 780,
      calories: 240,
      rating: 4.9,
      image: icedCoffeeImg,
      colorAccent: '#C48A4A',
      flavorNotes: ['Toffee', 'Molasses', 'Sea Salt Crema'],
    },
    {
      id: 'item-matcha-cloud',
      name: 'Matcha Pistachio Frappe',
      nameUr: 'ماچا پستہ فریپے',
      subtitle: 'Shaded stone-ground Uji matcha, velvet milk foam, whipped cream spiral and roasted pistachio dust.',
      subtitleUr: 'جاپانی اوبی ماچا، پستہ کرسٹ اور مائیکرو فوم کریم۔',
      tagline: 'EARTHY · SWEET · VELVETY',
      roastProfile: 'Artisan Ceremonial',
      temperature: 'Blended - 0°C',
      price: 850,
      calories: 290,
      rating: 5.0,
      image: matchaFrappeImg,
      colorAccent: '#6B8F71',
      flavorNotes: ['Green Tea', 'Crushed Pistachio', 'Vanilla Cloud'],
    },
    {
      id: 'item-swan-latte',
      name: 'Artisan Swan Latte',
      nameUr: 'دست کار سوان لاٹے',
      subtitle: 'Double shot extraction pulled over textured whole microfoam, decorated with barista champion swan pour.',
      subtitleUr: 'تازہ ڈبل شاٹ ایسپریسو اور مائیکروفوم دودھ پر سوان لاٹے آرٹ۔',
      tagline: 'SILKY · FLORAL · AROMATIC',
      roastProfile: 'High-Altitude Arabica',
      temperature: 'Hot - 65°C',
      price: 750,
      calories: 160,
      rating: 4.9,
      image: hotLatteImg,
      colorAccent: '#E2B882',
      flavorNotes: ['Dark Chocolate', 'Nutmeg', 'Velvet Crema'],
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  // 3D Mouse Parallax State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const currentDrink = drinks[activeIndex];

  const nextDrink = () => {
    setActiveIndex((prev) => (prev + 1) % drinks.length);
  };

  const prevDrink = () => {
    setActiveIndex((prev) => (prev - 1 + drinks.length) % drinks.length);
  };

  const handleQuickAddCurrent = () => {
    addItem({
      id: currentDrink.id,
      name: currentDrink.name,
      nameUr: currentDrink.nameUr,
      slug: currentDrink.name.toLowerCase().replace(/\s+/g, '-'),
      description: currentDrink.subtitle,
      descriptionUr: currentDrink.subtitleUr,
      categoryId: 'cat-coffee',
      price: currentDrink.price,
      image: currentDrink.image,
      tags: ['Signature', '3D Featured'],
      allergens: ['Dairy'],
      dietary: ['Vegetarian', 'Halal'],
      spiceLevel: 0,
      calories: currentDrink.calories,
      isVeg: true,
      isSpicy: false,
      isNew: true,
      isPopular: true,
      isFeatured: true,
      available: true,
      variants: [],
      addOns: [],
      sortOrder: 1,
    });
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setIsCartOpen(true);
    }, 500);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[90vh] lg:min-h-screen flex flex-col justify-between pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0A2A20] via-[#0F3D2E] to-[#144434] text-[#F6EFE3] overflow-hidden select-none"
    >
      {/* ═══ 3D DEPTH BACKGROUND: GIANT TYPOGRAPHY & LIGHTING ═══ */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        {/* Giant COFFEE / ELEGANZA typographic background with 3D parallax */}
        <motion.div
          animate={{
            x: mousePos.x * -40,
            y: mousePos.y * -30,
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 150 }}
          className="font-serif-display font-black text-[22vw] leading-none text-white/[0.05] tracking-widest uppercase text-center transform scale-105"
        >
          COFFEE
        </motion.div>

        {/* Ambient radial lighting glow */}
        <div
          className="absolute w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full blur-[140px] opacity-35 transition-colors duration-700 pointer-events-none"
          style={{ backgroundColor: currentDrink.colorAccent }}
        />
      </div>

      {/* 3D Floating Coffee Beans with Depth Blur */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[
          { x: 10, y: 20, size: 48, depth: 1.2, blur: 2, rot: 15 },
          { x: 85, y: 15, size: 54, depth: 1.5, blur: 3, rot: -30 },
          { x: 22, y: 70, size: 36, depth: 0.8, blur: 0, rot: 45 },
          { x: 78, y: 65, size: 62, depth: 2.0, blur: 4, rot: -20 },
          { x: 48, y: 82, size: 40, depth: 1.0, blur: 1, rot: 60 },
          { x: 6, y: 45, size: 38, depth: 0.9, blur: 1, rot: -40 },
          { x: 92, y: 42, size: 44, depth: 1.3, blur: 2, rot: 25 },
        ].map((bean, i) => (
          <motion.div
            key={i}
            animate={{
              x: mousePos.x * 60 * bean.depth,
              y: mousePos.y * 50 * bean.depth + Math.sin(Date.now() / 1000 + i) * 6,
              rotate: [bean.rot, bean.rot + 12, bean.rot],
            }}
            transition={{
              x: { type: 'spring', damping: 20, stiffness: 120 },
              y: { type: 'spring', damping: 20, stiffness: 120 },
              rotate: { duration: 6 + i, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{
              position: 'absolute',
              left: `${bean.x}%`,
              top: `${bean.y}%`,
              width: bean.size,
              height: bean.size * 1.35,
              filter: `blur(${bean.blur}px) drop-shadow(0 12px 20px rgba(0,0,0,0.6))`,
            }}
            className="opacity-70"
          >
            <svg viewBox="0 0 40 54" fill="none" className="w-full h-full">
              <path
                d="M20 2C9 2 2 13 2 27C2 41 9 52 20 52C31 52 38 41 38 27C38 13 31 2 20 2Z"
                fill="#3A2316"
                stroke="#5A3822"
                strokeWidth="2"
              />
              <path
                d="M20 6C16 16 26 24 18 34C14 40 22 46 20 48"
                stroke="#E2B882"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* ═══ MAIN 3D SHOWCASE GRID ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1 my-auto">
        {/* Left Column: Editorial Coffee Narrative */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left order-2 lg:order-1">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest uppercase text-[#E2B882]">
            <Sparkles className="w-3.5 h-3.5 text-[#C48A4A]" />
            <span>SOLARIUM ARTISAN SANCTUARY</span>
          </div>

          {/* Fluid Fraunces Headline */}
          <h1 className="font-serif-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.08]">
            An Elevated <br />
            <span
              className="italic underline decoration-[#C48A4A] decoration-wavy decoration-2 transition-colors duration-500"
              style={{ textDecorationColor: currentDrink.colorAccent }}
            >
              Coffee Experience
            </span>
          </h1>

          {/* Active Drink Name & Description */}
          <div className="space-y-2 max-w-lg mx-auto lg:mx-0">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span
                className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded-md"
                style={{ backgroundColor: `${currentDrink.colorAccent}33`, color: currentDrink.colorAccent }}
              >
                {currentDrink.tagline}
              </span>
              <span className="text-xs text-white/60 font-mono">
                {currentDrink.temperature}
              </span>
            </div>

            <h3 className="font-serif-display font-bold text-2xl sm:text-3xl text-[#F6EFE3]">
              {isUrdu ? currentDrink.nameUr : currentDrink.name}
            </h3>

            <p className="text-sm text-white/80 leading-relaxed font-light">
              {isUrdu ? currentDrink.subtitleUr : currentDrink.subtitle}
            </p>

            {/* Flavor Notes Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 pt-1">
              {currentDrink.flavorNotes.map((note) => (
                <span
                  key={note}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/30 border border-white/15 text-white/90"
                >
                  ✦ {note}
                </span>
              ))}
            </div>
          </div>

          {/* Price & Primary CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <div className="flex items-baseline gap-2">
              <span className="font-serif-display font-bold text-3xl sm:text-4xl text-[#E2B882]">
                {formatPrice(currentDrink.price)}
              </span>
              <span className="text-xs text-white/60 line-through">
                {formatPrice(currentDrink.price + 180)}
              </span>
            </div>

            <Button
              variant="caramel"
              size="lg"
              onClick={handleQuickAddCurrent}
              leftIcon={justAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
              className="shadow-caramel text-sm font-bold active:scale-95 transition-transform"
            >
              {justAdded ? 'Added to Cart!' : 'Order This Creation'}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={onExploreMenu}
              className="border-white/30 text-white hover:bg-white/10 text-sm"
            >
              Full Menu
            </Button>
          </div>

          {/* Metric Badges */}
          <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 border-t border-white/15 text-xs text-white/70">
            <div>
              <span className="font-bold text-base text-white block">4.9 ★</span>
              <span>1,730+ Reviews</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <span className="font-bold text-base text-white block">{currentDrink.calories} kcal</span>
              <span>Nutrient Balanced</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <span className="font-bold text-base text-white block">100% Fresh</span>
              <span>Halal Certified</span>
            </div>
          </div>
        </div>

        {/* Center / Right Column: 3D HERO BEVERAGE CENTERPIECE WITH PERSPECTIVE TILT */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative order-1 lg:order-2">
          {/* Main 3D Card Stage with Cursor Parallax */}
          <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[520px] aspect-square flex items-center justify-center">
            {/* Scalloped 3D "Order Now" Starburst Badge (Image 4 Inspo) */}
            <motion.div
              animate={{
                rotate: 360,
                x: mousePos.x * -20,
                y: mousePos.y * -20,
              }}
              transition={{
                rotate: { duration: 22, repeat: Infinity, ease: 'linear' },
                x: { type: 'spring', damping: 25 },
                y: { type: 'spring', damping: 25 },
              }}
              className="absolute -top-4 -left-2 sm:left-4 z-30 cursor-pointer"
              onClick={handleQuickAddCurrent}
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                {/* 16-point starburst shape */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#C48A4A] filter drop-shadow-lg">
                  <path
                    d="M50 0 L61 15 L78 9 L82 27 L99 31 L93 48 L100 64 L84 72 L80 90 L62 86 L50 100 L38 86 L20 90 L16 72 L0 64 L7 48 L1 31 L18 27 L22 9 L39 15 Z"
                    fill="currentColor"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center font-serif-display font-extrabold leading-tight">
                  <span className="text-[11px] sm:text-xs uppercase tracking-wider">Order</span>
                  <span className="text-sm sm:text-base italic">now</span>
                </div>
              </div>
            </motion.div>

            {/* Inverted Ground Shadow */}
            <motion.div
              animate={{
                scale: [1, 0.88, 1],
                opacity: [0.4, 0.25, 0.4],
                x: mousePos.x * 20,
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 w-3/4 h-12 bg-black rounded-full blur-2xl pointer-events-none"
            />

            {/* 3D Realistic Photorealistic Beverage with Mouse Tilt */}
            <motion.div
              animate={{
                rotateX: mousePos.y * -28,
                rotateY: mousePos.x * 28,
                y: [0, -14, 0],
              }}
              transition={{
                rotateX: { type: 'spring', damping: 20, stiffness: 140 },
                rotateY: { type: 'spring', damping: 20, stiffness: 140 },
                y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{
                perspective: 1200,
                transformStyle: 'preserve-3d',
              }}
              className="relative z-10 w-full h-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.7)] group cursor-grab active:cursor-grabbing"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentDrink.id}
                  src={currentDrink.image}
                  alt={currentDrink.name}
                  initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </AnimatePresence>

              {/* Glossy Glass Highlight Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 pointer-events-none" />

              {/* Floating Coffee & Co Monogram Tag */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-semibold flex items-center gap-1.5 text-white">
                <span className="w-2 h-2 rounded-full bg-[#C48A4A] animate-ping" />
                <span>Solarium 3D Studio</span>
              </div>
            </motion.div>
          </div>

          {/* Interactive Flavor Switcher Strip (Image 1 Inspo: Prev, Flavour, Next) */}
          <div className="mt-8 flex items-center justify-center gap-3 bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/15 shadow-xl">
            <button
              type="button"
              onClick={prevDrink}
              aria-label="Previous Drink"
              className="p-2.5 rounded-full bg-white/10 hover:bg-[#C48A4A] text-white transition-all active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Drink Dots & Labels */}
            <div className="flex items-center gap-2 px-2">
              {drinks.map((d, index) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeIndex === index
                      ? 'bg-[#0F3D2E] text-white border border-[#C48A4A] shadow'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {index === 0 ? 'Iced Caramel' : index === 1 ? 'Matcha Frappe' : 'Artisan Latte'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={nextDrink}
              aria-label="Next Drink"
              className="p-2.5 rounded-full bg-white/10 hover:bg-[#C48A4A] text-white transition-all active:scale-90 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ FLOATING MENU TRAY DOCK ("floating menue come s") ═══ */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="relative z-20 max-w-5xl mx-auto w-full mt-6"
      >
        <div className="bg-[#0A2A20]/80 backdrop-blur-xl border border-white/15 rounded-3xl p-3 sm:p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C48A4A] text-white flex items-center justify-center font-bold text-lg shadow-md">
              ☕
            </div>
            <div>
              <span className="font-serif-display font-bold text-sm sm:text-base text-white block">
                Freshly Brewed Solarium Menu
              </span>
              <span className="text-xs text-white/60">
                100% Single-Origin Arabica & Wood-Fired Delights · Faisalabad
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-[#E2B882] font-semibold mr-2 hidden md:flex">
              <span>Delivery from Rs 150</span>
              <span>•</span>
              <span>Free over Rs 3,000</span>
            </div>

            <button
              type="button"
              onClick={onOrderNow}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-[#C48A4A] hover:bg-[#B37939] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-caramel active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Open Online Order</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
