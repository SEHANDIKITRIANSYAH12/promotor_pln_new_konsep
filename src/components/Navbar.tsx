'use client';

import React, { useState } from 'react';
import { usePromotorStore } from '@/store/usePromotorStore';
import { Role } from '@/types';
import { RefreshCw, ChevronDown, Check, LogOut, Zap, Shield, User, Menu } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { currentRole, setCurrentRole, currentPage, toastMessage, clearToast, showToast } = usePromotorStore();
  const [isRbacOpen, setIsRbacOpen] = useState(false);

  const titles: Record<string, { title: string; sub: string }> = {
    dashboard: { title: 'SURVEY PELANGGAN', sub: 'Proses survey lapangan & kalkulasi material otomatis' },
    survey: { title: 'SURVEY PELANGGAN', sub: 'Proses survey lapangan & kalkulasi material otomatis' },
    daftung: { title: 'DAFTAR TUNGGU (DAFTUNG)', sub: 'Monitoring SLA & verifikasi data pelanggan AP2T' },
    wo: { title: 'WORK ORDER (WO)', sub: 'Penerbitan perintah kerja & alokasi kontrak vendor' },
    monitoring: { title: 'PENGAWASAN LAPANGAN', sub: 'Reservasi material & monitoring progres konstruksi' },
    warehouse: { title: 'GUDANG & LOGISTIK', sub: 'Stok fisik gudang & sinkronisasi SAP' },
    contract: { title: 'KONTRAK JASA & MATERIAL', sub: 'Pagu kontrak, sisa anggaran, dan SPK vendor' },
    need: { title: 'KEBUTUHAN MATERIAL', sub: 'Kalkulasi kekurangan dan analisis kebutuhan proyek' },
    audit: { title: 'AUDIT LOG AKTIVITAS', sub: 'Jejak rekam historis setiap aktivitas sistem' },
    std: { title: 'STANDAR KONSTRUKSI', sub: 'Master matriks konstruksi TM/TR & BOM' },
  };

  const headerInfo = titles[currentPage] || { title: 'PROMOTOR PLN', sub: 'Sistem Monitoring & Material Kontrol' };

  const rbacUsers = [
    {
      name: 'Budi Santoso, S.T.',
      sub: 'Super Administrator / Admin',
      role: 'Admin Daftung' as Role,
      badge: 'Super Admin',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    },
    {
      name: 'Ahmad Fauzi',
      sub: 'Petugas Survey Lapangan',
      role: 'Pengawas' as Role,
      badge: 'Surveyor',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    },
    {
      name: 'Faisal Reza, S.T.',
      sub: 'Pengawas Teknik Konstruksi',
      role: 'Admin WO' as Role,
      badge: 'Pengawas Teknik',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    {
      name: 'Siti Rahmawati',
      sub: 'Admin Logistik & Gudang',
      role: 'Admin Gudang' as Role,
      badge: 'Admin Gudang',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
  ];

  return (
    <>
      <header className="h-20 bg-white border-b border-slate-200/80 sticky top-0 z-20 px-4 lg:px-8 flex items-center justify-between shadow-2xs">
        {/* Left: Module Title & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base lg:text-lg font-black text-slate-900 tracking-tight uppercase">
              {headerInfo.title}
            </h1>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {headerInfo.sub}
            </p>
          </div>
        </div>

        {/* Right: PLN Unit Badge, Sync Data Button, and RBAC User Switcher Dropdown */}
        <div className="flex items-center gap-3">
          {/* PLN UP3 Banten Selatan Small Logo Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs">
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-red-600" />
            <span className="font-bold text-[11px] text-slate-800">PLN UP3 BANTEN SELATAN</span>
          </div>

          {/* Sync Data Button */}
          <button
            onClick={() => showToast('Sinkronisasi data berhasil: Data AP2T & Fisik Gudang terbarukan')}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-2xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Sync Data</span>
          </button>

          {/* RBAC User Account Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsRbacOpen(!isRbacOpen)}
              className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 shadow-2xs transition text-left"
            >
              <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-xs shadow-2xs">
                👨‍💼
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">Budi Santoso, S.T.</span>
                  <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 border border-purple-200">
                    {currentRole}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">PLN ULP Rangkasbitung</div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-0.5" />
            </button>

            {/* RBAC Modal Dropdown (Exactly Matching Mockup) */}
            {isRbacOpen && (
              <div className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="pb-3 border-b border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    SIMULASI AKUN & HAK AKSES (RBAC)
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5 leading-snug">
                    Pilih role untuk menguji tampilan menu & izin aksi:
                  </div>
                </div>

                <div className="py-2 space-y-1.5">
                  {rbacUsers.map((u, idx) => {
                    const isSelected = currentRole === u.role;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentRole(u.role);
                          setIsRbacOpen(false);
                          showToast(`Hak akses berganti ke: ${u.badge} (${u.role})`);
                        }}
                        className={`
                          w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all
                          ${isSelected 
                            ? 'bg-blue-50/70 border-blue-300 shadow-2xs' 
                            : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'}
                        `}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm shrink-0">
                            👤
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{u.name}</div>
                            <div className="text-[10px] text-slate-400">{u.sub}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded border ${u.badgeColor}`}>
                            {u.badge}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    💡 Info: Akun Terotentikasi
                  </span>
                  <button
                    onClick={() => setIsRbacOpen(false)}
                    className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg font-bold text-xs flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" /> Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Centralized Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="text-xs font-medium">{toastMessage}</span>
          <button 
            onClick={clearToast}
            className="text-slate-400 hover:text-white text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};
