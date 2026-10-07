import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Shield,
  Coffee,
  Bike,
  User,
  QrCode,
  LayoutDashboard,
  Printer,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface DemoBarProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const DemoBar: React.FC<DemoBarProps> = ({ onNavigate }) => {
  const { user, loginAsDemo } = useAuth();
  const { staffCalls, orders } = useData();
  const [collapsed, setCollapsed] = useState(false);

  const pendingCalls = staffCalls.filter((c) => c.status === 'pending').length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  return (
    <aside aria-label="Demo Controls" className="fixed top-0 left-0 right-0 z-50 bg-[#1C130D] text-[#F6EFE3] text-xs border-b border-[#C48A4A]/40 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-3">
        {/* Left: Active Persona Display */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C48A4A]/20 border border-[#C48A4A]/40 text-[#E2B882] font-semibold text-[11px]">
            <Sparkles className="w-3 h-3 text-[#C48A4A]" />
            <span>Interactive Demo:</span>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <span className="font-bold text-white truncate max-w-[180px] sm:max-w-none">
              {user?.email || 'nexora.aiofficial001@gmail.com'}
            </span>
            <span className="px-2 py-0.5 rounded-full uppercase text-[10px] font-extrabold bg-[#0F3D2E] text-[#E2B882] border border-[#C48A4A]/50">
              {user?.role || 'admin'}
            </span>
          </div>
        </div>

        {/* Center: Quick Switch Roles */}
        {!collapsed && (
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-gray-400 mr-1">Switch Role:</span>

            <button
              type="button"
              onClick={() => {
                loginAsDemo('admin');
                onNavigate('admin');
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                user?.role === 'admin'
                  ? 'bg-[#0F3D2E] text-[#E2B882] border border-[#C48A4A]'
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Admin</span>
              {pendingOrders > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#C0392B]" />}
            </button>

            <button
              type="button"
              onClick={() => {
                loginAsDemo('staff');
                onNavigate('admin');
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                user?.role === 'staff'
                  ? 'bg-[#0F3D2E] text-[#E2B882] border border-[#C48A4A]'
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              <Coffee className="w-3 h-3" />
              <span>Staff / Barista</span>
              {pendingCalls > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#C48A4A] text-white text-[9px] font-bold">
                  {pendingCalls}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                loginAsDemo('rider');
                onNavigate('rider');
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                user?.role === 'rider'
                  ? 'bg-[#0F3D2E] text-[#E2B882] border border-[#C48A4A]'
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              <Bike className="w-3 h-3" />
              <span>Rider Kashif</span>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAsDemo('customer');
                onNavigate('profile');
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                user?.role === 'customer'
                  ? 'bg-[#0F3D2E] text-[#E2B882] border border-[#C48A4A]'
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              <User className="w-3 h-3" />
              <span>Customer Amina</span>
            </button>
          </div>
        )}

        {/* Right: Quick Demo Shortcuts & Collapse Toggle */}
        <div className="flex items-center gap-2">
          {!collapsed && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onNavigate('table', '4')}
                className="px-2.5 py-1 rounded-full bg-[#C48A4A] hover:bg-[#B37939] text-white text-[11px] font-bold flex items-center gap-1 shadow cursor-pointer"
                title="Test Table 4 QR ordering mode"
              >
                <QrCode className="w-3 h-3" />
                <span className="hidden sm:inline">Table 4 QR</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#E2B882] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                title="Open Admin Operations Console"
              >
                <LayoutDashboard className="w-3 h-3" />
                <span className="hidden sm:inline">Admin Hub</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed((p) => !p)}
            className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label={collapsed ? 'Expand Demo Controls' : 'Collapse Demo Controls'}
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
