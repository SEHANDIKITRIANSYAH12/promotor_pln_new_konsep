'use client';

import React, { useState } from 'react';
import { usePromotorStore } from '@/store/usePromotorStore';
import { Warehouse, AlertTriangle, CheckCircle2, RefreshCw, Search } from 'lucide-react';
import { Pagination } from '@/components/Pagination';

export const WarehouseView: React.FC = () => {
  const { stocks, showToast } = usePromotorStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [stockPage, setStockPage] = useState(1);
  const [stockPageSize, setStockPageSize] = useState(5);

  const filteredStocks = stocks.filter(
    (s) =>
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedStocks = filteredStocks.slice(
    (stockPage - 1) * stockPageSize,
    stockPage * stockPageSize
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Stok Gudang & Kebutuhan Material</h2>
          <p className="text-xs text-slate-500">
            Monitoring ketersediaan fisik gudang, alokasi per WO, sisa bebas, dan status persediaan kritis.
          </p>
        </div>
        <button
          onClick={() => showToast('Snapshot stok gudang diperbarui dari sistem logistik (simulasi)')}
          className="px-3.5 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Sinkronisasi Stok
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari kode, nama material, atau kategori..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setStockPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total: <b>{filteredStocks.length}</b> Item Material
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-blue-100/80 border-b border-blue-200 text-slate-900 uppercase font-bold text-[11px] tracking-wider">
              <tr className="divide-x divide-blue-200">
                <th className="p-3 px-4">Kode Material</th>
                <th className="p-3 px-4">Nama Material</th>
                <th className="p-3 px-4">Kategori</th>
                <th className="p-3 px-4 text-right">Stok Fisik</th>
                <th className="p-3 px-4 text-right">Teralokasi WO</th>
                <th className="p-3 px-4 text-right">Sisa Bebas</th>
                <th className="p-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada data material yang sesuai.
                  </td>
                </tr>
              ) : (
                paginatedStocks.map((s) => (
                  <tr key={s.code} className="hover:bg-slate-50/80 divide-x divide-slate-200">
                    <td className="p-3 px-4 font-mono font-bold text-slate-700">{s.code}</td>
                    <td className="p-3 px-4 font-bold text-slate-800">{s.name}</td>
                    <td className="p-3 px-4 text-slate-500">{s.category}</td>
                    <td className="p-3 px-4 text-right font-mono font-semibold">{s.qtyFisik} {s.unit}</td>
                    <td className="p-3 px-4 text-right font-mono text-amber-700 font-semibold">{s.qtyAlokasi} {s.unit}</td>
                    <td className="p-3 px-4 text-right font-mono font-bold text-blue-700">{s.qtySisa} {s.unit}</td>
                    <td className="p-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        s.status === 'Aman'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : s.status === 'Menipis'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={stockPage}
          totalItems={filteredStocks.length}
          itemsPerPage={stockPageSize}
          onPageChange={setStockPage}
          onItemsPerPageChange={setStockPageSize}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </div>
    </div>
  );
};
