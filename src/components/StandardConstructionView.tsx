'use client';

import React, { useState } from 'react';
import { Layers, Download, Upload, Search, Filter, Plus, Save, Trash2, X, PlusCircle, Columns } from 'lucide-react';
import { usePromotorStore } from '@/store/usePromotorStore';
import { Pagination } from '@/components/Pagination';

// -------------------------------------------------------------
// 1. DATA SPESIFIKASI KONSTRUKSI TM (Tegangan Menengah)
// -------------------------------------------------------------
interface MaterialCol {
  key: string;
  label: string;
}

const INITIAL_TM_MATERIALS: MaterialCol[] = [
  { key: 'serandangCantol', label: 'SERANDANG CANTOL' },
  { key: 'serandangPortal', label: 'SERANDANG PORTAL' },
  { key: 'lvsbCantol', label: 'LVSB CANTOL' },
  { key: 'lvsbPortal', label: 'LVSB PORTAL' },
  { key: 'nyy1x95', label: 'NYY 1X95' },
  { key: 'nyy1x240', label: 'NYY 1X240' },
  { key: 'cableShoeCu95', label: 'CABLE SHOE CU 95' },
  { key: 'cableShoeCu240', label: 'CABLE SHOE CU 240' },
  { key: 'cableShoeAlCu150', label: 'CABLE SHOE AL CU 150' },
  { key: 'la', label: 'LA (LIGHTNING ARRESTER)' },
];

interface MatrixRow {
  rowNum: number;
  code: string;
  materials: Record<string, number | null>;
}

const INITIAL_TM_DATA: MatrixRow[] = [
  { rowNum: 151, code: '1B', materials: {} },
  { rowNum: 152, code: '2B', materials: {} },
  { rowNum: 153, code: '3B', materials: {} },
  { rowNum: 154, code: '4B', materials: {} },
  { rowNum: 155, code: '5B', materials: {} },
  { rowNum: 156, code: '6B', materials: {} },
  { rowNum: 157, code: '7B', materials: {} },
  { rowNum: 158, code: '8B', materials: {} },
  { rowNum: 159, code: '9B', materials: {} },
  { rowNum: 160, code: '10B', materials: {} },
  { rowNum: 161, code: '11B', materials: { la: 3 } },
  { rowNum: 162, code: '12B', materials: { la: 3 } },
  { rowNum: 163, code: '13B', materials: {} },
  { rowNum: 164, code: '14B', materials: {} },
  {
    rowNum: 165,
    code: 'GARDU CANTOL',
    materials: {
      serandangCantol: 1,
      lvsbCantol: 1,
      nyy1x95: 44,
      cableShoeCu95: 8,
      cableShoeAlCu150: 12,
      la: 3,
    },
  },
  {
    rowNum: 166,
    code: 'GARDU PORTAL',
    materials: {
      serandangPortal: 1,
      lvsbPortal: 1,
      nyy1x240: 44,
      cableShoeCu240: 8,
      cableShoeAlCu150: 12,
      la: 3,
    },
  },
  {
    rowNum: 167,
    code: 'GARDU PORTAL RMU',
    materials: {
      serandangPortal: 1,
    },
  },
  { rowNum: 168, code: 'GARDU BETON', materials: {} },
  { rowNum: 169, code: 'STAYSET', materials: {} },
  { rowNum: 170, code: 'CO AFTAK', materials: {} },
];

// -------------------------------------------------------------
// 2. DATA SPESIFIKASI KONSTRUKSI TR (Tegangan Rendah)
// -------------------------------------------------------------
const INITIAL_TR_MATERIALS: MaterialCol[] = [
  { key: 'suspension70', label: 'SUSPENSION 70' },
  { key: 'largeAngle70', label: 'LARGE ANGLE 70' },
];

const INITIAL_TR_DATA: MatrixRow[] = [
  { rowNum: 122, code: '1B', materials: { suspension70: 1 } },
  { rowNum: 123, code: '2B', materials: { largeAngle70: 1 } },
  { rowNum: 124, code: '3B', materials: {} },
  { rowNum: 125, code: '4B', materials: { suspension70: 1 } },
  { rowNum: 126, code: '5B', materials: { largeAngle70: 1 } },
  { rowNum: 127, code: '6B', materials: {} },
  { rowNum: 128, code: '7B', materials: { suspension70: 1 } },
  { rowNum: 129, code: '8B', materials: { largeAngle70: 1 } },
  { rowNum: 130, code: '9B', materials: { largeAngle70: 2 } },
  { rowNum: 131, code: '10B AWAL', materials: {} },
  { rowNum: 132, code: '10B AKHIR', materials: {} },
  { rowNum: 133, code: '11B', materials: {} },
  { rowNum: 134, code: 'PEMBUMIAN', materials: {} },
  { rowNum: 135, code: 'STAY SET TR', materials: {} },
];

