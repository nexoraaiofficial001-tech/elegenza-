import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { MenuCard } from '../components/menu/MenuCard';
import { MenuItem } from '../../shared/types';
import { BellRing, Receipt, Coffee, Sparkles, CheckCircle2 } from 'lucide-react';

interface TableOrderingPageProps {
  tableNo: string;
  onOpenItemDetail: (item: MenuItem) => void;
  onNavigateMenu: () => void;
}

export const TableOrderingPage: React.FC<TableOrderingPageProps> = ({
  tableNo,
  onOpenItemDetail,
  onNavigateMenu,
}) => {
  const { language, t, formatPrice } = useLanguage();
  const { setTableNo, setOrderType, setIsCartOpen } = useCart();
  const { menuItems, createStaffCall } = useData();

  const [callMessage, setCallMessage] = useState<string | null>(null);

  useEffect(() => {
    setTableNo(tableNo);
    setOrderType('dine_in');
  }, [tableNo, setTableNo, setOrderType]);

  const handleCall = (type: 'call_waiter' | 'request_bill') => {
    createStaffCall(tableNo, type);
    setCallMessage(
      type === 'call_waiter'
        ? `Waiter notified for Table ${tableNo}! A team member is on the way.`
        : `Bill requested for Table ${tableNo}! Preparing your itemized receipt.`
    );
    setTimeout(() => setCallMessage(null), 4000);
  };

  const tableTopPicks = menuItems.filter((i) => i.isPopular || i.isFeatured).slice(0, 8);

  return (
    <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Table Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0F3D2E] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E2B882] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Table Experience</span>
          </div>
          <h1 className="font-serif-display font-bold text-3xl sm:text-4xl">
            Welcome to Table {tableNo}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl">
            Browse our full bilingual menu and order straight to the kitchen without waiting. No login or OTP needed for dine-in guests!
          </p>
        </div>

        {/* Quick Staff Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleCall('call_waiter')}
            className="px-4 py-3 rounded-2xl bg-white text-[#0F3D2E] hover:bg-[#F6EFE3] text-xs font-bold flex items-center gap-2 shadow cursor-pointer active:scale-95 transition-all"
          >
            <BellRing className="w-4 h-4 text-[#C48A4A]" />
            Call Waiter
          </button>
          <button
            type="button"
            onClick={() => handleCall('request_bill')}
            className="px-4 py-3 rounded-2xl bg-[#C48A4A] text-white hover:bg-[#B37939] text-xs font-bold flex items-center gap-2 shadow cursor-pointer active:scale-95 transition-all"
          >
            <Receipt className="w-4 h-4" />
            Request Bill
          </button>
        </div>
      </div>

      {callMessage && (
        <div className="p-4 rounded-2xl bg-[#2E7D32]/10 border border-[#2E7D32]/30 text-[#2E7D32] text-xs font-bold text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{callMessage}</span>
        </div>
      )}

      {/* Recommended Items for Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-display font-bold text-2xl text-[#0F3D2E] dark:text-[#F6EFE3]">
              Popular at the Table
            </h3>
            <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
              Quick appetizers, wood-fired pizzas, and cold coffee coolers.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onNavigateMenu}>
            Browse Full Menu
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tableTopPicks.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onOpenDetail={onOpenItemDetail}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
