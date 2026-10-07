import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const Marquee: React.FC = () => {
  const { isRtl } = useLanguage();

  const itemsEn = [
    'Freshly Roasted Beans',
    'Handcrafted Limka Coolers',
    'East Corner Specialties',
    'Wood-Fired Pizza',
    'Solarium Sunroom Ambiance',
    'Open Daily Until 12 AM',
    'The Ube Plan 2026',
    '100% Halal Certified',
  ];

  const itemsUr = [
    'تازہ بھنی ہوئی کافی',
    'دست ساز لمکا کولرز',
    'ایسٹ کارنر ایشین کھانے',
    'لکڑی کے تندور کا پیزا',
    'خوبصورت شیشے کا سولاریم',
    'روزانہ رات 12 بجے تک کھلا',
    'نیا اوبے لاٹے 2026',
    '100٪ تازہ و حلال',
  ];

  const items = isRtl ? itemsUr : itemsEn;

  return (
    <div className="relative w-full overflow-hidden bg-[#0F3D2E] text-[#F6EFE3] py-3.5 border-y border-[#C48A4A]/30 select-none group">
      <div
        className={`flex whitespace-nowrap gap-12 font-medium text-sm tracking-widest uppercase transition-all duration-300 ${
          isRtl ? 'animate-marquee-rtl' : 'animate-marquee'
        } group-hover:[animation-play-state:paused]`}
      >
        {items.concat(items).map((item, idx) => (
          <div key={idx} className="inline-flex items-center gap-6 shrink-0">
            <span>{item}</span>
            <span className="text-[#C48A4A] text-lg">✦</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-rtl {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 26s linear infinite;
        }
        .animate-marquee-rtl {
          animation: marquee-rtl 26s linear infinite;
        }
      `}</style>
    </div>
  );
};