export const StandardConstructionView: React.FC = () => {
  const { showToast } = usePromotorStore();
  const [activeTab, setActiveTab] = useState<'TM' | 'TR' | 'GARDU' | 'SR'>('TR');

  // Materials & Rows state for TM & TR
  const [tmMaterials, setTmMaterials] = useState<MaterialCol[]>(INITIAL_TM_MATERIALS);
  const [tmData, setTmData] = useState<MatrixRow[]>(INITIAL_TM_DATA);

  const [trMaterials, setTrMaterials] = useState<MaterialCol[]>(INITIAL_TR_MATERIALS);
  const [trData, setTrData] = useState<MatrixRow[]>(INITIAL_TR_DATA);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals for adding row / column
  const [isAddRowModalOpen, setIsAddRowModalOpen] = useState(false);
  const [newRowCode, setNewRowCode] = useState('');

  const [isAddColModalOpen, setIsAddColModalOpen] = useState(false);
  const [newColName, setNewColName] = useState('');

  const currentMaterials = activeTab === 'TR' ? trMaterials : tmMaterials;
  const currentData = activeTab === 'TR' ? trData : tmData;

  const handleCellChange = (rowCode: string, materialKey: string, value: string) => {
    const num = value === '' ? null : parseFloat(value);
    const parsedVal = isNaN(num as number) ? null : num;
    if (activeTab === 'TR') {
      setTrData((prev) =>
        prev.map((r) =>
          r.code === rowCode ? { ...r, materials: { ...r.materials, [materialKey]: parsedVal } } : r
        )
      );
    } else {
      setTmData((prev) =>
        prev.map((r) =>
          r.code === rowCode ? { ...r, materials: { ...r.materials, [materialKey]: parsedVal } } : r
        )
      );
    }
  };

  // Add New Row
  const handleAddRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRowCode.trim()) return;

    if (activeTab === 'TR') {
      const nextNum = trData.length > 0 ? Math.max(...trData.map((r) => r.rowNum)) + 1 : 122;
      const newRow: MatrixRow = {
        rowNum: nextNum,
        code: newRowCode.trim().toUpperCase(),
        materials: {},
      };
      setTrData([...trData, newRow]);
    } else {
      const nextNum = tmData.length > 0 ? Math.max(...tmData.map((r) => r.rowNum)) + 1 : 151;
      const newRow: MatrixRow = {
        rowNum: nextNum,
        code: newRowCode.trim().toUpperCase(),
        materials: {},
      };
      setTmData([...tmData, newRow]);
    }

    showToast(`✓ Baris konstruksi "${newRowCode.trim().toUpperCase()}" berhasil ditambahkan ke ${activeTab}`);
    setNewRowCode('');
    setIsAddRowModalOpen(false);
  };

  // Add New Column (Material)
  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;

    const key = `mat_${Date.now()}`;
    const newCol: MaterialCol = {
      key,
      label: newColName.trim().toUpperCase(),
    };

    if (activeTab === 'TR') {
      setTrMaterials([...trMaterials, newCol]);
    } else {
      setTmMaterials([...tmMaterials, newCol]);
    }

    showToast(`✓ Kolom material "${newColName.trim().toUpperCase()}" berhasil ditambahkan ke ${activeTab}`);
    setNewColName('');
    setIsAddColModalOpen(false);
  };

  // Delete Row
  const handleDeleteRow = (code: string) => {
    if (confirm(`Hapus baris konstruksi "${code}" dari tabel ${activeTab}?`)) {
      if (activeTab === 'TR') {
        setTrData((prev) => prev.filter((r) => r.code !== code));
      } else {
        setTmData((prev) => prev.filter((r) => r.code !== code));
      }
      showToast(`Baris "${code}" telah dihapus`);
    }
  };

  // Delete Column
  const handleDeleteColumn = (colKey: string, label: string) => {
    if (confirm(`Hapus kolom material "${label}" dari tabel ${activeTab}?`)) {
      if (activeTab === 'TR') {
        setTrMaterials(trMaterials.filter((m) => m.key !== colKey));
      } else {
        setTmMaterials(tmMaterials.filter((m) => m.key !== colKey));
      }
      showToast(`Kolom "${label}" telah dihapus`);
    }
  };

  const filteredData = currentData.filter((row) =>
    row.code.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">Standar Konstruksi & Bill of Materials (BOM)</h2>
          <p className="text-xs text-slate-500">
            Matriks standar kebutuhan material per jenis konstruksi jaringan PLN (Tegangan Rendah, Tegangan Menengah, Gardu, SR).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast(`Template Excel Standar Konstruksi ${activeTab} siap diunduh`)}
            className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Unduh Excel
          </button>
          <button
            onClick={() => showToast(`Perubahan standar konstruksi ${activeTab} berhasil disimpan`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> Simpan Matriks
          </button>
        </div>
      </div>

      {/* Group Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => {
            setActiveTab('TR');
            setSearch('');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'TR'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Konstruksi TR (Tegangan Rendah)
        </button>
        <button
          onClick={() => {
            setActiveTab('TM');
            setSearch('');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'TM'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Konstruksi TM (Tegangan Menengah)
        </button>
        <button
          onClick={() => {
            setActiveTab('GARDU');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'GARDU'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Gardu Distribusi
        </button>
        <button
          onClick={() => {
            setActiveTab('SR');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'SR'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Sambungan Rumah (SR)
        </button>
      </div>

      {/* Main Matriks Table Container (Format Excel Persis Gambar Pengguna) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Search & Tooling Bar: Dengan Tombol Tambah Baris & Tambah Kolom */}
        <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={`Cari jenis konstruksi ${activeTab}...`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Action Buttons: Tambah Baris & Tambah Kolom */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddRowModalOpen(true)}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" /> ＋ Tambah Baris ({activeTab})
            </button>
            <button
              onClick={() => setIsAddColModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Columns className="w-3.5 h-3.5" /> ＋ Tambah Kolom Material
            </button>
          </div>
        </div>

        {/* Excel Matrix Table */}
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="w-full text-left text-xs border-collapse">
            {/* Header dengan warna biru khas PLN seperti button (bg-blue-600) */}
            <thead className="sticky top-0 z-20 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider">
              <tr className="divide-x divide-blue-500/80">
                <th className="py-3 px-3 w-14 text-center bg-blue-700">No</th>
                <th className="py-3 px-4 min-w-[200px] sticky left-0 z-30 bg-blue-700 shadow-sm">
                  KONSTRUKSI {activeTab}
                </th>
                {currentMaterials.map((m) => (
                  <th key={m.key} className="py-3 px-3 text-center min-w-[160px] whitespace-normal group relative">
                    <div className="flex items-center justify-between gap-1">
                      <span className="flex-1">{m.label}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteColumn(m.key, m.label)}
                        className="opacity-0 group-hover:opacity-100 hover:text-rose-200 p-0.5 rounded transition"
                        title="Hapus kolom ini"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </th>
                ))}
                <th className="py-3 px-3 w-16 text-center bg-blue-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={currentMaterials.length + 3} className="py-8 text-center text-slate-400">
                    Tidak ada jenis konstruksi yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => (
                  <tr
                    key={row.code}
                    className="hover:bg-blue-50/50 transition-colors divide-x divide-slate-200"
                  >
                    {/* Excel Row Index */}
                    <td className="py-2.5 px-3 text-center font-mono text-slate-400 text-[11px] bg-slate-50/60">
                      {row.rowNum}
                    </td>

                    {/* Kode / Nama Konstruksi */}
                    <td className="py-2.5 px-4 font-bold text-slate-900 sticky left-0 z-10 bg-white shadow-xs whitespace-nowrap">
                      {row.code}
                    </td>

                    {/* Material Input / Quantity Cells */}
                    {currentMaterials.map((m) => {
                      const val = row.materials[m.key];
                      const hasVal = val !== undefined && val !== null && val > 0;
                      return (
                        <td
                          key={m.key}
                          className={`py-1.5 px-2 text-center transition-colors ${
                            hasVal ? 'bg-blue-50/60' : ''
                          }`}
                        >
                          <input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="-"
                            value={val ?? ''}
                            onChange={(e) => handleCellChange(row.code, m.key, e.target.value)}
                            className={`w-full py-1 text-center text-xs font-mono rounded border transition-colors ${
                              hasVal
                                ? 'font-bold text-blue-900 bg-white border-blue-400 shadow-2xs'
                                : 'text-slate-400 bg-transparent border-transparent hover:border-slate-200 focus:bg-white focus:border-blue-500'
                            }`}
                          />
                        </td>
                      );
                    })}

                    {/* Tombol Hapus Baris */}
                    <td className="py-2 px-2 text-center whitespace-nowrap bg-slate-50/40">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.code)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                        title="Hapus baris ini"
                      >
                        <Trash2 className="w-3.5 h-3.5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={page}
          totalItems={filteredData.length}
          itemsPerPage={pageSize}
          onPageChange={setPage}
          onItemsPerPageChange={setPageSize}
          pageSizeOptions={[10, 20, 50]}
        />
      </div>

      {/* MODAL 1: Tambah Baris Konstruksi */}
      {isAddRowModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Tambah Baris Konstruksi ({activeTab})</h3>
              <button onClick={() => setIsAddRowModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddRow} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kode / Nama Konstruksi *
                </label>
                <input
                  type="text"
                  required
                  placeholder={activeTab === 'TR' ? 'Mis: 15B, STAY SET GANDA' : 'Mis: 15B, GARDU CANTOL 50kVA'}
                  value={newRowCode}
                  onChange={(e) => setNewRowCode(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg font-bold text-slate-900 uppercase focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddRowModalOpen(false)}
                  className="px-3.5 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition shadow-xs"
                >
                  Tambah Baris
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Tambah Kolom Material */}
      {isAddColModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Tambah Kolom Material ({activeTab})</h3>
              <button onClick={() => setIsAddColModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddColumn} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama / Spesifikasi Material *
                </label>
                <input
                  type="text"
                  required
                  placeholder={activeTab === 'TR' ? 'Mis: DEAD END CLAMP 70, CONNECTOR' : 'Mis: ISOLATOR TUMPU, FCO 20kV'}
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg font-bold text-slate-900 uppercase focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddColModalOpen(false)}
                  className="px-3.5 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition shadow-xs"
                >
                  Tambah Kolom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
