'use client';

import React, { useState } from 'react';
import { usePromotorStore } from '@/store/usePromotorStore';
import { 
  LayoutGrid, 
  Crosshair, 
  FileText, 
  FileCode,
  ArrowLeftRight, 
  Radio, 
  FileCheck, 
  Server, 
  SplitSquareVertical, 
  Sigma, 
  Layers, 
  FileCheck2, 
  Clock,
  Minus,
  Plus,
  Zap,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentPage, setCurrentPage, currentRole } = usePromotorStore();

  // Collapsible Groups state (default all open)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    workspace: true,
    pelaksanaan: true,
    pengawasan: true,
    persediaan: true,
    master: true,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const navGroups: NavGroup[] = [
    {
      id: 'workspace',
      title: 'WORKSPACE',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
        { id: 'survey', label: 'Survey', icon: Crosshair },
        { id: 'daftung', label: 'Daftung', icon: FileText },
      ],
    },
    {
      id: 'pelaksanaan',
      title: 'PELAKSANAAN',
      items: [
        { id: 'wo', label: 'Work Order', icon: FileCode },
        { id: 'vendor', label: 'Vendor & Pengambilan', icon: ArrowLeftRight },
      ],
    },
    {
      id: 'pengawasan',
      title: 'PENGAWASAN',
      items: [
        { id: 'monitoring', label: 'Monitoring Pengawas', icon: Radio },
        { id: 'sj', label: 'Verifikasi Surat Jalan', icon: FileCheck },
      ],
    },
    {
      id: 'persediaan',
      title: 'PERSEDIAAN',
      items: [
        { id: 'warehouse', label: 'Stok Gudang', icon: Server },
        { id: 'need', label: 'Kebutuhan Material', icon: SplitSquareVertical },
        { id: 'analysis', label: 'Analisis Material', icon: Sigma },
      ],
    },
    {
      id: 'master',
      title: 'MASTER & ADMINISTRASI',
      items: [
        { id: 'masterwo', label: 'Mapping Material per Jenis WO', icon: ArrowLeftRight },
        { id: 'std', label: 'STD Konstruksi', icon: Layers },
        { id: 'contract', label: 'Kontrak', icon: FileCheck2 },
        { id: 'audit', label: 'Laporan & Riwayat', icon: Clock },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-white text-slate-800 border-r border-slate-200/90 flex flex-col transition-transform duration-200 font-sans shadow-xs
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#fff7d6] border border-[#f5d752] flex items-center justify-center shadow-xs">
              <Zap className="w-4 h-4 fill-[#00a2b9] text-[#e01a22]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-sm text-[#0c3c60] tracking-tight">
                PLN <span className="text-[10px] text-slate-400 font-semibold">UP3 BANTEN SELATAN</span>
              </div>
              <div className="text-[10px] font-bold text-slate-700 tracking-wider flex items-center gap-1">
                PROMOTOR <span className="text-[9px] bg-sky-100 text-sky-700 font-mono px-1 py-0.2 rounded font-semibold">V1.0</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active User Profile Card */}
        <div className="p-3.5 pb-2">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-xs shrink-0 shadow-2xs">
              👨‍💼
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-800 truncate">Budi Santoso, S.T.</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span className="text-[10px] font-semibold text-blue-700">{currentRole}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu with Exact Collapsible Groups */}
        <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-3 scrollbar-thin">
          {navGroups.map((group) => {
            const isGroupOpen = !!openGroups[group.id];

            return (
              <div key={group.id} className="space-y-1">
                {/* Collapsible Header [-] / [+] */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between py-1 px-1 text-[10.5px] font-bold tracking-wider text-slate-400 hover:text-slate-700 transition-colors uppercase"
                >
                  <span>{group.title}</span>
                  <span className="text-slate-400 hover:text-slate-600 p-0.5">
                    {isGroupOpen ? <Minus className="w-3.5 h-3.5 stroke-[2.5]" /> : <Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </span>
                </button>

                {/* Submenu Items */}
                {isGroupOpen && (
                  <div className="space-y-0.5 animate-in fade-in duration-150">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCurrentPage(item.id);
                            onClose();
                          }}
                          className={`
                            w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left
                            ${isActive 
                              ? 'bg-[#0066cc] text-white font-bold shadow-md shadow-blue-500/20' 
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}
                          `}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/60 space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 font-medium">
            <span>RBAC Aktif</span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Role Protected
            </span>
          </div>

          <button
            onClick={() => alert('Simulasi Sesi: Keluar Akun')}
            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" /> Keluar (Logout)
          </button>
        </div>
      </aside>
    </>
  );
};
