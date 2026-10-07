import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, X } from 'lucide-react';

export const AnnouncementBanner: React.FC = () => {
  const { siteConfig } = useData();
  const { language } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (!siteConfig.announcementBanner.enabled || dismissed) return null;

  const text =
    language === 'ur'
      ? siteConfig.announcementBanner.textUr
      : siteConfig.announcementBanner.textEn;

  return (
    <div className="relative z-30 bg-[#C48A4A] text-white py-2 px-4 text-xs font-semibold text-center flex items-center justify-center gap-2 select-none shadow-sm">
      <Sparkles className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate max-w-2xl">{text}</span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="ml-2 p-1 rounded-full hover:bg-black/10 transition-colors cursor-pointer shrink-0"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
