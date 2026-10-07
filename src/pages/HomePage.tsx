import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { Hero3DExperience } from '../components/common/Hero3DExperience';
import { FloatingMenuShowcase } from '../components/common/FloatingMenuShowcase';
import { Marquee } from '../components/common/Marquee';
import { MenuCard } from '../components/menu/MenuCard';
import { Button } from '../components/ui/Button';
import { MenuItem } from '../../shared/types';
import {
  Sparkles,
  ArrowRight,
  Star,
  Users,
  CheckCircle2,
  Coffee,
  Sun,
  Flame,
  Clock,
  ChevronLeft,
  ChevronRight,
  Gift,
  X,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string, param?: string) => void;
  onOpenItemDetail: (item: MenuItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenItemDetail }) => {
  const { language, t, isRtl } = useLanguage();
  const { menuItems, categories, reviews, siteConfig } = useData();
  const { setIsCartOpen } = useCart();

  const isUrdu = language === 'ur';

  // Specials (Seasonal & Signature)
  const specials = menuItems.filter((i) => i.isFeatured || i.isNew).slice(0, 6);
  // Popular Picks
  const popularPicks = menuItems.filter((i) => i.isPopular).slice(0, 8);

  // Reviews carousel state
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [reviewPaused, setReviewPaused] = useState(false);

  useEffect(() => {
    if (reviewPaused || reviews.length <= 1) return;
    const interval = setInterval(() => {
      setActiveReviewIdx((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reviewPaused, reviews.length]);

  // Gallery Lightbox State
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  return (
    <div className="w-full overflow-hidden">
      {/* ═══ 1. 3D INTERACTIVE SHOWCASE HERO (INSPO ALIGNED) ═══ */}
      <Hero3DExperience
        onOrderNow={() => onNavigate('menu')}
        onExploreMenu={() => onNavigate('menu')}
      />

      {/* ═══ 2. 3D FLOATING MENU SHOWCASE (INSPO ALIGNED) ═══ */}
      <FloatingMenuShowcase
        onOpenDetail={onOpenItemDetail}
        onExploreFullMenu={() => onNavigate('menu')}
      />

      {/* ═══ 3. BILINGUAL MARQUEE ═══ */}
      <div className="pt-10">
        <Marquee />
      </div>

      {/* ═══ 3. HOUSE SPECIALS SNAP CAROUSEL ═══ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C48A4A] mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visual Diary '26 Highlights</span>
            </div>
            <h2 className="font-serif-display font-bold text-3xl sm:text-4xl text-[#0F3D2E] dark:text-[#F6EFE3]">
              {t('specials.title')}
            </h2>
            <p className="text-sm text-[#6B5E55] dark:text-[#C5B5A5] mt-1 max-w-xl">
              {t('specials.subtitle')}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => onNavigate('menu')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {t('hero.viewMenu')}
          </Button>
        </div>

        {/* Specials Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {specials.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onOpenDetail={onOpenItemDetail}
            />
          ))}
        </div>
      </section>

      {/* ═══ 4. ABOUT & THE ELEGANZA SOLARIUM STORY ═══ */}
      <section className="py-20 bg-[#EADFCB]/50 dark:bg-[#0A2A20]/40 border-y border-[#2B1B12]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Visual Imagery: Overlapping Glass Solarium & Coffee Collage */}
            <div className="lg:col-span-6 relative">
              <div className="relative z-10 w-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#0A2A20]">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80"
                  alt="Cafe Eleganza Solarium Conservatory"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-2 sm:right-4 z-20 w-3/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#0A2A20]">
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
                  alt="Espresso Crafting"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>

            {/* Narrative & 4 Pillars */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C48A4A]">
                <span>{t('about.badge')}</span>
              </div>
              <h2 className="font-serif-display font-bold text-3xl sm:text-4xl text-[#0F3D2E] dark:text-[#F6EFE3] leading-snug">
                {t('about.title')}
              </h2>
              <p className="text-sm sm:text-base text-[#6B5E55] dark:text-[#C5B5A5] leading-relaxed">
                {t('about.p1')}
              </p>
              <p className="text-sm sm:text-base text-[#6B5E55] dark:text-[#C5B5A5] leading-relaxed">
                {t('about.p2')}
              </p>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/8 space-y-1">
                  <div className="w-8 h-8 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] dark:text-[#E2B882] flex items-center justify-center">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif-display font-bold text-sm text-[#0F3D2E] dark:text-[#F6EFE3]">
                    {t('about.pillar1Title')}
                  </h4>
                  <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
                    {t('about.pillar1Desc')}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/8 space-y-1">
                  <div className="w-8 h-8 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] dark:text-[#E2B882] flex items-center justify-center">
                    <Sun className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif-display font-bold text-sm text-[#0F3D2E] dark:text-[#F6EFE3]">
                    {t('about.pillar2Title')}
                  </h4>
                  <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
                    {t('about.pillar2Desc')}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/8 space-y-1">
                  <div className="w-8 h-8 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] dark:text-[#E2B882] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif-display font-bold text-sm text-[#0F3D2E] dark:text-[#F6EFE3]">
                    {t('about.pillar3Title')}
                  </h4>
                  <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
                    {t('about.pillar3Desc')}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/8 space-y-1">
                  <div className="w-8 h-8 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] dark:text-[#E2B882] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif-display font-bold text-sm text-[#0F3D2E] dark:text-[#F6EFE3]">
                    {t('about.pillar4Title')}
                  </h4>
                  <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
                    {t('about.pillar4Desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. POPULAR PICKS GRID (8 ITEMS) ═══ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C48A4A]">
            <Flame className="w-3.5 h-3.5" />
            <span>Beloved By Faisalabad</span>
          </div>
          <h2 className="font-serif-display font-bold text-3xl sm:text-4xl text-[#0F3D2E] dark:text-[#F6EFE3]">
            Crowd Favorites
          </h2>
          <p className="text-sm text-[#6B5E55] dark:text-[#C5B5A5]">
            From artisan steaks to wood-fired pepperoni and cold brews, here are the plates ordered again and again.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularPicks.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onOpenDetail={onOpenItemDetail}
            />
          ))}
        </div>
      </section>

      {/* ═══ 6. CATEGORY CARDS TO /menu?category= ═══ */}
      <section className="py-16 bg-[#F6EFE3] dark:bg-[#1C130D] border-t border-[#2B1B12]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-serif-display font-bold text-2xl text-[#0F3D2E] dark:text-[#F6EFE3] mb-6">
            Browse By Category
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onNavigate('menu', cat.id)}
                className="p-5 rounded-2xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 hover:border-[#C48A4A] shadow-sm hover:shadow-caramel transition-all text-center flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#0F3D2E]/10 group-hover:bg-[#C48A4A] group-hover:text-white transition-colors flex items-center justify-center text-[#0F3D2E] dark:text-[#E2B882]">
                  <Coffee className="w-6 h-6" />
                </div>
                <span className="font-serif-display font-bold text-sm text-[#2B1B12] dark:text-[#F6EFE3]">
                  {isUrdu && cat.nameUr ? cat.nameUr : cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. VISUAL DIARY '26 PHOTO GALLERY WITH LIGHTBOX ═══ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C48A4A]">
            Photography Series
          </span>
          <h2 className="font-serif-display font-bold text-3xl sm:text-4xl text-[#0F3D2E] dark:text-[#F6EFE3]">
            Visual Diary '26
          </h2>
          <p className="text-sm text-[#6B5E55] dark:text-[#C5B5A5]">
            Snapshots of afternoon light, hot espresso pours, and quiet corners in our conservatory.
          </p>
        </div>

        {/* Masonry Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {siteConfig.galleryImages.map((img) => (
            <div
              key={img.id}
              onClick={() => setLightboxImg(img.url)}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-md group cursor-pointer"
            >
              <img
                src={img.url}
                alt={img.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-xs font-semibold text-white tracking-wide">
                  {img.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Lightbox Modal */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setLightboxImg(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 text-white hover:bg-white/40"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImg}
            alt="Enlarged view"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}

      {/* ═══ 8. REVIEWS SLIDER (6S AUTO-LOOP) ═══ */}
      <section className="py-20 bg-[#0F3D2E] text-[#F6EFE3] overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E2B882] text-xs font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>4.9 / 5.0 (1,730+ Reviews)</span>
          </div>

          <h2 className="font-serif-display font-bold text-3xl sm:text-4xl">
            Words From Our Guests
          </h2>

          <div
            onMouseEnter={() => setReviewPaused(true)}
            onMouseLeave={() => setReviewPaused(false)}
            className="relative min-h-[160px] flex items-center justify-center"
          >
            {reviews[activeReviewIdx] && (
              <motion.div
                key={reviews[activeReviewIdx].id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 max-w-2xl"
              >
                <div className="flex justify-center gap-1 text-[#E2B882]">
                  {Array.from({ length: reviews[activeReviewIdx].rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-lg sm:text-xl font-serif-display italic leading-relaxed">
                  "{reviews[activeReviewIdx].comment}"
                </p>
                <p className="text-sm font-bold text-[#E2B882]">
                  — {reviews[activeReviewIdx].userName}
                </p>
              </motion.div>
            )}
          </div>

          {/* Dots & Nav */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveReviewIdx(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  activeReviewIdx === idx ? 'w-8 bg-[#C48A4A]' : 'bg-white/30'
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 9. RESERVATION & GIFT CARDS BANNER CTA ═══ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reservation Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#EADFCB] dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C48A4A]">
              Dine In With Us
            </span>
            <h3 className="font-serif-display font-bold text-2xl sm:text-3xl text-[#0F3D2E] dark:text-[#F6EFE3]">
              Reserve Your Sunlit Table
            </h3>
            <p className="text-sm text-[#6B5E55] dark:text-[#C5B5A5] leading-relaxed">
              Planning an anniversary dinner, family gathering, or a quiet afternoon coffee session? Reserve ahead for dedicated conservatory seating.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('reservations')}
            >
              Book a Table Now
            </Button>
          </div>

          {/* Gift Card Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0F3D2E] text-[#F6EFE3] space-y-5 relative overflow-hidden">
            <div className="relative z-10 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C48A4A] flex items-center gap-1.5">
                <Gift className="w-4 h-4" />
                <span>Memories to Share</span>
              </span>
              <h3 className="font-serif-display font-bold text-2xl sm:text-3xl text-white">
                Cafe Eleganza Gift Cards
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Gift someone an afternoon of specialty coffee, wood-fired pizzas, and artisan coolers with a personalized digital card.
              </p>
              <Button
                variant="caramel"
                size="lg"
                onClick={() => onNavigate('giftcards')}
              >
                Explore Gift Cards
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
