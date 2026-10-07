import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Sun,
  Moon,
  Globe,
  Coffee,
  Shield,
  Bike,
  User,
  Bell,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenStaffModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenStaffModal }) => {
  const { language, toggleLanguage, t, isRtl } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { itemCount, setIsCartOpen } = useCart();
  const { siteConfig } = useData();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: t('nav.home') },
    { id: 'menu', label: t('nav.menu') },
    { id: 'reservations', label: t('nav.reservations') },
    { id: 'reviews', label: t('nav.reviews') },
    { id: 'giftcards', label: t('nav.giftCards') },
    { id: 'story', label: t('nav.story') },
    { id: 'contact', label: t('nav.contact') },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A2A20]/95 backdrop-blur-md py-3 shadow-2xl border-b border-white/10 text-[#F6EFE3]'
            : 'bg-[#0A2A20]/60 backdrop-blur-md py-4 border-b border-white/10 text-[#F6EFE3]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Monogram */}
          <button
            type="button"
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#0F3D2E] text-[#F6EFE3] flex items-center justify-center font-serif-display font-bold text-xl border-2 border-[#C48A4A] shadow-caramel-sm group-hover:scale-105 transition-transform">
              E
            </div>
            <div>
              <span className="font-serif-display font-extrabold text-xl sm:text-2xl tracking-tight text-white group-hover:text-[#E2B882] transition-colors">
                {language === 'ur' && siteConfig.brandNameUr ? siteConfig.brandNameUr : siteConfig.brandName}
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-[#E2B882] font-semibold">
                Solarium · Faisalabad
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => onNavigate(link.id)}
                  className={`relative text-sm font-medium transition-colors cursor-pointer py-1 ${
                    isActive
                      ? 'text-[#E2B882] font-semibold'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C48A4A] rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Tools: Language, Theme, Cart Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Bilingual Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="p-2 rounded-full border border-[#2B1B12]/15 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#C48A4A]" />
              <span>{language === 'en' ? 'اردو' : 'EN'}</span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full border border-[#2B1B12]/15 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-xs cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-[#2B1B12]" /> : <Sun className="w-4 h-4 text-[#ED9B1B]" />}
            </button>

            {/* Cart Button with Bouncing Badge */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-[#0F3D2E] text-white hover:bg-[#C48A4A] transition-all flex items-center gap-2 shadow-caramel-sm active:scale-95 cursor-pointer"
              aria-label="Open Cart Drawer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-bold tracking-wide">
                {t('nav.cart')}
              </span>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.25, 1] }}
                  className="w-5 h-5 rounded-full bg-[#C48A4A] text-white text-[11px] font-bold flex items-center justify-center -ml-1 sm:ml-0"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((p) => !p)}
              className="lg:hidden p-2 rounded-full border border-[#2B1B12]/15 dark:border-white/10 hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#F6EFE3] dark:bg-[#0A2A20] border-b border-[#2B1B12]/10 px-6 py-6 space-y-3 overflow-hidden shadow-xl"
            >
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 font-serif-display font-semibold text-lg text-[#2B1B12] dark:text-[#F6EFE3] hover:text-[#C48A4A]"
                >
                  {link.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
