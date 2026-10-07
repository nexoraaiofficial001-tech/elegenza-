import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { CategoryTabs } from '../components/menu/CategoryTabs';
import { MenuCard } from '../components/menu/MenuCard';
import { MenuItem, DietaryTag, Allergen } from '../../shared/types';
import { Search, SlidersHorizontal, X, Clock, Flame, Leaf } from 'lucide-react';

interface MenuPageProps {
  initialCategoryId?: string;
  onOpenItemDetail: (item: MenuItem) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  initialCategoryId = 'all',
  onOpenItemDetail,
}) => {
  const { language, t, isRtl, formatPrice } = useLanguage();
  const { menuItems, categories, siteConfig } = useData();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategoryId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');

  // Filters state
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filterVegOnly, setFilterVegOnly] = useState<boolean>(false);
  const [filterSpicyOnly, setFilterSpicyOnly] = useState<boolean>(false);
  const [filterNewOnly, setFilterNewOnly] = useState<boolean>(false);
  const [filterPopularOnly, setFilterPopularOnly] = useState<boolean>(false);
  const [excludedAllergens, setExcludedAllergens] = useState<Allergen[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(3500);
  const [sortBy, setSortBy] = useState<'recommended' | 'priceAsc' | 'priceDesc' | 'popular'>('recommended');

  // Debounce search query 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategoryId(initialCategoryId);
    }
  }, [initialCategoryId]);

  // Check if cafe is currently open
  const isCafeOpen = useMemo(() => {
    const now = new Date();
    // Pakistan time is UTC+5
    const hour = now.getHours();
    // Opens 11 AM (11) and closes 12 AM midnight (00:00)
    return hour >= 11 || hour === 0;
  }, []);

  const allergenList: Allergen[] = ['Dairy', 'Nuts', 'Gluten', 'Soy', 'Eggs'];

  // Filtered and Sorted Menu Items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (selectedCategoryId !== 'all' && item.categoryId !== selectedCategoryId) {
        return false;
      }

      // Search query (English & Urdu matching)
      if (debouncedQuery.trim()) {
        const q = debouncedQuery.toLowerCase().trim();
        const matchesEn = item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
        const matchesUr = item.nameUr?.toLowerCase().includes(q) || item.descriptionUr?.toLowerCase().includes(q);
        const matchesTags = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesEn && !matchesUr && !matchesTags) {
          return false;
        }
      }

      // Dietary filters
      if (filterVegOnly && !item.isVeg) return false;
      if (filterSpicyOnly && !item.isSpicy && item.spiceLevel === 0) return false;
      if (filterNewOnly && !item.isNew) return false;
      if (filterPopularOnly && !item.isPopular) return false;

      // Exclude Allergens filter
      if (excludedAllergens.length > 0) {
        const hasExcluded = item.allergens?.some((a) => excludedAllergens.includes(a));
        if (hasExcluded) return false;
      }

      // Price ceiling
      if (item.price > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      return a.sortOrder - b.sortOrder;
    });
  }, [
    menuItems,
    selectedCategoryId,
    debouncedQuery,
    filterVegOnly,
    filterSpicyOnly,
    filterNewOnly,
    filterPopularOnly,
    excludedAllergens,
    maxPrice,
    sortBy,
  ]);

  const toggleAllergen = (al: Allergen) => {
    setExcludedAllergens((prev) =>
      prev.includes(al) ? prev.filter((a) => a !== al) : [...prev, al]
    );
  };

  const resetFilters = () => {
    setFilterVegOnly(false);
    setFilterSpicyOnly(false);
    setFilterNewOnly(false);
    setFilterPopularOnly(false);
    setExcludedAllergens([]);
    setMaxPrice(3500);
    setSortBy('recommended');
  };

  const hasActiveFilters =
    filterVegOnly ||
    filterSpicyOnly ||
    filterNewOnly ||
    filterPopularOnly ||
    excludedAllergens.length > 0 ||
    maxPrice < 3500 ||
    sortBy !== 'recommended';

  return (
    <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Tagline */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="font-serif-display font-bold text-4xl sm:text-5xl text-[#0F3D2E] dark:text-[#F6EFE3]">
          The Eleganza Menu
        </h1>
        <p className="text-sm sm:text-base text-[#6B5E55] dark:text-[#C5B5A5] leading-relaxed">
          Crafted with single-origin beans, house-made fruit cordials, wood fire embers, and slow simmered reductions.
        </p>
      </div>

      {/* Outside Opening Hours Notice */}
      {!isCafeOpen && (
        <div className="p-4 rounded-2xl bg-[#ED9B1B]/15 border border-[#ED9B1B]/30 flex items-center justify-between text-xs sm:text-sm text-[#ED9B1B] font-medium">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0" />
            <span>{t('menu.closedNotice')}</span>
          </div>
          <span className="font-bold underline cursor-pointer">
            {t('menu.scheduleOrder')}
          </span>
        </div>
      )}

      {/* Search Bar & Filter Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t('menu.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-full border border-[#2B1B12]/15 dark:border-white/10 bg-white dark:bg-[#0A2A20] text-sm text-[#2B1B12] dark:text-[#F6EFE3] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3 text-gray-400 hover:text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Drawer Toggle Button */}
        <button
          type="button"
          onClick={() => setShowFilters((p) => !p)}
          className={`px-5 py-3 rounded-full border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            showFilters || hasActiveFilters
              ? 'bg-[#0F3D2E] text-white border-[#0F3D2E]'
              : 'bg-white dark:bg-[#0A2A20] text-[#2B1B12] dark:text-[#F6EFE3] border-[#2B1B12]/15 hover:border-[#0F3D2E]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{t('menu.filters')}</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-[#C48A4A]" />
          )}
        </button>
      </div>

      {/* Expanded Filters Drawer */}
      {showFilters && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-6 shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-serif-display font-bold text-base text-[#0F3D2E] dark:text-[#E2B882]">
              Refine Your Palette
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-[#C0392B] hover:underline font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dietary Checkboxes */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B5E55] dark:text-[#C5B5A5]">
                Dietary Preferences
              </label>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterVegOnly}
                    onChange={(e) => setFilterVegOnly(e.target.checked)}
                    className="rounded text-[#0F3D2E]"
                  />
                  <span>{t('menu.filterVeg')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterSpicyOnly}
                    onChange={(e) => setFilterSpicyOnly(e.target.checked)}
                    className="rounded text-[#0F3D2E]"
                  />
                  <span>{t('menu.filterSpicy')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterNewOnly}
                    onChange={(e) => setFilterNewOnly(e.target.checked)}
                    className="rounded text-[#0F3D2E]"
                  />
                  <span>{t('menu.filterNew')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterPopularOnly}
                    onChange={(e) => setFilterPopularOnly(e.target.checked)}
                    className="rounded text-[#0F3D2E]"
                  />
                  <span>{t('menu.filterPopular')}</span>
                </label>
              </div>
            </div>

            {/* Exclude Allergens */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B5E55] dark:text-[#C5B5A5]">
                {t('menu.allergensExclude')}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {allergenList.map((al) => {
                  const isExcluded = excludedAllergens.includes(al);
                  return (
                    <button
                      key={al}
                      type="button"
                      onClick={() => toggleAllergen(al)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        isExcluded
                          ? 'bg-[#C0392B] text-white border-[#C0392B]'
                          : 'bg-white dark:bg-[#1C130D] text-[#2B1B12] dark:text-[#F6EFE3] border-gray-200'
                      }`}
                    >
                      {isExcluded ? `✕ No ${al}` : al}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[#6B5E55] dark:text-[#C5B5A5]">
                <span>Max Price</span>
                <span className="text-[#0F3D2E] dark:text-[#E2B882]">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={450}
                max={3500}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#0F3D2E]"
              />
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B5E55] dark:text-[#C5B5A5]">
                {t('menu.sortBy')}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#2B1B12]/15 dark:border-white/10 bg-white dark:bg-[#1C130D] text-xs font-medium"
              >
                <option value="recommended">{t('menu.sortDefault')}</option>
                <option value="popular">{t('menu.sortPopular')}</option>
                <option value="priceAsc">{t('menu.sortPriceLow')}</option>
                <option value="priceDesc">{t('menu.sortPriceHigh')}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Category Tabs Bar */}
      <div className="sticky top-20 z-30 bg-[#F6EFE3]/95 dark:bg-[#1C130D]/95 backdrop-blur-md py-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-y border-[#2B1B12]/8">
        <CategoryTabs
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
      </div>

      {/* Items Results Count */}
      <div className="flex items-center justify-between text-xs text-[#6B5E55] dark:text-[#C5B5A5] pt-2">
        <span>Showing {filteredItems.length} items</span>
        {selectedCategoryId !== 'all' && (
          <button
            type="button"
            onClick={() => setSelectedCategoryId('all')}
            className="text-[#0F3D2E] dark:text-[#E2B882] underline cursor-pointer"
          >
            Show All
          </button>
        )}
      </div>

      {/* Items Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#EADFCB] dark:bg-[#1C130D] flex items-center justify-center mx-auto text-[#6B5E55]">
            <Search className="w-8 h-8 opacity-60" />
          </div>
          <h4 className="text-xl font-bold font-serif-display">No dishes matched your filters</h4>
          <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
            Try relaxing your allergen exclusions, clearing search terms, or increasing the max price.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-full bg-[#0F3D2E] text-white text-xs font-bold shadow"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onOpenDetail={onOpenItemDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
};
