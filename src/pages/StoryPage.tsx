import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Coffee, Sun, Compass, Heart } from 'lucide-react';

export const StoryPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { siteConfig } = useData();
  const isUrdu = language === 'ur';

  return (
    <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C48A4A]">
          The Heritage & Philosophy
        </span>
        <h1 className="font-serif-display font-bold text-4xl sm:text-6xl text-[#0F3D2E] dark:text-[#F6EFE3] leading-tight">
          Where Afternoon Pauses and Coffee Stays
        </h1>
        <p className="font-serif-display italic text-lg sm:text-xl text-[#6B5E55] dark:text-[#C5B5A5]">
          "Remember when coffee meant staying a little longer? The cups emptied. The afternoon stayed."
        </p>
      </div>

      {/* Main Narrative Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-sm sm:text-base text-[#6B5E55] dark:text-[#C5B5A5] leading-relaxed">
          <h3 className="font-serif-display font-bold text-2xl text-[#0F3D2E] dark:text-[#E2B882]">
            The Solarium Concept
          </h3>
          <p>
            Located on Green Avenue off West Canal Road in Faisalabad, Cafe Eleganza was envisioned as an antidote to rush.
            Instead of a dark, hurried corridor, we built an airy glass conservatory solarium where winter sun and monsoon rain are visible from every corner.
          </p>
          <p>
            Surrounded by botanical planters, polished terracotta, and brass finishes, our guests come to read, share intimate family conversations, and savor handcrafted beverages that cannot be rushed.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#0A2A20]">
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80"
            alt="Solarium Architecture"
            className="w-full h-80 object-cover"
          />
        </div>
      </div>

      {/* Culinary Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center md:flex-row-reverse">
        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#0A2A20]">
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80"
            alt="Wood-Fired Pizza Creation"
            className="w-full h-80 object-cover"
          />
        </div>

        <div className="space-y-4 text-sm sm:text-base text-[#6B5E55] dark:text-[#C5B5A5] leading-relaxed">
          <h3 className="font-serif-display font-bold text-2xl text-[#0F3D2E] dark:text-[#E2B882]">
            Artisan Roasts & Wood Embers
          </h3>
          <p>
            Our coffee program pairs single-origin Arabica with bespoke roasting profiles designed for high extraction sweetness.
            Whether pulling an authentic Portuguese Galao or shaking citrus-infused Limka coolers with mountain salts, precision guides every gesture.
          </p>
          <p>
            At the heart of our kitchen stands a wood-fired stone hearth baking sourdough pizzas at blistering temperatures, delivering blistered crusts topped with fresh fior di latte and prime meats.
          </p>
        </div>
      </div>

      {/* Values Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-2 text-center">
          <div className="w-12 h-12 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] dark:text-[#E2B882] flex items-center justify-center mx-auto">
            <Coffee className="w-6 h-6" />
          </div>
          <h4 className="font-serif-display font-bold text-base text-[#0F3D2E] dark:text-[#F6EFE3]">
            Ethical Sourcing
          </h4>
          <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
            High-altitude coffee beans sourced with respect for sustainable farms and local purity.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-2 text-center">
          <div className="w-12 h-12 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] dark:text-[#E2B882] flex items-center justify-center mx-auto">
            <Sun className="w-6 h-6" />
          </div>
          <h4 className="font-serif-display font-bold text-base text-[#0F3D2E] dark:text-[#F6EFE3]">
            Natural Ambiance
          </h4>
          <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
            Greenhouse architecture bathed in organic sunlight, designed for peaceful longevity.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-2 text-center">
          <div className="w-12 h-12 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] dark:text-[#E2B882] flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h4 className="font-serif-display font-bold text-base text-[#0F3D2E] dark:text-[#F6EFE3]">
            Warm Hospitality
          </h4>
          <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
            From prompt table QR ordering to personalized barista touches, every guest is cherished.
          </p>
        </div>
      </div>
    </div>
  );
};
