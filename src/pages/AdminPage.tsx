import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { MenuItem, Category, Order, OrderStatus } from '../../shared/types';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Calendar,
  BellRing,
  QrCode,
  Tag,
  Gift,
  Settings,
  FileText,
  Printer,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Download,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import QRCode from 'qrcode';

export const AdminPage: React.FC = () => {
  const { language, formatPrice, isRtl } = useLanguage();
  const {
    menuItems,
    categories,
    orders,
    reservations,
    staffCalls,
    promos,
    giftCards,
    tables,
    siteConfig,
    auditLogs,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    updateItemStock,
    updateOrderStatus,
    assignRider,
    acknowledgeStaffCall,
    updateReservationStatus,
    addPromo,
    togglePromo,
    updateSiteConfig,
    clearAdminAlerts,
  } = useData();
  const { user, isAdmin, isStaff } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'orders' | 'menu' | 'reservations' | 'staffCalls' | 'tables' | 'promos' | 'settings' | 'audit'
  >('dashboard');

  // Order Filters
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [selectedTicketOrder, setSelectedTicketOrder] = useState<Order | null>(null);

  // Menu Editor Modal
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreatingItem, setIsCreatingItem] = useState<boolean>(false);
  const [itemForm, setItemForm] = useState<{
    name: string;
    nameUr: string;
    description: string;
    descriptionUr: string;
    price: number;
    categoryId: string;
    image: string;
    isVeg: boolean;
    isSpicy: boolean;
    isNew: boolean;
    isPopular: boolean;
    isFeatured: boolean;
    stockCount?: number;
  }>({
    name: '',
    nameUr: '',
    description: '',
    descriptionUr: '',
    price: 800,
    categoryId: 'cat-coffee',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isSpicy: false,
    isNew: false,
    isPopular: false,
    isFeatured: false,
    stockCount: 50,
  });

  // Table QR Code Data URLs
  const [qrCodeUrls, setQrCodeUrls] = useState<Record<string, string>>({});

  const generateAllQrs = async () => {
    const urls: Record<string, string> = {};
    const baseUrl = window.location.origin;
    for (const table of tables) {
      try {
        const url = await QRCode.toDataURL(`${baseUrl}/t/${table.number}`, {
          margin: 2,
          width: 250,
          color: { dark: '#0F3D2E', light: '#FFFFFF' },
        });
        urls[table.number] = url;
      } catch {}
    }
    setQrCodeUrls(urls);
  };

  // Metrics calculations
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;
  const lowStockCount = menuItems.filter((i) => typeof i.stockCount === 'number' && i.stockCount <= 10).length;

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      siteConfig,
      menuItems,
      categories,
      orders,
      reservations,
      promos,
      tables,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eleganza-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  // Kitchen ticket print handler
  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Admin Subheader & Navigation Pills */}
      <div className="p-6 rounded-3xl bg-[#0F3D2E] text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#E2B882]">
            Cafe Eleganza Operations Portal
          </span>
          <h2 className="font-serif-display font-bold text-2xl sm:text-3xl">
            Management Dashboard
          </h2>
          <p className="text-xs text-white/80">
            Real-time orders, wood-oven dispatch, menu availability, and table reservations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="caramel"
            onClick={handleExportBackup}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Backup
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              clearAdminAlerts();
            }}
          >
            Acknowledge Alerts
          </Button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-[#EADFCB] dark:bg-[#1C130D] rounded-2xl text-xs font-bold">
        {[
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'staffCalls', label: `Staff Calls (${staffCalls.filter((c) => c.status === 'pending').length})`, icon: BellRing },
          { id: 'menu', label: `Menu (${menuItems.length})`, icon: UtensilsCrossed },
          { id: 'reservations', label: `Reservations (${reservations.length})`, icon: Calendar },
          { id: 'tables', label: 'QR Tables', icon: QrCode },
          { id: 'promos', label: 'Promos & Codes', icon: Tag },
          { id: 'settings', label: 'Settings', icon: Settings },
          { id: 'audit', label: 'Audit Log', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0F3D2E] text-white shadow'
                  : 'text-[#2B1B12] dark:text-[#F6EFE3] hover:bg-black/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═══ TAB 1: DASHBOARD METRICS ═══ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-1 shadow-sm">
              <span className="text-[11px] font-bold text-[#6B5E55] dark:text-[#C5B5A5] uppercase">
                Total Revenue (PKR)
              </span>
              <span className="font-serif-display font-black text-2xl sm:text-3xl text-[#0F3D2E] dark:text-[#E2B882] block">
                {formatPrice(totalRevenue)}
              </span>
              <span className="text-[10px] text-[#2E7D32] font-semibold">Active live sessions</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-1 shadow-sm">
              <span className="text-[11px] font-bold text-[#6B5E55] dark:text-[#C5B5A5] uppercase">
                Pending Orders
              </span>
              <span className="font-serif-display font-black text-2xl sm:text-3xl text-[#C48A4A] block">
                {pendingCount}
              </span>
              <span className="text-[10px] text-[#6B5E55]">In kitchen queue</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-1 shadow-sm">
              <span className="text-[11px] font-bold text-[#6B5E55] dark:text-[#C5B5A5] uppercase">
                Reservations Today
              </span>
              <span className="font-serif-display font-black text-2xl sm:text-3xl text-[#0F3D2E] dark:text-[#E2B882] block">
                {reservations.length}
              </span>
              <span className="text-[10px] text-[#6B5E55]">Total booked guests</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-1 shadow-sm">
              <span className="text-[11px] font-bold text-[#6B5E55] dark:text-[#C5B5A5] uppercase">
                Low Stock Alerts
              </span>
              <span className="font-serif-display font-black text-2xl sm:text-3xl text-[#C0392B] block">
                {lowStockCount}
              </span>
              <span className="text-[10px] text-[#C0392B] font-semibold">≤ 10 portions remaining</span>
            </div>
          </div>

          {/* Quick Order Breakdown & Peak Hours Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-4">
              <h3 className="font-serif-display font-bold text-lg text-[#0F3D2E] dark:text-[#E2B882]">
                Order Distribution By Type
              </h3>
              <div className="space-y-3 text-xs">
                {['delivery', 'dine_in', 'pickup'].map((type) => {
                  const count = orders.filter((o) => o.type === type).length;
                  const pct = Math.round((count / (orders.length || 1)) * 100);
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between font-bold">
                        <span className="capitalize">{type.replace('_', ' ')}</span>
                        <span>{count} orders ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div
                          className="h-full bg-[#0F3D2E] dark:bg-[#C48A4A]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-4">
              <h3 className="font-serif-display font-bold text-lg text-[#0F3D2E] dark:text-[#E2B882]">
                Top Culinary Sellers
              </h3>
              <div className="space-y-2.5 text-xs">
                {menuItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                    <span className="font-bold">{item.name}</span>
                    <span className="text-[#C48A4A] font-semibold">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 2: LIVE ORDERS MANAGEMENT ═══ */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#0A2A20] p-4 rounded-2xl border border-[#2B1B12]/10">
            <div className="flex gap-2 text-xs font-semibold">
              {['all', 'pending', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-full capitalize cursor-pointer ${
                    orderFilter === st
                      ? 'bg-[#0F3D2E] text-white'
                      : 'bg-[#F6EFE3] text-[#2B1B12] dark:bg-black/30 dark:text-[#F6EFE3]'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {orders
              .filter((o) => orderFilter === 'all' || o.status === orderFilter)
              .map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-4 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2B1B12]/8 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-lg text-[#0F3D2E] dark:text-[#E2B882]">
                        {order.orderNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EADFCB] text-[11px] font-bold uppercase text-[#2B1B12] dark:bg-black/30 dark:text-[#E2B882]">
                        {order.type} {order.tableNo ? `(T${order.tableNo})` : ''}
                      </span>
                      <span className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
                        {order.customerName} ({order.phone})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-serif-display font-bold text-lg text-[#0F3D2E] dark:text-[#E2B882]">
                        {formatPrice(order.total)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedTicketOrder(order)}
                        leftIcon={<Printer className="w-3.5 h-3.5" />}
                      >
                        Print Ticket
                      </Button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="text-xs text-[#2B1B12] dark:text-[#F6EFE3] space-y-1">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          <strong>{i.quantity}x</strong> {i.name}{' '}
                          {i.selectedVariant && `(${i.selectedVariant.name})`}
                          {i.notes && <em className="text-[#6B5E55] ml-2">"{i.notes}"</em>}
                        </span>
                        <span className="font-semibold">{formatPrice(i.price * i.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Status Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#2B1B12]/8">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#6B5E55]">Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="p-1.5 rounded-xl border text-xs font-bold bg-[#F6EFE3] dark:bg-[#1C130D]"
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="out_for_delivery">Out for delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {order.type === 'delivery' && !order.riderName && (
                      <Button
                        size="sm"
                        variant="caramel"
                        onClick={() => assignRider(order.id, 'r-1', 'Kashif (Honda CD70)', '0300-5240034')}
                      >
                        Assign Rider Kashif
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ═══ TAB 3: STAFF CALLS (WAITER / BILL) ═══ */}
      {activeTab === 'staffCalls' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 flex items-center justify-between">
            <h3 className="font-serif-display font-bold text-lg text-[#0F3D2E] dark:text-[#E2B882]">
              Table Assistance Calls
            </h3>
          </div>

          <div className="space-y-3">
            {staffCalls.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0A2A20] border text-xs text-gray-400">
                No active waiter calls or bill requests.
              </div>
            ) : (
              staffCalls.map((call) => (
                <div
                  key={call.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    call.status === 'pending'
                      ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300'
                      : 'bg-white dark:bg-[#0A2A20] border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        call.type === 'call_waiter' ? 'bg-[#0F3D2E] text-white' : 'bg-[#C48A4A] text-white'
                      }`}
                    >
                      T{call.tableNo}
                    </div>
                    <div>
                      <span className="font-bold text-sm block">
                        {call.type === 'call_waiter' ? 'Call Waiter Assistance' : 'Request Bill / Payment'}
                      </span>
                      <span className="text-[11px] text-[#6B5E55] dark:text-[#C5B5A5]">
                        Time: {new Date(call.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {call.status === 'pending' ? (
                    <Button
                      size="sm"
                      variant="caramel"
                      onClick={() => acknowledgeStaffCall(call.id)}
                    >
                      Acknowledge & Clear
                    </Button>
                  ) : (
                    <span className="text-xs text-[#2E7D32] font-bold">Acknowledged ✓</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ═══ TAB 4: MENU MANAGER ═══ */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-[#0A2A20] p-4 rounded-2xl border border-[#2B1B12]/10">
            <h3 className="font-serif-display font-bold text-lg text-[#0F3D2E] dark:text-[#E2B882]">
              Menu Manager ({menuItems.length} Items)
            </h3>
            <Button
              size="sm"
              variant="caramel"
              onClick={() => setIsCreatingItem(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Dish / Drink
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="font-bold text-sm text-[#2B1B12] dark:text-[#F6EFE3] truncate">
                      {item.name}
                    </h5>
                    <span className="text-xs text-[#C48A4A] font-serif-display font-bold block">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-[11px] text-[#6B5E55]">
                      Stock: {typeof item.stockCount === 'number' ? item.stockCount : 'Unlimited'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleItemAvailability(item.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      item.available
                        ? 'bg-[#2E7D32]/10 text-[#2E7D32]'
                        : 'bg-[#C0392B]/10 text-[#C0392B]'
                    }`}
                  >
                    {item.available ? 'Available' : '86 / Sold Out'}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteMenuItem(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Modal */}
          {isCreatingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-3xl bg-[#F6EFE3] dark:bg-[#0A2A20] p-6 space-y-4 border shadow-2xl">
                <h4 className="font-serif-display font-bold text-xl text-[#0F3D2E] dark:text-[#E2B882]">
                  Add Culinary Item
                </h4>
                <div className="space-y-3 text-xs">
                  <input
                    type="text"
                    placeholder="English Name (e.g. Vanilla Bean Frappe)"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-white dark:bg-[#1C130D]"
                  />
                  <input
                    type="text"
                    placeholder="Urdu Name (e.g. ونیلا بین فریپے)"
                    value={itemForm.nameUr}
                    onChange={(e) => setItemForm({ ...itemForm, nameUr: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-white dark:bg-[#1C130D]"
                  />
                  <input
                    type="number"
                    placeholder="Price in PKR (e.g. 850)"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border bg-white dark:bg-[#1C130D]"
                  />
                  <textarea
                    rows={2}
                    placeholder="English Description"
                    value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-white dark:bg-[#1C130D]"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsCreatingItem(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="caramel"
                    size="sm"
                    onClick={() => {
                      if (!itemForm.name) return;
                      addMenuItem({
                        ...itemForm,
                        slug: itemForm.name.toLowerCase().replace(/\s+/g, '-'),
                        tags: ['New'],
                        allergens: ['Dairy'],
                        dietary: ['Vegetarian', 'Halal'],
                        spiceLevel: 0,
                        available: true,
                        variants: [],
                        addOns: [],
                        sortOrder: 99,
                      });
                      setIsCreatingItem(false);
                    }}
                  >
                    Save Item
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ TAB 5: QR TABLES & PRINT SHEETS ═══ */}
      {activeTab === 'tables' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10">
            <div>
              <h3 className="font-serif-display font-bold text-xl text-[#0F3D2E] dark:text-[#E2B882]">
                Branded QR Table Codes ({tables.length} Tables)
              </h3>
              <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
                Generate print-ready A4 table cards with Cafe Eleganza logo and 'Scan to order'.
              </p>
            </div>
            <Button variant="caramel" onClick={generateAllQrs} leftIcon={<QrCode className="w-4 h-4" />}>
              Generate Printable QR Cards
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {tables.map((table) => {
              const qrUrl = qrCodeUrls[table.number];
              return (
                <div
                  key={table.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 text-center space-y-3 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0F3D2E] text-white font-serif-display font-bold text-base flex items-center justify-center mx-auto">
                    {table.number}
                  </div>
                  <h5 className="font-bold text-sm text-[#0F3D2E] dark:text-[#E2B882]">
                    {table.name}
                  </h5>

                  {qrUrl ? (
                    <div className="p-2 bg-white rounded-2xl border shadow-inner inline-block">
                      <img src={qrUrl} alt={`Table ${table.number} QR`} className="w-36 h-36 mx-auto" />
                    </div>
                  ) : (
                    <div className="w-36 h-36 bg-[#EADFCB] dark:bg-black/30 rounded-2xl flex items-center justify-center mx-auto text-xs text-gray-400">
                      Click Generate
                    </div>
                  )}

                  <a
                    href={`/t/${table.number}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#C48A4A] underline block"
                  >
                    Open /t/{table.number}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ TAB 6: SETTINGS ═══ */}
      {activeTab === 'settings' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-6">
          <h3 className="font-serif-display font-bold text-xl text-[#0F3D2E] dark:text-[#E2B882]">
            Cafe Eleganza System Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="font-bold block mb-1">Brand Name (English)</label>
              <input
                type="text"
                value={siteConfig.brandName}
                onChange={(e) => updateSiteConfig({ brandName: e.target.value })}
                className="w-full p-2.5 rounded-xl border bg-[#F6EFE3] dark:bg-[#1C130D]"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Official Phone</label>
              <input
                type="text"
                value={siteConfig.phone}
                onChange={(e) => updateSiteConfig({ phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border bg-[#F6EFE3] dark:bg-[#1C130D]"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">WhatsApp Dispatch Number</label>
              <input
                type="text"
                value={siteConfig.whatsappNumber}
                onChange={(e) => updateSiteConfig({ whatsappNumber: e.target.value })}
                className="w-full p-2.5 rounded-xl border bg-[#F6EFE3] dark:bg-[#1C130D]"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">GST Tax Rate (%)</label>
              <input
                type="number"
                value={siteConfig.gstRate}
                onChange={(e) => updateSiteConfig({ gstRate: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border bg-[#F6EFE3] dark:bg-[#1C130D]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold block mb-1">Physical Address</label>
              <input
                type="text"
                value={siteConfig.address}
                onChange={(e) => updateSiteConfig({ address: e.target.value })}
                className="w-full p-2.5 rounded-xl border bg-[#F6EFE3] dark:bg-[#1C130D]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══ PRINTABLE KITCHEN TICKET MODAL (80MM THERMAL STYLE) ═══ */}
      {selectedTicketOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white text-black p-6 rounded-2xl shadow-2xl font-mono text-xs space-y-4">
            <div className="text-center border-b pb-3 border-dashed border-black">
              <h4 className="font-bold text-base tracking-widest">CAFE ELEGANZA</h4>
              <p className="text-[10px]">SOLARIUM & ARTISAN COFFEE</p>
              <p className="text-[10px]">West Canal Rd, Faisalabad</p>
              <div className="mt-2 text-sm font-bold">
                {selectedTicketOrder.orderNumber}
              </div>
              <div className="text-[11px] font-bold uppercase mt-1">
                TYPE: {selectedTicketOrder.type} {selectedTicketOrder.tableNo ? `(TABLE ${selectedTicketOrder.tableNo})` : ''}
              </div>
            </div>

            <div className="space-y-1.5 border-b pb-3 border-dashed border-black">
              {selectedTicketOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{it.quantity}x {it.name}</span>
                  <span>{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-right border-b pb-3 border-dashed border-black">
              <div>Subtotal: {formatPrice(selectedTicketOrder.subtotal)}</div>
              <div>Tax (GST 16%): {formatPrice(selectedTicketOrder.tax)}</div>
              <div className="font-bold text-sm">TOTAL: {formatPrice(selectedTicketOrder.total)}</div>
            </div>

            <div className="text-center text-[10px] space-y-1">
              <p>Thank you for visiting Eleganza Solarium!</p>
              <p>Come make another one worth remembering.</p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="caramel" className="flex-1" onClick={handlePrintTicket}>
                Print 80mm ESC/POS
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedTicketOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
