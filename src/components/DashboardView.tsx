'use client';

import React from 'react';
import { usePromotorStore } from '@/store/usePromotorStore';
import { 
  Plus, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  FileCheck2,
  TrendingUp,
  FileText,
  Boxes,
  Zap,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { daftungs, workOrders, surveys, stocks, setCurrentPage } = usePromotorStore();

  const daftungAktif = 39;
  const woBerjalan = workOrders.length > 0 ? workOrders.length : 2;
  const suratJalanMenunggu = 5;
  const materialBelumAlokasi = 18;

  const steps = [
    { id: 'std', label: 'STD', sub: 'Standar' },
    { id: 'survey', label: 'Survey', sub: 'Generate REKSIS' },
    { id: 'daftung', label: 'Daftung', sub: 'Monitoring' },
    { id: 'wo', label: 'Apply WO', sub: 'Alokasi' },
    { id: 'vendor', label: 'Reservasi', sub: 'Vendor' },
    { id: 'monitoring', label: 'Pengawasan', sub: 'Verifikasi' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-white to-blue-50/50 p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
              OVERVIEW OPERASIONAL
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              • Periode Berjalan 2026
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Selamat siang, <span className="text-blue-700">Budi</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
            Ringkasan proses pekerjaan konstruksi, distribusi material, dan antrean tindakan yang memerlukan perhatian Anda.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('survey')}
          className="px-5 py-2.5 bg-[#0066cc] hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 flex items-center justify-center gap-2 self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3] text-white" />
          <span className="text-white tracking-wide">＋ Buat Survey</span>
        </button>
      </div>

      {/* 4 Stat Cards with subtle modern accents & hover scale */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Daftung Aktif */}
        <div 
          onClick={() => setCurrentPage('daftung')}
          className="card-modern p-5 bg-white cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 opacity-80 group-hover:h-1.5 transition-all"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daftung aktif</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight group-hover:text-blue-700 transition">
            {daftungAktif}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Data simulasi aktif
          </div>
        </div>

        {/* Card 2: WO Berjalan */}
        <div 
          onClick={() => setCurrentPage('wo')}
          className="card-modern p-5 bg-white cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 opacity-80 group-hover:h-1.5 transition-all"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">WO berjalan</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight group-hover:text-amber-700 transition">
            {woBerjalan}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> 6 perlu perhatian
          </div>
        </div>

        {/* Card 3: Menunggu Verifikasi SJ */}
        <div 
          onClick={() => setCurrentPage('monitoring')}
          className="card-modern p-5 bg-white cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 opacity-80 group-hover:h-1.5 transition-all"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Menunggu verifikasi SJ</span>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
              <FileCheck2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight group-hover:text-indigo-700 transition">
            {suratJalanMenunggu}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Antrean pengawas
          </div>
        </div>

        {/* Card 4: Material Belum Alokasi */}
        <div 
          onClick={() => setCurrentPage('warehouse')}
          className="card-modern p-5 bg-white cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500 opacity-80 group-hover:h-1.5 transition-all"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Material belum alokasi</span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition">
              <Boxes className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight group-hover:text-rose-700 transition">
            {materialBelumAlokasi}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Di 7 Daftung
          </div>
        </div>
      </div>

      {/* Main Grid: Left Alur & Progress | Right Antrean Tindakan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side (2 Cols): Alur Kerja Utama + Progress WO */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Alur Kerja Utama Horizontal Connected Steps */}
          <div className="card-modern p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Alur kerja utama</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                    6 Tahapan
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Pilih modul dari menu atau ikuti urutan proses berikut.</p>
              </div>
            </div>

            {/* Steps Container */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 items-stretch pt-2">
              {steps.map((st, idx) => (
                <button
                  key={st.id}
                  onClick={() => setCurrentPage(st.id)}
                  className="p-3 bg-slate-50/70 hover:bg-blue-50/70 border border-slate-200/90 hover:border-blue-300 rounded-xl text-center transition-all duration-150 flex flex-col justify-between group"
                >
                  <div className="text-[10px] text-slate-400 font-mono font-semibold">0{idx + 1}</div>
                  <div className="my-1.5">
                    <div className="font-extrabold text-xs text-slate-800 group-hover:text-blue-700 transition">
                      {st.label}
                    </div>
                    <div className="text-[9.5px] text-slate-400 group-hover:text-blue-600 transition truncate">
                      {st.sub}
                    </div>
                  </div>
                  <div className="text-blue-500 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-0.5">
                    Buka <ChevronRight className="w-2.5 h-2.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: Ringkasan Progress WO */}
          <div className="card-modern p-6 bg-white space-y-5">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Ringkasan progres WO</h2>
              <p className="text-xs text-slate-400 mt-0.5">Distribusi status realisasi lapangan dan material proyek.</p>
            </div>

            <div className="space-y-4">
              {/* Progress 1 */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-slate-800">Material terverifikasi</span>
                  <span className="text-blue-600 font-mono font-black">72%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-500" 
                    style={{ width: '72%' }}
                  />
                </div>
              </div>

              {/* Progress 2 */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-slate-800">Progress jasa rata-rata</span>
                  <span className="text-indigo-600 font-mono font-black">58%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all duration-500" 
                    style={{ width: '58%' }}
                  />
                </div>
              </div>

              {/* Progress 3 */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-slate-800">WO selesai</span>
                  <span className="text-emerald-600 font-mono font-black">34%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-500" 
                    style={{ width: '34%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (1 Col): Antrean Tindakan / Pemberitahuan Penting */}
        <div className="card-modern p-6 bg-white flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>Antrean tindakan</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Item penting yang sebaiknya ditindaklanjuti.</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                4 Tugas
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {/* Notif 1 */}
              <div className="py-3.5 flex items-start justify-between gap-3 group hover:bg-slate-50/60 p-2 rounded-xl transition">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 font-black text-xs mt-0.5">
                    !
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 leading-snug">5 Surat Jalan menunggu verifikasi</div>
                    <div className="text-[10.5px] text-slate-400 mt-0.5 font-medium">Pengawasan • Periksa bukti dan kuantitas</div>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentPage('monitoring')}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[10.5px] font-bold shrink-0 transition"
                >
                  Perlu aksi
                </button>
              </div>

              {/* Notif 2 */}
              <div className="py-3.5 flex items-start justify-between gap-3 group hover:bg-slate-50/60 p-2 rounded-xl transition">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 font-black text-xs mt-0.5">
                    ↗
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 leading-snug">7 Daftung memiliki material belum alokasi</div>
                    <div className="text-[10.5px] text-slate-400 mt-0.5 font-medium">Admin WO • Review tab MT Belum Alokasi</div>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentPage('daftung')}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[10.5px] font-bold shrink-0 transition"
                >
                  Alokasi
                </button>
              </div>

              {/* Notif 3 */}
              <div className="py-3.5 flex items-start justify-between gap-3 group hover:bg-slate-50/60 p-2 rounded-xl transition">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 leading-snug">3 kontrak jasa mendekati akhir</div>
                    <div className="text-[10.5px] text-slate-400 mt-0.5 font-medium">Kontrak • Periksa masa berlaku</div>
                    <span className="inline-block px-1.5 py-0.2 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[9.5px] font-bold mt-1">
                      Perhatian
                    </span>
                  </div>
                </div>
              </div>

              {/* Notif 4 */}
              <div className="py-3.5 flex items-start justify-between gap-3 group hover:bg-slate-50/60 p-2 rounded-xl transition">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 leading-snug">4 WO siap pemeriksaan akhir</div>
                    <div className="text-[10.5px] text-slate-400 mt-0.5 font-medium">Pengawas • Lengkapi checklist dan dokumen</div>
                    <span className="inline-block px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9.5px] font-bold mt-1">
                      Review
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button: Buka monitoring */}
          <button
            onClick={() => setCurrentPage('monitoring')}
            className="w-full py-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold rounded-xl text-xs border border-slate-200/90 hover:border-blue-200 transition-all flex items-center justify-center gap-1.5 shadow-2xs group"
          >
            <span>Buka monitoring</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
