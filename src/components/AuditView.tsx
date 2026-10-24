'use client';

import React, { useState } from 'react';
import { usePromotorStore } from '@/store/usePromotorStore';
import { History, ShieldAlert, FileSpreadsheet, Trash2, Search } from 'lucide-react';
import { Pagination } from '@/components/Pagination';

export const AuditView: React.FC = () => {
  const { audits, clearAudits, showToast } = usePromotorStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [auditPage, setAuditPage] = useState(1);
  const [auditPageSize, setAuditPageSize] = useState(10);

  const filteredAudits = audits.filter(
    (a) =>
      a.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.object.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedAudits = filteredAudits.slice(
    (auditPage - 1) * auditPageSize,
    auditPage * auditPageSize
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Laporan & Audit Log Aktivitas</h2>
          <p className="text-xs text-slate-500">
            Jejak digital setiap aksi: pembuatan survey, verifikasi daftung, penerbitan WO, reservasi material, dan verifikasi surat jalan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {audits.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin mengosongkan seluruh riwayat log aktivitas?')) {
                  clearAudits();
                }
              }}
              className="px-3.5 py-2 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bersihkan Log
            </button>
          )}
          <button
            onClick={() => showToast('Ekspor data log ke format XLSX / CSV (simulasi)')}
            className="px-3.5 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Ekspor Log
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari user, aktivitas, objek, atau modul..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setAuditPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total: <b>{filteredAudits.length}</b> Catatan Aktivitas
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-blue-100/80 border-b border-blue-200 text-slate-900 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="p-3 px-4">Waktu</th>
                <th className="p-3 px-4">Pengguna / Peran</th>
                <th className="p-3 px-4">Aktivitas</th>
                <th className="p-3 px-4">Objek Ref</th>
                <th className="p-3 px-4">Modul Sumber</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAudits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Tidak ada catatan aktivitas yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedAudits.map((a, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="p-3 px-4 text-slate-500 font-mono text-[11px]">{a.time}</td>
                    <td className="p-3 px-4 font-bold text-slate-800">{a.user}</td>
                    <td className="p-3 px-4 text-slate-700">{a.activity}</td>
                    <td className="p-3 px-4 font-mono font-semibold text-blue-700">{a.object}</td>
                    <td className="p-3 px-4 text-slate-500">{a.source}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={auditPage}
          totalItems={filteredAudits.length}
          itemsPerPage={auditPageSize}
          onPageChange={setAuditPage}
          onItemsPerPageChange={setAuditPageSize}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </div>
    </div>
  );
};
