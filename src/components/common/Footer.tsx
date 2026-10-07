import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { Phone, MapPin, Clock, Mail, Instagram, Facebook, Send, Heart, Shield, Lock, Bike, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { siteConfig } = useData();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const isUrdu = language === 'ur';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="relative bg-[#0A2A20] text-[#F6EFE3] pt-16 pb-12 border-t border-[#C48A4A]/20 overflow-hidden">
      {/* Subtle background grain & gold accent */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand Info & Voice */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C48A4A] text-white flex items-center justify-center font-serif-display font-bold text-xl shadow-md">
                E
              </div>
              <div>
                <h3 className="font-serif-display text-2xl font-bold tracking-tight">
                  {isUrdu && siteConfig.brandNameUr ? siteConfig.brandNameUr : siteConfig.brandName}
                </h3>
                <span className="text-[11px] uppercase tracking-widest text-[#C48A4A] font-semibold">
                  Solarium & Artisan Roasters
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#F6EFE3]/80 leading-relaxed font-serif-display italic">
              "{isUrdu && siteConfig.taglineUr ? siteConfig.taglineUr : siteConfig.tagline}"
            </p>
            <p className="text-xs text-[#F6EFE3]/60">
              {siteConfig.subTagline}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {siteConfig.instagramUrl && (
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C48A4A] transition-colors flex items-center justify-center text-white"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {siteConfig.facebookUrl && (
                <a
                  href={siteConfig.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C48A4A] transition-colors flex items-center justify-center text-white"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Visiting & Hours */}
          <div className="space-y-4">
            <h4 className="font-serif-display text-base font-bold uppercase tracking-wider text-[#C48A4A]">
              Visiting Hours
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#F6EFE3]/80">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C48A4A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-white">Daily: 11:00 AM – 12:00 AM</span>
                  <span className="text-xs text-[#F6EFE3]/60">Saturdays extended to 1:00 AM</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <MapPin className="w-4 h-4 text-[#C48A4A] shrink-0 mt-0.5" />
                <span>
                  {isUrdu && siteConfig.addressUr ? siteConfig.addressUr : siteConfig.address}
                </span>
              </li>
              <li className="flex items-center gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-[#C48A4A] shrink-0" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-[#C48A4A] transition-colors font-mono">
                  {siteConfig.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-4">
            <h4 className="font-serif-display text-base font-bold uppercase tracking-wider text-[#C48A4A]">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-[#F6EFE3]/80">
              <button
                type="button"
                onClick={() => onNavigate('menu')}
                className="text-left hover:text-[#C48A4A] transition-colors cursor-pointer py-1"
              >
                {t('nav.menu')}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('reservations')}
                className="text-left hover:text-[#C48A4A] transition-colors cursor-pointer py-1"
              >
                {t('nav.reservations')}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('reviews')}
                className="text-left hover:text-[#C48A4A] transition-colors cursor-pointer py-1"
              >
                {t('nav.reviews')}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('giftcards')}
                className="text-left hover:text-[#C48A4A] transition-colors cursor-pointer py-1"
              >
                {t('nav.giftCards')}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('story')}
                className="text-left hover:text-[#C48A4A] transition-colors cursor-pointer py-1"
              >
                {t('nav.story')}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="text-left hover:text-[#C48A4A] transition-colors cursor-pointer py-1"
              >
                {t('nav.contact')}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('table')}
                className="text-left hover:text-[#C48A4A] transition-colors cursor-pointer py-1"
              >
                Table QR Dine-In
              </button>
              <button
                type="button"
                onClick={() => onNavigate('orders')}
                className="text-left hover:text-[#C48A4A] transition-colors cursor-pointer py-1"
              >
                Track Order
              </button>
            </div>
          </div>

          {/* Col 4: Solarium Dispatch Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif-display text-base font-bold uppercase tracking-wider text-[#C48A4A]">
              The Solarium Dispatch
            </h4>
            <p className="text-xs text-[#F6EFE3]/70 leading-relaxed">
              Receive secret menu drops, seasonal roasted beans arrivals, and invitations to acoustic evenings.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-[#2E7D32]/20 border border-[#2E7D32]/40 text-[#6B8F71] text-xs font-semibold">
                ✓ Thank you for subscribing to our dispatch!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 rounded-full bg-white/10 border border-white/20 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C48A4A]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1.5 rounded-full bg-[#C48A4A] text-white hover:bg-[#B37939] transition-colors cursor-pointer"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Subtle Management & Solarium Floor Operations Gateway */}
        <div className="py-6 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#E2B882]">
              <Lock className="w-3.5 h-3.5 text-[#C48A4A]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white/90">
                Solarium Operational Management & Barista Console
              </p>
              <p className="text-[11px] text-[#F6EFE3]/60 leading-relaxed max-w-xl">
                Authorized access for floor managers, kitchen display order processing, catalog inventory, and live delivery dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#C48A4A]/20 text-[#E2B882] border border-[#C48A4A]/30 hover:border-[#C48A4A] transition-all text-xs font-medium cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-[#C48A4A]" />
              <span>Operations & Admin Portal</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('rider')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all text-xs font-medium cursor-pointer"
            >
              <Bike className="w-3.5 h-3.5 text-[#6B8F71]" />
              <span>Dispatch Logistics</span>
            </button>
          </div>
        </div>

        {/* Footer Bottom Legal & Accreditation */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F6EFE3]/60">
          <p>© 2026 {siteConfig.legalBusinessName}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => onNavigate('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate('refunds')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
