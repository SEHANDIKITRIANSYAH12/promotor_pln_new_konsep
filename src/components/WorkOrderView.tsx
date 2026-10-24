'use client';

import React, { useState } from 'react';
import { usePromotorStore } from '@/store/usePromotorStore';
import { WorkOrderRecord } from '@/types';
import { 
  HardHat, 
  CheckCircle, 
  Clock, 
  Link2, 
  ExternalLink, 
  Package, 
  Search, 
  Eye, 
  Filter, 
  X,
  FileText,
  Trash2
} from 'lucide-react';
import { Pagination } from '@/components/Pagination';

export const WorkOrderView: React.FC = () => {
  const { workOrders, updateWoProgress, updateWoReservation, deleteWorkOrder, setCurrentPage, showToast } = usePromotorStore();
  const [selectedWo, setSelectedWo] = useState<WorkOrderRecord | null>(null);
  const [progressVal, setProgressVal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [viewMaterialsWo, setViewMaterialsWo] = useState<WorkOrderRecord | null>(null);
  const [woPage, setWoPage] = useState(1);
  const [woPageSize, setWoPageSize] = useState(5);

  const openProgressModal = (wo: WorkOrderRecord) => {
    setSelectedWo(wo);
    setProgressVal(wo.progress);
  };

  const handleSaveProgress = () => {
    if (!selectedWo) return;
    updateWoProgress(selectedWo.id, progressVal);
    showToast(`✓ Progres ${selectedWo.id} diperbarui menjadi ${progressVal}%`);
    setSelectedWo(null);
  };

  const handleGenerateReservation = (woId: string) => {
    updateWoReservation(woId, 'Siap Ambil');
  };

  const filteredWorkOrders = workOrders.filter((w) => {
    const matchSearch =
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.idpel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.supervisor1 || w.supervisor).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.supervisor2 || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory = categoryFilter === 'ALL' || w.category === categoryFilter;

    return matchSearch && matchCategory;
  });

  const paginatedWorkOrders = filteredWorkOrders.slice(
    (woPage - 1) * woPageSize,
    woPage * woPageSize
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Work Order & Reservasi Material Lapangan</h2>
          <p className="text-xs text-slate-500">
            Daftar WO per kategori (WO Paket 1 & WO Paket 2) lengkap dengan Vendor Pelaksana, No. WO, Pengawas 1 & 2, serta reservasi material.
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('daftung')}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>+ Apply WO dari Daftung →</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari No. WO, IDPEL, Pelanggan, Vendor, Pengawas..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setWoPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-semibold text-[11px]">Kategori:</span>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setWoPage(1);
            }}
            className="p-2 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="ALL">Semua Kategori ({workOrders.length})</option>
            <option value="WO Paket 1">WO Paket 1</option>
            <option value="WO Paket 2">WO Paket 2</option>
            <option value="WO Tiang">WO Tiang</option>
          </select>
        </div>
      </div>

      {/* Tabel Work Order */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[1050px]">
            <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-800 uppercase font-extrabold text-[11px] tracking-wider">
              <tr className="divide-x divide-slate-200">
                <th className="py-3.5 px-4 w-[16%]">No. Work Order</th>
                <th className="py-3.5 px-4 w-[16%]">Pelanggan & IDPEL</th>
                <th className="py-3.5 px-4 w-[18%]">Vendor Pelaksana</th>
                <th className="py-3.5 px-4 w-[20%]">Pengawas Lapangan</th>
                <th className="py-3.5 px-3 w-[12%] text-center">Material</th>
                <th className="py-3.5 px-3 w-[10%] text-center">Progres Fisik</th>
                <th className="py-3.5 px-3 w-[8%] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredWorkOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ada data Work Order yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                paginatedWorkOrders.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-200">
                    {/* 1. No. Work Order & Kategori */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-black text-blue-900 text-xs tracking-tight">
                        {w.id}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold font-mono ${
                          w.category === 'WO Paket 1'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : w.category === 'WO Paket 2'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}>
                          {w.category}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          w.status === 'Selesai'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {w.status}
                        </span>
                      </div>
                    </td>

                    {/* 2. Pelanggan & IDPEL */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{w.customerName}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        IDPEL: <span className="font-semibold text-slate-700">{w.idpel}</span>
                      </div>
                    </td>

                    {/* 3. Vendor Pelaksana */}
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-800">{w.vendor}</div>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                          w.reservationStatus === 'Siap Ambil'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          <Package className="w-3 h-3" />
                          <span>{w.reservationStatus}</span>
                        </span>
                      </div>
                    </td>

                    {/* 4. Pengawas Lapangan */}
                    <td className="py-3 px-4 text-xs">
                      <div className="space-y-1">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase leading-tight">Pengawas 1:</span>
                          <span className="font-semibold text-slate-800">{w.supervisor1 || w.supervisor}</span>
                        </div>
                        {w.supervisor2 && (
                          <div className="pt-0.5 border-t border-slate-100">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase leading-tight">Pengawas 2:</span>
                            <span className="font-medium text-slate-700">{w.supervisor2}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 5. Alokasi Material */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => setViewMaterialsWo(w)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
                        title="Lihat daftar material WO"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{w.materials.length} Material</span>
                      </button>
                    </td>

                    {/* 6. Progres Fisik */}
                    <td className="py-3 px-3 text-center">
                      <div className="font-black text-xs text-blue-700">{w.progress}%</div>
                      <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden mx-auto mt-1">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${w.progress}%` }}
                        ></div>
                      </div>
                    </td>

                    {/* 7. Aksi */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <button
                          onClick={() => openProgressModal(w)}
                          className="w-full px-2.5 py-1 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold transition cursor-pointer"
                        >
                          Update
                        </button>

                        {w.reservationStatus === 'Siap Ambil' ? (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                            <Link2 className="w-3 h-3" /> Siap
                          </span>
                        ) : (
                          <button
                            onClick={() => handleGenerateReservation(w.id)}
                            className="w-full px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold shadow-2xs transition cursor-pointer"
                          >
                            Reservasi
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Apakah Anda yakin ingin menghapus Work Order ${w.id}?`)) {
                              deleteWorkOrder(w.id);
                            }
                          }}
                          className="w-full px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                          title="Hapus Work Order"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={woPage}
          totalItems={filteredWorkOrders.length}
          itemsPerPage={woPageSize}
          onPageChange={setWoPage}
          onItemsPerPageChange={setWoPageSize}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </div>

      {/* Modal Detail Material WO */}
      {viewMaterialsWo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Alokasi Material Work Order</h3>
                <p className="text-[11px] text-slate-500">
                  {viewMaterialsWo.id} • {viewMaterialsWo.category} ({viewMaterialsWo.customerName})
                </p>
              </div>
              <button
                onClick={() => setViewMaterialsWo(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
                    <tr className="divide-x divide-slate-200">
                      <th className="p-2.5 px-3">Nama Material</th>
                      <th className="p-2.5 px-3 text-center">Vol. Reksis</th>
                      <th className="p-2.5 px-3 text-center">Alokasi WO</th>
                      <th className="p-2.5 px-3 text-center">Satuan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {viewMaterialsWo.materials.map((m, idx) => (
                      <tr key={idx} className="divide-x divide-slate-200 hover:bg-slate-50/50">
                        <td className="p-2.5 px-3 font-semibold text-slate-800">{m.material}</td>
                        <td className="p-2.5 px-3 text-center font-mono text-slate-500">{m.qtyReksis}</td>
                        <td className="p-2.5 px-3 text-center font-mono font-bold text-blue-700">{m.qtyAllocated}</td>
                        <td className="p-2.5 px-3 text-center text-slate-500 text-[11px]">{m.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setViewMaterialsWo(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Update Progres */}
      {selectedWo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-extrabold text-slate-900 text-sm">Update Progres Fisik {selectedWo.id}</h3>
            <div>
              <label className="text-xs text-slate-600 block mb-2 font-medium">
                Persentase Pekerjaan Lapangan: <b className="text-blue-700 text-sm font-black">{progressVal}%</b>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="20"
                value={progressVal}
                onChange={(e) => setProgressVal(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
                <span>0% (Mulai)</span>
                <span>40% (Tiang)</span>
                <span>80% (Kabel)</span>
                <span>100% (Selesai)</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedWo(null)}
                className="px-3.5 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveProgress}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
