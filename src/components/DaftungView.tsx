'use client';

import React, { useState } from 'react';
import { usePromotorStore } from '@/store/usePromotorStore';
import { CheckCircle2, AlertCircle, FileCheck, Layers, ArrowRight, X, Search, Trash2 } from 'lucide-react';
import { SurveyRecord } from '@/types';
import { Pagination } from '@/components/Pagination';

export const DaftungView: React.FC = () => {
  const { daftungs, surveys, updateDaftungDoc, createWorkOrdersFromDaftung, addDaftungFromSurvey, deleteDaftung, deleteSurvey, setCurrentPage, showToast } = usePromotorStore();
  
  // Verification Modal State
  const [verifyingSurvey, setVerifyingSurvey] = useState<SurveyRecord | null>(null);
  const [finalName, setFinalName] = useState('');
  const [finalIdpel, setFinalIdpel] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Sudah Bayar');
  const [nameChanged, setNameChanged] = useState('Tidak');
  const [note, setNote] = useState('');

  // Pagination & Search for AP2T Queue
  const [ap2tPage, setAp2tPage] = useState(1);
  const [ap2tPageSize, setAp2tPageSize] = useState(5);

  // Pagination & Search for Daftung Terverifikasi
  const [daftungSearch, setDaftungSearch] = useState('');
  const [daftungPage, setDaftungPage] = useState(1);
  const [daftungPageSize, setDaftungPageSize] = useState(5);

  // Filter survey queue for AP2T matching: HANYA survey yang sudah di-release/dikirim ke antrean AP2T (Opsi B)
  const ap2tQueue = surveys.filter((s) => s.status === 'Masuk Antrean AP2T');
  const paginatedAp2t = ap2tQueue.slice((ap2tPage - 1) * ap2tPageSize, ap2tPage * ap2tPageSize);

  const filteredDaftungs = daftungs.filter((d) =>
    d.id.toLowerCase().includes(daftungSearch.toLowerCase()) ||
    d.customerName.toLowerCase().includes(daftungSearch.toLowerCase()) ||
    d.idpel.toLowerCase().includes(daftungSearch.toLowerCase())
  );
  const paginatedDaftungs = filteredDaftungs.slice((daftungPage - 1) * daftungPageSize, daftungPage * daftungPageSize);

  const openVerifyModal = (s: SurveyRecord) => {
    setVerifyingSurvey(s);
    setFinalName(s.customerName);
    setFinalIdpel(s.idpel || '5410' + Math.floor(10000000 + Math.random() * 90000000));
    setPaymentStatus('Sudah Bayar');
    setNameChanged('Tidak');
    setNote('');
  };

  const handleConfirmVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingSurvey) return;
    if (!finalIdpel) {
      showToast('IDPEL wajib diisi untuk verifikasi AP2T');
      return;
    }
    if (paymentStatus !== 'Sudah Bayar') {
      showToast('Hanya pembayaran berstatus Sudah Bayar yang dapat diverifikasi ke Daftung');
      return;
    }

    addDaftungFromSurvey(verifyingSurvey.id, finalName, finalIdpel);
    setVerifyingSurvey(null);
  };

  // Apply WO Modal State (Matching Excel: INPUTAN APPLY WO - PAKET 1 & PAKET 2)
  const [applyingDaftung, setApplyingDaftung] = useState<(typeof daftungs)[0] | null>(null);
  const [p1Enabled, setP1Enabled] = useState(true);
  const [p1Vendor, setP1Vendor] = useState('PT. HILMAN PRIMA PERKASA');
  const [p1NoWo, setP1NoWo] = useState('537.10.WO.2026');
  const [p1Pengawas2, setP1Pengawas2] = useState('Daud Febrizer (TL Teknik ULP Rangkasbitung)');
  const [p1Pengawas1, setP1Pengawas1] = useState('Hasian Sitorus (TC Lola Konstruksi)');

  const [p2Enabled, setP2Enabled] = useState(true);
  const [p2Vendor, setP2Vendor] = useState('PT. TAWAKAL KARYA TEKNIK');
  const [p2NoWo, setP2NoWo] = useState('538.10.WO.2026');
  const [p2Pengawas2, setP2Pengawas2] = useState('');
  const [p2Pengawas1, setP2Pengawas1] = useState('Winnetou Chandra Sadli (Officer Kinerja Konstruksi)');

  const handleOpenApplyWo = (df: (typeof daftungs)[0]) => {
    setApplyingDaftung(df);
    setP1Enabled(true);
    setP1Vendor('PT. HILMAN PRIMA PERKASA');
    setP1NoWo(`537.${Math.floor(10 + Math.random() * 89)}.WO.2026`);
    setP1Pengawas2('Daud Febrizer (TL Teknik ULP Rangkasbitung)');
    setP1Pengawas1('Hasian Sitorus (TC Lola Konstruksi)');

    setP2Enabled(true);
    setP2Vendor('PT. TAWAKAL KARYA TEKNIK');
    setP2NoWo(`538.${Math.floor(10 + Math.random() * 89)}.WO.2026`);
    setP2Pengawas2('');
    setP2Pengawas1('Winnetou Chandra Sadli (Officer Kinerja Konstruksi)');
  };

  const handleConfirmApplyWo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingDaftung) return;
    if (!p1Enabled && !p2Enabled) {
      showToast('Pilih minimal satu paket (Paket 1 atau Paket 2) untuk diterbitkan');
      return;
    }
    if (p1Enabled && !p1NoWo.trim()) {
      showToast('Nomor Work Order Paket 1 wajib diisi');
      return;
    }
    if (p2Enabled && !p2NoWo.trim()) {
      showToast('Nomor Work Order Paket 2 wajib diisi');
      return;
    }

    createWorkOrdersFromDaftung(applyingDaftung.id, applyingDaftung.idpel, applyingDaftung.customerName, {
      paket1: {
        enabled: p1Enabled,
        vendor: p1Vendor.trim(),
        noWorkOrder: p1NoWo.trim(),
        pengawas2: p1Pengawas2.trim(),
        pengawas1: p1Pengawas1.trim(),
      },
      paket2: {
        enabled: p2Enabled,
        vendor: p2Vendor.trim(),
        noWorkOrder: p2NoWo.trim(),
        pengawas2: p2Pengawas2.trim(),
        pengawas1: p2Pengawas1.trim(),
      },
    });

    setApplyingDaftung(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">Daftung (Pencocokan AP2T & Data Induk)</h2>
          <p className="text-xs text-slate-500">
            Daftar Survey yang sudah dicocokkan dan diverifikasi Admin Daftung. Hanya data terverifikasi yang dapat di-Apply WO.
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('survey')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          Lihat antrean Survey →
        </button>
      </div>

      {/* 1. Antrean Pencocokan Pembayaran AP2T (Persis Gambar Screenshot User) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Antrean pencocokan pembayaran AP2T</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Admin Daftung mencocokkan manual dengan daftar AP2T eksternal. Nama pelanggan dan IDPEL boleh diperbarui; material/REKSIS tetap terkunci. Hanya pembayaran berstatus sudah bayar yang dapat diverifikasi masuk Daftung.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-blue-100/80 border-b border-blue-200 text-slate-900 uppercase font-bold text-[11px] tracking-wider">
              <tr className="divide-x divide-blue-200">
                <th className="py-3 px-4 w-[14%]">ID SURVEY</th>
                <th className="py-3 px-4 w-[16%]">IDPEL</th>
                <th className="py-3 px-4 w-[24%]">NAMA SURVEY</th>
                <th className="py-3 px-4 w-[22%]">LOKASI</th>
                <th className="py-3 px-4 w-[12%]">STATUS</th>
                <th className="py-3 px-4 w-[12%] text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {ap2tQueue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada antrean survey yang menunggu pencocokan AP2T.
                  </td>
                </tr>
              ) : (
                paginatedAp2t.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-200">
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">{s.id}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">{s.idpel || '—'}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{s.customerName}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{s.location}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {s.status === 'Masuk Antrean AP2T' ? 'Belum dicocokkan' : 'Perlu konfirmasi'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openVerifyModal(s)}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          Cocokkan AP2T
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Apakah Anda yakin ingin menghapus antrean survey ${s.id} (${s.customerName})?`)) {
                              deleteSurvey(s.id);
                            }
                          }}
                          className="p-1.5 text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 font-semibold rounded-lg transition border border-rose-200 cursor-pointer"
                          title="Hapus dari antrean"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
          currentPage={ap2tPage}
          totalItems={ap2tQueue.length}
          itemsPerPage={ap2tPageSize}
          onPageChange={setAp2tPage}
          onItemsPerPageChange={setAp2tPageSize}
          pageSizeOptions={[5, 10, 25]}
        />
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 bg-[#f0f6fd] border border-[#d6e6f7] rounded-xl text-[#1e40af] text-xs leading-relaxed">
        Daftung bersumber dari Survey. NIDI dan SLO dicatat sebagai toggle terpisah. Status penyelesaian mengikuti aturan checklist yang ditetapkan unit; seluruh perubahan terekam dalam riwayat.
      </div>

      {/* 2. Tabel Daftung Terverifikasi & Apply WO */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari Daftung, IDPEL, atau pelanggan..."
              value={daftungSearch}
              onChange={(e) => {
                setDaftungSearch(e.target.value);
                setDaftungPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total: <b>{filteredDaftungs.length}</b> Data Daftung
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-blue-100/80 border-b border-blue-200 text-slate-900 uppercase font-bold text-[11px] tracking-wider">
              <tr className="divide-x divide-blue-200">
                <th className="p-3 px-4">No. Daftung</th>
                <th className="p-3 px-4">IDPEL</th>
                <th className="p-3 px-4">Pelanggan</th>
                <th className="p-3 px-4">REKSIS</th>
                <th className="p-3 px-4">WO</th>
                <th className="p-3 px-4 text-center">NIDI</th>
                <th className="p-3 px-4 text-center">SLO</th>
                <th className="p-3 px-4">Status</th>
                <th className="p-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDaftungs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Tidak ada data Daftung yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedDaftungs.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 divide-x divide-slate-200">
                    <td className="p-3 px-4 font-bold text-slate-900">{d.id}</td>
                    <td className="p-3 px-4 font-mono font-semibold text-slate-700">{d.idpel}</td>
                    <td className="p-3 px-4 font-bold text-slate-800">{d.customerName}</td>
                    <td className="p-3 px-4 text-slate-600">{d.source}</td>
                    <td className="p-3 px-4 text-slate-600">{d.woIssued}</td>
                    <td className="p-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={d.nidi}
                        onChange={(e) => updateDaftungDoc(d.id, 'nidi', e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={d.slo}
                        onChange={(e) => updateDaftungDoc(d.id, 'slo', e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                        d.status === 'WO Terbit' 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="p-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {d.status === 'Siap Apply' ? (
                          <button
                            onClick={() => handleOpenApplyWo(d)}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer"
                          >
                            Apply WO
                          </button>
                        ) : (
                          <span className="text-slate-400 font-medium text-xs px-1">WO Berjalan</span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Apakah Anda yakin ingin menghapus data Daftung ${d.id} (${d.customerName})?`)) {
                              deleteDaftung(d.id);
                            }
                          }}
                          className="p-1.5 text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 font-semibold rounded-lg transition border border-rose-200 cursor-pointer"
                          title="Hapus Daftung"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
          currentPage={daftungPage}
          totalItems={filteredDaftungs.length}
          itemsPerPage={daftungPageSize}
          onPageChange={setDaftungPage}
          onItemsPerPageChange={setDaftungPageSize}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </div>

      {/* MODAL COCOKKAN AP2T */}
      {verifyingSurvey && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Verifikasi Survey dengan AP2T</h3>
                <p className="text-[11px] text-slate-500">Pencocokan manual oleh Admin Daftung</p>
              </div>
              <button onClick={() => setVerifyingSurvey(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmVerify} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] leading-relaxed">
                Cocokkan dengan daftar AP2T eksternal. Nama dan IDPEL boleh dikoreksi; material/REKSIS terkunci.
              </div>

              {/* Data Teknis Hasil Survey untuk Verifikasi Lapangan */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-[11px]">
                <div className="font-bold text-slate-800 text-xs flex items-center justify-between border-b border-slate-200 pb-1">
                  <span>Data Teknis Hasil Survey Lapangan</span>
                  <span className="font-mono text-blue-700 font-bold">{verifyingSurvey.id}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Daya & Tarif:</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {verifyingSurvey.dayaBaru || verifyingSurvey.daya || '-'} VA ({verifyingSurvey.tarifBaru || verifyingSurvey.tarif || '-'})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Titik Pasok (GI / Feeder):</span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {verifyingSurvey.penyulang || '-'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block font-semibold">Alamat Lokasi:</span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {verifyingSurvey.address || verifyingSurvey.location || '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 mb-1">Nama dari Survey</label>
                <input
                  type="text"
                  readOnly
                  value={verifyingSurvey.customerName}
                  className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Pelanggan Final *</label>
                <input
                  type="text"
                  required
                  value={finalName}
                  onChange={(e) => setFinalName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ID Pelanggan (IDPEL) Final *</label>
                <input
                  type="text"
                  required
                  value={finalIdpel}
                  onChange={(e) => setFinalIdpel(e.target.value)}
                  placeholder="12 digit IDPEL AP2T"
                  className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold text-blue-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Pembayaran</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg font-semibold"
                  >
                    <option>Sudah Bayar</option>
                    <option>Belum Bayar</option>
                    <option>Perlu klarifikasi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Berubah?</label>
                  <select
                    value={nameChanged}
                    onChange={(e) => setNameChanged(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg font-semibold"
                  >
                    <option>Tidak</option>
                    <option>Ya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Catatan validasi pembayaran..."
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVerifyingSurvey(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition shadow-xs"
                >
                  Verifikasi & Masukkan ke Daftung
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INPUTAN APPLY WO (PERSIS EXCEL USER: PAKET 1 & PAKET 2) */}
      {applyingDaftung && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Header Dialog */}
            <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-lime-50 to-white">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-[#84cc16] hover:bg-[#65a30d] text-slate-900 font-black text-xs rounded-lg uppercase tracking-wider shadow-xs border border-lime-500">
                  INPUTAN APPLY WO
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Penerbitan Surat Perintah Kerja (Work Order)</h3>
                  <p className="text-[11px] text-slate-500">
                    Alokasikan Vendor Pelaksana, No. WO, dan Pengawas Lapangan untuk Paket 1 & Paket 2
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setApplyingDaftung(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmApplyWo} className="p-6 space-y-5 text-xs">
              {/* Ringkasan Data Daftung & Pelanggan */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">No. Daftung:</span>
                  <span className="font-bold text-slate-900 font-mono text-xs">{applyingDaftung.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">IDPEL Pelanggan:</span>
                  <span className="font-mono font-bold text-blue-700 text-xs">{applyingDaftung.idpel}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Nama Pelanggan:</span>
                  <span className="font-bold text-slate-800 text-xs">{applyingDaftung.customerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Sumber REKSIS:</span>
                  <span className="font-semibold text-slate-600">{applyingDaftung.source}</span>
                </div>
              </div>

              {/* Matriks Inputan: Side-by-Side PAKET 1 & PAKET 2 (Sesuai Spreadsheet User) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* KOLOM 1: PAKET 1 */}
                <div className={`rounded-2xl border-2 transition-all p-4 space-y-4 ${
                  p1Enabled ? 'bg-amber-50/50 border-amber-300 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  {/* Header Baris Paket 1 */}
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2.5 bg-amber-300/40 -mx-4 -mt-4 p-3 rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="toggleP1"
                        checked={p1Enabled}
                        onChange={(e) => setP1Enabled(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <label htmlFor="toggleP1" className="font-black text-sm text-slate-900 cursor-pointer tracking-wider">
                        PAKET 1
                      </label>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-400/80 text-amber-950 font-mono">
                      JTM & Gardu
                    </span>
                  </div>

                  {/* 1. Vendor Pelaksana */}
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">
                      Vendor Pelaksana <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={!p1Enabled}
                      value={p1Vendor}
                      onChange={(e) => setP1Vendor(e.target.value)}
                      placeholder="PT. HILMAN PRIMA PERKASA"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                    />
                    <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-500">
                      <span>Rekomendasi:</span>
                      <button
                        type="button"
                        onClick={() => setP1Vendor('PT. HILMAN PRIMA PERKASA')}
                        className="text-blue-700 hover:underline font-bold cursor-pointer"
                      >
                        PT. HILMAN PRIMA PERKASA
                      </button>
                    </div>
                  </div>

                  {/* 2. No Work Order */}
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">
                      No Work Order <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={!p1Enabled}
                      value={p1NoWo}
                      onChange={(e) => setP1NoWo(e.target.value)}
                      placeholder="537.10.WO.2026"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-black text-blue-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                    />
                  </div>

                  {/* 3. Pengawas 2 */}
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">
                      Pengawas 2
                    </label>
                    <input
                      type="text"
                      disabled={!p1Enabled}
                      value={p1Pengawas2}
                      onChange={(e) => setP1Pengawas2(e.target.value)}
                      placeholder="Daud Febrizer (TL Teknik ULP Rangkasbitung)"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                    />
                    <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-500">
                      <button
                        type="button"
                        onClick={() => setP1Pengawas2('Daud Febrizer (TL Teknik ULP Rangkasbitung)')}
                        className="text-blue-700 hover:underline font-medium cursor-pointer"
                      >
                        + Daud Febrizer (TL Teknik ULP Rangkasbitung)
                      </button>
                    </div>
                  </div>

                  {/* 4. Pengawas 1 */}
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">
                      Pengawas 1 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={!p1Enabled}
                      value={p1Pengawas1}
                      onChange={(e) => setP1Pengawas1(e.target.value)}
                      placeholder="Hasian Sitorus (TC Lola Konstruksi)"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                    />
                    <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-500">
                      <button
                        type="button"
                        onClick={() => setP1Pengawas1('Hasian Sitorus (TC Lola Konstruksi)')}
                        className="text-blue-700 hover:underline font-medium cursor-pointer"
                      >
                        + Hasian Sitorus (TC Lola Konstruksi)
                      </button>
                    </div>
                  </div>
                </div>

                {/* KOLOM 2: PAKET 2 */}
                <div className={`rounded-2xl border-2 transition-all p-4 space-y-4 ${
                  p2Enabled ? 'bg-amber-50/50 border-amber-300 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  {/* Header Baris Paket 2 */}
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2.5 bg-amber-300/40 -mx-4 -mt-4 p-3 rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="toggleP2"
                        checked={p2Enabled}
                        onChange={(e) => setP2Enabled(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <label htmlFor="toggleP2" className="font-black text-sm text-slate-900 cursor-pointer tracking-wider">
                        PAKET 2
                      </label>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-400/80 text-amber-950 font-mono">
                      JTR & SR
                    </span>
                  </div>

                  {/* 1. Vendor Pelaksana */}
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">
                      Vendor Pelaksana <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={!p2Enabled}
                      value={p2Vendor}
                      onChange={(e) => setP2Vendor(e.target.value)}
                      placeholder="PT. TAWAKAL KARYA TEKNIK"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                    />
                    <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-500">
                      <span>Rekomendasi:</span>
                      <button
                        type="button"
                        onClick={() => setP2Vendor('PT. TAWAKAL KARYA TEKNIK')}
                        className="text-blue-700 hover:underline font-bold cursor-pointer"
                      >
                        PT. TAWAKAL KARYA TEKNIK
                      </button>
                    </div>
                  </div>

                  {/* 2. No Work Order */}
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">
                      No Work Order <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={!p2Enabled}
                      value={p2NoWo}
                      onChange={(e) => setP2NoWo(e.target.value)}
                      placeholder="538.10.WO.2026"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-black text-blue-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                    />
                  </div>

                  {/* 3. Pengawas 2 */}
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">
                      Pengawas 2 <span className="text-slate-400 font-normal">(Opsional)</span>
                    </label>
                    <input
                      type="text"
                      disabled={!p2Enabled}
                      value={p2Pengawas2}
                      onChange={(e) => setP2Pengawas2(e.target.value)}
                      placeholder="Kosongkan jika tidak ada"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                    />
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                      <button
                        type="button"
                        onClick={() => setP2Pengawas2('Daud Febrizer (TL Teknik ULP Rangkasbitung)')}
                        className="text-blue-700 hover:underline font-medium cursor-pointer"
                      >
                        + Daud Febrizer (TL Teknik)
                      </button>
                      <button
                        type="button"
                        onClick={() => setP2Pengawas2('')}
                        className="text-rose-600 hover:underline cursor-pointer"
                      >
                        Kosongkan
                      </button>
                    </div>
                  </div>

                  {/* 4. Pengawas 1 */}
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">
                      Pengawas 1 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={!p2Enabled}
                      value={p2Pengawas1}
                      onChange={(e) => setP2Pengawas1(e.target.value)}
                      placeholder="Winnetou Chandra Sadli (Officer Kinerja Konstruksi)"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                    />
                    <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-500">
                      <button
                        type="button"
                        onClick={() => setP2Pengawas1('Winnetou Chandra Sadli (Officer Kinerja Konstruksi)')}
                        className="text-blue-700 hover:underline font-medium cursor-pointer"
                      >
                        + Winnetou Chandra Sadli (Officer Kinerja)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setApplyingDaftung(null)}
                  className="px-5 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-bold text-xs transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Terbitkan Work Order (Apply WO) →</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
