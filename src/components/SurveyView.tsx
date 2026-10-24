'use client';

import React, { useState } from 'react';
import { usePromotorStore } from '@/store/usePromotorStore';
import { PoleData } from '@/types';
import { GeotagMap } from '@/components/GeotagMap';
import { Pagination } from '@/components/Pagination';
import {
  Plus,
  MapPin,
  Camera,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
  ExternalLink,
  Search,
  Eye,
  X,
  Zap,
  Home,
  Building2,
  Users,
  CheckCircle2,
  Sparkles,
  Calculator,
  RefreshCw,

} from 'lucide-react';

export const SurveyView: React.FC = () => {
  const { surveys, addSurvey, updateSurveyStatus, deleteSurvey, showToast } = usePromotorStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [surveyPage, setSurveyPage] = useState(1);
  const [surveyPageSize, setSurveyPageSize] = useState(5);

  // Selected Photo Preview Modal
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string; caption: string } | null>(null);

  // Form Step 1: Data Pelanggan Terperinci (Sesuai Format PLN)
  const [namaDasar, setNamaDasar] = useState('');
  const [jumlahUnit, setJumlahUnit] = useState('');
  const [dayaPerUnit, setDayaPerUnit] = useState('1.300');
  const [isMultiUnit, setIsMultiUnit] = useState(false);

  // Daya & Tarif (Lama vs Baru)
  const [dayaLama, setDayaLama] = useState('');
  const [tarifLama, setTarifLama] = useState('');
  const [dayaBaru, setDayaBaru] = useState('1.300');
  const [tarifBaru, setTarifBaru] = useState('R1T');

  // Alamat Terstruktur
  const [kampung, setKampung] = useState('');
  const [desa, setDesa] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kabupaten, setKabupaten] = useState('Kabupaten Lebak');

  const [name, setName] = useState('');
  const [idpel, setIdpel] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('Pasang Baru');
  const [address, setAddress] = useState('');
  const [officer, setOfficer] = useState('');

  // Computed Full Customer Name & Full Location
  const computedCustomerName = (jumlahUnit && dayaPerUnit)
    ? `${namaDasar.trim()} ${jumlahUnit} x ${dayaPerUnit} VA`
    : namaDasar.trim() || name;

  const computedLocation = [kampung.trim(), desa.trim(), kecamatan.trim(), kabupaten.trim()]
    .filter(Boolean)
    .join(', ') || location;


  // Form Step 2: Data Teknis (Sesuai Isian Excel Baris 21 - 38)
  const [daya, setDaya] = useState('197,000');
  const [tarif, setTarif] = useState('I2');
  const [garduInduk, setGarduInduk] = useState('RANGKASBITUNG BARU (ONA)'); // Baris 21
  const [penyulang, setPenyulang] = useState('CITRA'); // Baris 22
  const [gardu, setGardu] = useState('MAJA045'); // Baris 23
  const [ulp, setUlp] = useState('ULP Rangkasbitung'); // Baris 24

  const [perluasanJTM, setPerluasanJTM] = useState(''); // Baris 26
  const [tipeGardu, setTipeGardu] = useState('Portal'); // Baris 27
  const [kapasitasTrafo, setKapasitasTrafo] = useState('250'); // Baris 28
  const [jumlahKabelNaik, setJumlahKabelNaik] = useState('2 Jurusan'); // Baris 29
  const [perluasanJTR, setPerluasanJTR] = useState(''); // Baris 30

  // Mutasi Trafo Distribusi (Baris 32)
  const [trafoLama, setTrafoLama] = useState(''); // Baris 33
  const [trafoBaru, setTrafoBaru] = useState(''); // Baris 34

  // Gardu Beton Distribusi (Baris 36)
  const [jenisPekerjaanGardu, setJenisPekerjaanGardu] = useState(''); // Baris 37
  const [jumlahKubikelLBS, setJumlahKubikelLBS] = useState(''); // Baris 38

  // Form Step 3: Data Survey Lapangan (Pilihan Sub-Tab: JTM, JTR, dan Upload Foto Lokasi)
  const [networkTab, setNetworkTab] = useState<'JTM' | 'JTR' | 'FOTO'>('JTM');
  const [locationPhotos, setLocationPhotos] = useState<Array<{ id: string; url: string; caption: string; date: string }>>([]);

  const handleLocationPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setLocationPhotos((prev) => [
          ...prev,
          {
            id: `FOTO-${Date.now()}-${i}`,
            url: base64,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
          },
        ]);
        showToast(`✓ Foto lokasi "${file.name}" berhasil ditambahkan`);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeLocationPhoto = (id: string) => {
    setLocationPhotos((prev) => prev.filter((p) => p.id !== id));
    showToast('Foto lokasi dihapus');
  };

  const [tmPoles, setTmPoles] = useState<PoleData[]>([
    {
      id: 'TM 1',
      name: 'Tiang TM #1',
      std: 'Tiang A1',
      networkType: 'JTM',
      poleType: 'Tiang Beton 11m / 200 daN',
      tmConstruction: '1B',
      a3cs: '3x150 mm²',
      qty: 1,
      coordStr: '',
      lat: null,
      lng: null,
      note: '',
      photo: '',
    },
  ]);

  const [trPoles, setTrPoles] = useState<PoleData[]>([
    {
      id: 'TR 1',
      name: 'Tiang TR #1',
      std: 'Tiang A1',
      networkType: 'JTR',
      poleType: 'Tiang Beton 9m / 200 daN',
      trConstruction: '1B',
      lvTwisted: 'JTR 70',
      qty: 1,
      coordStr: '',
      lat: null,
      lng: null,
      note: '',
      photo: '',
    },
  ]);

  // Gabungan semua tiang untuk Peta & Review
  const allPoles = [...tmPoles, ...trPoles];

  const addPoleRow = () => {
    if (networkTab === 'JTM') {
      const nextIdx = tmPoles.length + 1;
      setTmPoles([
        ...tmPoles,
        {
          id: `TM ${nextIdx}`,
          name: `Tiang TM #${nextIdx}`,
          std: 'Tiang A1',
          networkType: 'JTM',
          poleType: 'Tiang Beton 11m / 200 daN',
          tmConstruction: '1B',
          a3cs: '3x150 mm²',
          qty: 1,
          coordStr: '',
          lat: null,
          lng: null,
          note: '',
          photo: '',
        },
      ]);
    } else {
      const nextIdx = trPoles.length + 1;
      setTrPoles([
        ...trPoles,
        {
          id: `TR ${nextIdx}`,
          name: `Tiang TR #${nextIdx}`,
          std: 'Tiang A1',
          networkType: 'JTR',
          poleType: 'Tiang Beton 9m / 200 daN',
          trConstruction: '1B',
          lvTwisted: 'JTR 70',
          qty: 1,
          coordStr: '',
          lat: null,
          lng: null,
          note: '',
          photo: '',
        },
      ]);
    }
  };

  const removePoleRow = (index: number) => {
    if (networkTab === 'JTM') {
      if (tmPoles.length === 1) {
        showToast('Minimal satu baris survey tiang JTM harus ada');
        return;
      }
      const updated = tmPoles
        .filter((_, i) => i !== index)
        .map((p, idx) => ({
          ...p,
          id: `TM ${idx + 1}`,
          name: `Tiang TM #${idx + 1}`,
        }));
      setTmPoles(updated);
    } else {
      if (trPoles.length === 1) {
        showToast('Minimal satu baris survey tiang JTR harus ada');
        return;
      }
      const updated = trPoles
        .filter((_, i) => i !== index)
        .map((p, idx) => ({
          ...p,
          id: `TR ${idx + 1}`,
          name: `Tiang TR #${idx + 1}`,
        }));
      setTrPoles(updated);
    }
  };

  const handleGpsCurrentLocation = (index: number) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(6));
          const lng = parseFloat(pos.coords.longitude.toFixed(6));
          if (networkTab === 'JTM') {
            const updated = [...tmPoles];
            updated[index].lat = lat;
            updated[index].lng = lng;
            updated[index].coordStr = `${lat}, ${lng}`;
            setTmPoles(updated);
          } else {
            const updated = [...trPoles];
            updated[index].lat = lat;
            updated[index].lng = lng;
            updated[index].coordStr = `${lat}, ${lng}`;
            setTrPoles(updated);
          }
          showToast(`📍 GPS terisi: ${lat}, ${lng}`);
        },
        () => {
          // Simulation fallback if denied
          const simLat = parseFloat((-6.18 + Math.random() * 0.02).toFixed(6));
          const simLng = parseFloat((106.35 + Math.random() * 0.02).toFixed(6));
          if (networkTab === 'JTM') {
            const updated = [...tmPoles];
            updated[index].lat = simLat;
            updated[index].lng = simLng;
            updated[index].coordStr = `${simLat}, ${simLng}`;
            setTmPoles(updated);
          } else {
            const updated = [...trPoles];
            updated[index].lat = simLat;
            updated[index].lng = simLng;
            updated[index].coordStr = `${simLat}, ${simLng}`;
            setTrPoles(updated);
          }
          showToast(`GPS diblokir/offline, mengisi koordinat simulasi: ${simLat}, ${simLng}`);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  };

  const handlePhotoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      if (networkTab === 'JTM') {
        const updated = [...tmPoles];
        updated[index].photo = base64;
        setTmPoles(updated);
      } else {
        const updated = [...trPoles];
        updated[index].photo = base64;
        setTrPoles(updated);
      }
      showToast(`✓ Foto tiang #${index + 1} berhasil dilampirkan`);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSurvey = () => {
    const finalCustomerName = (name.trim() || computedCustomerName).trim();
    const finalLocation = (address.trim() || computedLocation || location).trim();

    if (!finalCustomerName || !finalLocation) {
      showToast('Nama pelanggan dan alamat lokasi pekerjaan wajib diisi');
      return;
    }

    addSurvey({
      customerName: finalCustomerName,
      namaDasar: finalCustomerName,
      dayaLama: dayaLama || undefined,
      tarifLama: tarifLama || undefined,
      dayaBaru: dayaBaru || daya,
      tarifBaru: tarifBaru || tarif,
      idpel: idpel || undefined,
      location: finalLocation,
      jobType: dayaLama ? 'Perubahan Daya' : 'Pasang Baru',
      address: finalLocation,
      officerName: officer || 'Petugas Lapangan',
      daya: dayaBaru || daya,
      tarif: tarifBaru || tarif,
      garduInduk,
      penyulang,
      gardu,
      ulp,
      perluasanJTM,
      tipePembangunanGardu: tipeGardu,
      tipeGardu,
      kapasitasTrafo,
      jumlahKabelNaik,
      perluasanJTR,
      trafoLama: trafoLama || undefined,
      trafoBaru: trafoBaru || undefined,
      jenisPekerjaanGardu: jenisPekerjaanGardu || undefined,
      jumlahKubikelLBS: jumlahKubikelLBS || undefined,
      poles: allPoles,
      locationPhotos: locationPhotos.map((lp) => lp.url),
    });

    // Reset Form
    setIsModalOpen(false);
    setStep(1);
    setNamaDasar('');
    setJumlahUnit('');
    setDayaPerUnit('1.300');
    setIsMultiUnit(false);
    setDayaLama('');
    setTarifLama('');
    setDayaBaru('1.300');
    setTarifBaru('R1T');
    setKampung('');
    setDesa('');
    setKecamatan('');
    setKabupaten('Kabupaten Lebak');
    setName('');
    setIdpel('');
    setLocation('');
    setAddress('');
    setOfficer('');
    setDaya('197,000');
    setTarif('I2');
    setPenyulang('GI Rangkasbitung Baru (ONA) ; P. Leuwidamar');
    setTipeGardu('Portal');
    setKapasitasTrafo('250');
    setJumlahKabelNaik('2 Jurusan');
    setLocationPhotos([]);
    setTmPoles([
      {
        id: 'TM 1',
        name: 'Tiang TM #1',
        std: 'Tiang A1',
        networkType: 'JTM',
        poleType: 'Tiang Beton 11m / 200 daN',
        tmConstruction: '1B',
        a3cs: '3x150 mm²',
        qty: 1,
        coordStr: '',
        lat: null,
        lng: null,
        note: '',
        photo: '',
      },
    ]);
    setTrPoles([
      {
        id: 'TR 1',
        name: 'Tiang TR #1',
        std: 'Tiang A1',
        networkType: 'JTR',
        poleType: 'Tiang Beton 9m / 200 daN',
        trConstruction: '1B',
        lvTwisted: 'JTR 70',
        qty: 1,
        coordStr: '',
        lat: null,
        lng: null,
        note: '',
        photo: '',
      },
    ]);
  };

  const filteredSurveys = surveys.filter(
    (s) =>
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedSurveys = filteredSurveys.slice(
    (surveyPage - 1) * surveyPageSize,
    surveyPage * surveyPageSize
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">Survey Lapangan & Geotagging Tiang</h2>
          <p className="text-xs text-slate-500">
            Pendataan calon pelanggan, penentuan posisi GPS tiang, dokumentasi foto, dan plotting peta otomatis.
          </p>
        </div>
        <button
          onClick={() => {
            setName('');
            setNamaDasar('');
            setIdpel('');
            setDayaLama('');
            setTarifLama('');
            setDayaBaru('1.300');
            setTarifBaru('R1T');
            setAddress('');
            setLocation('');
            setOfficer('Petugas Lapangan');
            setIsModalOpen(true);
            setStep(1);
          }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> ＋ Survey Baru
        </button>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari pelanggan, nomor survey, atau lokasi..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSurveyPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total: <b>{filteredSurveys.length}</b> Data Survey
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-blue-100/80 border-b border-blue-200 text-slate-900 uppercase font-bold text-[11px] tracking-wider">
              <tr className="divide-x divide-blue-200">
                <th className="py-3.5 px-4">No. Survey</th>
                <th className="py-3.5 px-4">IDPEL</th>
                <th className="py-3.5 px-4">Nama Pelanggan</th>
                <th className="py-3.5 px-4">Lokasi</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSurveys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada data survey yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedSurveys.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-200">
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{s.id}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">{s.idpel || '—'}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{s.customerName}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{s.location}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      s.status === 'Terverifikasi'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : s.status === 'Masuk Antrean AP2T'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          const tm = s.poles.filter((p) => (p.networkType || 'JTM') === 'JTM' || p.networkType === 'SUTM');
                          const tr = s.poles.filter((p) => p.networkType === 'JTR' || p.networkType === 'SUTR');
                          setTmPoles(tm.length > 0 ? tm : []);
                          setTrPoles(tr.length > 0 ? tr : []);
                          setName(s.customerName);
                          setNamaDasar(s.namaDasar || s.customerName);
                          setJumlahUnit(s.jumlahUnit ? String(s.jumlahUnit) : '');
                          setDayaPerUnit(s.dayaPerUnit || '1.300');
                          setIsMultiUnit(Boolean(s.jumlahUnit));
                          setDayaLama(s.dayaLama || '');
                          setTarifLama(s.tarifLama || '');
                          setDayaBaru(s.dayaBaru || s.daya || '1.300');
                          setTarifBaru(s.tarifBaru || s.tarif || 'R1T');
                          setKampung(s.kampung || '');
                          setDesa(s.desa || '');
                          setKecamatan(s.kecamatan || '');
                          setKabupaten(s.kabupaten || 'Kabupaten Lebak');
                          setIdpel(s.idpel || '');
                          setLocation(s.location);
                          setAddress(s.address || '');
                          setOfficer(s.officerName || '');
                          setDaya(s.daya || '197,000');
                          setTarif(s.tarif || 'I2');
                          setPenyulang(s.penyulang || 'GI Rangkasbitung Baru (ONA) ; P. Leuwidamar');
                          setTipeGardu(s.tipeGardu || 'Portal');
                          setKapasitasTrafo(s.kapasitasTrafo || '250');
                          setJumlahKabelNaik(s.jumlahKabelNaik || '2 Jurusan');
                          setLocationPhotos((s.locationPhotos || []).map((url, idx) => ({
                            id: `FOTO-DETAIL-${idx}`,
                            url,
                            caption: `Foto Lokasi #${idx + 1}`,
                            date: 'Tersimpan',
                          })));
                          setStep(5);
                          setIsModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 font-semibold rounded-lg transition border border-blue-200"
                      >
                        Detail
                      </button>

                      {s.status === 'Menunggu verifikasi Daftung' && (
                        <button
                          onClick={() => {
                            updateSurveyStatus(s.id, 'Masuk Antrean AP2T');
                            showToast(`✓ Survey ${s.id} berhasil dikirim ke Antrean AP2T Daftung`);
                          }}
                          className="px-3 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-500 font-bold rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                          title="Kirim survey ini ke antrean pencocokan AP2T Daftung"
                        >
                          <span>Kirim ke Antrean AP2T →</span>
                        </button>
                      )}

                      {s.status === 'Masuk Antrean AP2T' && (
                        <span className="text-[11px] text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          <span>Di Antrean AP2T</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Apakah Anda yakin ingin menghapus data survey ${s.id} (${s.customerName})?`)) {
                            deleteSurvey(s.id);
                          }
                        }}
                        className="p-1.5 text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 font-semibold rounded-lg transition border border-rose-200 cursor-pointer"
                        title="Hapus data survey"
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
          currentPage={surveyPage}
          totalItems={filteredSurveys.length}
          itemsPerPage={surveyPageSize}
          onPageChange={setSurveyPage}
          onItemsPerPageChange={setSurveyPageSize}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </div>

      {/* Survey Modal (3 Steps) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Form Survey Lapangan & Geotagging</h3>
                <p className="text-[11px] text-slate-500">
                  Tahap {step} dari 5: {step === 1 ? 'Data Pelanggan' : step === 2 ? 'Data Teknis' : step === 3 ? 'Survey Lapangan & Koordinat' : step === 4 ? 'Peta & Hasil Tagging' : 'Review & Simpan'}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Tabs (5 Tabs) */}
            <div className="flex border-b border-slate-200 bg-slate-100/60 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setStep(1)}
                className={`flex-1 py-2.5 px-3 text-center border-b-2 whitespace-nowrap transition ${step === 1 ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500'}`}
              >
                1. Data Pelanggan
              </button>
              <button
                onClick={() => setStep(2)}
                className={`flex-1 py-2.5 px-3 text-center border-b-2 whitespace-nowrap transition ${step === 2 ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500'}`}
              >
                2. Data Teknis
              </button>
              <button
                onClick={() => setStep(3)}
                className={`flex-1 py-2.5 px-3 text-center border-b-2 whitespace-nowrap transition ${step === 3 ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500'}`}
              >
                3. Survey Lapangan
              </button>
              <button
                onClick={() => setStep(4)}
                className={`flex-1 py-2.5 px-3 text-center border-b-2 whitespace-nowrap transition ${step === 4 ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500'}`}
              >
                4. Peta & Hasil Tagging
              </button>
              <button
                onClick={() => setStep(5)}
                className={`flex-1 py-2.5 px-3 text-center border-b-2 whitespace-nowrap transition ${step === 5 ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500'}`}
              >
                5. Review & Simpan
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* STEP 1: Data Pelanggan */}
              {step === 1 && (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs">
                    <b>Data Pelanggan:</b> Masukkan data identitas pemohon sesuai formulir survey PLN.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* ID Pelanggan (IDPEL) */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl sm:col-span-2">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        ID Pelanggan (IDPEL)
                      </label>
                      <input
                        type="text"
                        value={idpel}
                        onChange={(e) => setIdpel(e.target.value)}
                        placeholder="Contoh: 547100123456 (opsional)"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                      />
                    </div>

                    {/* Nama Pelanggan */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl sm:col-span-2">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Nama Pelanggan *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setNamaDasar(e.target.value);
                        }}
                        placeholder="Contoh: PERUMAHAN MUTIARA MAJA CLUSTER BERYL 212 X 1.300 VA"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    {/* Daya Lama */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Daya Lama
                      </label>
                      <input
                        type="text"
                        value={dayaLama}
                        onChange={(e) => setDayaLama(e.target.value)}
                        placeholder="Kosongkan jika Pasang Baru"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                      />
                    </div>

                    {/* Tarif Lama */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Tarif Lama
                      </label>
                      <input
                        type="text"
                        value={tarifLama}
                        onChange={(e) => setTarifLama(e.target.value)}
                        placeholder="Kosongkan jika Pasang Baru"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    {/* Daya Baru */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Daya Baru *
                      </label>
                      <input
                        type="text"
                        value={dayaBaru}
                        onChange={(e) => {
                          setDayaBaru(e.target.value);
                          setDaya(e.target.value);
                        }}
                        placeholder="Contoh: 1.300"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                      />
                    </div>

                    {/* Tarif Baru */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Tarif Baru *
                      </label>
                      <input
                        type="text"
                        value={tarifBaru}
                        onChange={(e) => {
                          setTarifBaru(e.target.value);
                          setTarif(e.target.value);
                        }}
                        placeholder="Contoh: R1T"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    {/* Alamat */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl sm:col-span-2">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Alamat *
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          setLocation(e.target.value);
                        }}
                        placeholder="Contoh: Curug Badak, Kabupaten Lebak, Banten"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Data Teknis */}
              {step === 2 && (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs">
                    <b>Data Teknis:</b> Masukkan data gardu induk, penyulang, gardu, perluasan jaringan, mutasi trafo, dan gardu beton sesuai format survey PLN.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Baris 21: Gardu Induk */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Gardu Induk *
                      </label>
                      <input
                        type="text"
                        value={garduInduk}
                        onChange={(e) => setGarduInduk(e.target.value)}
                        placeholder="Contoh: RANGKASBITUNG BARU (ONA)"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    {/* Baris 22: Penyulang */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Penyulang *
                      </label>
                      <input
                        type="text"
                        value={penyulang}
                        onChange={(e) => setPenyulang(e.target.value)}
                        placeholder="Contoh: CITRA"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    {/* Baris 23: Gardu */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Gardu *
                      </label>
                      <input
                        type="text"
                        value={gardu}
                        onChange={(e) => setGardu(e.target.value)}
                        placeholder="Contoh: MAJA045"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                      />
                    </div>

                    {/* Baris 24: ULP */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        ULP *
                      </label>
                      <input
                        type="text"
                        value={ulp}
                        onChange={(e) => setUlp(e.target.value)}
                        placeholder="Contoh: ULP Rangkasbitung"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    {/* Baris 26: Perluasan JTM */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Perluasan JTM
                      </label>
                      <input
                        type="text"
                        value={perluasanJTM}
                        onChange={(e) => setPerluasanJTM(e.target.value)}
                        placeholder="Kosongkan jika tidak ada"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    {/* Baris 27: Tipe Pembangunan Gardu */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Tipe Pembangunan Gardu
                      </label>
                      <input
                        type="text"
                        value={tipeGardu}
                        onChange={(e) => setTipeGardu(e.target.value)}
                        placeholder="Contoh: Portal / Cantol / Beton"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    {/* Baris 28: Kapasitas Trafo */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Kapasitas Trafo
                      </label>
                      <input
                        type="text"
                        value={kapasitasTrafo}
                        onChange={(e) => setKapasitasTrafo(e.target.value)}
                        placeholder="Contoh: 250 kVA"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                      />
                    </div>

                    {/* Baris 29: Jumlah Kabel Naik */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Jumlah Kabel Naik
                      </label>
                      <input
                        type="text"
                        value={jumlahKabelNaik}
                        onChange={(e) => setJumlahKabelNaik(e.target.value)}
                        placeholder="Contoh: 2 Jurusan"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    {/* Baris 30: Perluasan JTR */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl sm:col-span-2">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Perluasan JTR
                      </label>
                      <input
                        type="text"
                        value={perluasanJTR}
                        onChange={(e) => setPerluasanJTR(e.target.value)}
                        placeholder="Kosongkan jika tidak ada"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    {/* Baris 32: Mutasi Trafo Distribusi Header */}
                    <div className="sm:col-span-2 pt-2">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-1 border-b border-slate-200 flex items-center gap-2">
                        <span>Mutasi Trafo Distribusi</span>
                        <span className="text-[10px] text-slate-400 font-normal lowercase">(kosongkan jika tidak ada)</span>
                      </div>
                    </div>

                    {/* Baris 33: Trafo Lama */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Trafo Lama
                      </label>
                      <input
                        type="text"
                        value={trafoLama}
                        onChange={(e) => setTrafoLama(e.target.value)}
                        placeholder="Kosongkan jika tidak ada mutasi"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                      />
                    </div>

                    {/* Baris 34: Trafo Baru */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Trafo Baru
                      </label>
                      <input
                        type="text"
                        value={trafoBaru}
                        onChange={(e) => setTrafoBaru(e.target.value)}
                        placeholder="Kosongkan jika tidak ada mutasi"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                      />
                    </div>

                    {/* Baris 36: Gardu Beton Distribusi Header */}
                    <div className="sm:col-span-2 pt-2">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-1 border-b border-slate-200 flex items-center gap-2">
                        <span>Gardu Beton Distribusi</span>
                        <span className="text-[10px] text-slate-400 font-normal lowercase">(kosongkan jika tidak ada)</span>
                      </div>
                    </div>

                    {/* Baris 37: Jenis Pekerjaan */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Jenis Pekerjaan
                      </label>
                      <input
                        type="text"
                        value={jenisPekerjaanGardu}
                        onChange={(e) => setJenisPekerjaanGardu(e.target.value)}
                        placeholder="Contoh: Pemasangan Baru / Sipil Gardu Beton"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    {/* Baris 38: Jumlah Kubikel LBS */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">
                        Jumlah Kubikel LBS
                      </label>
                      <input
                        type="text"
                        value={jumlahKubikelLBS}
                        onChange={(e) => setJumlahKubikelLBS(e.target.value)}
                        placeholder="Contoh: 2 Unit LBS"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Data Survey Lapangan & Koordinat (Pilihan Tab JTM vs JTR) */}
              {step === 3 && (
                <div className="space-y-4 text-xs">
                  {/* Notice Banner */}
                  <div className="p-3.5 bg-[#f0f6fd] border border-[#d6e6f7] rounded-xl text-[#1e40af] text-xs leading-relaxed flex items-center justify-between">
                    <div>
                      <b>Survey Lapangan & Koordinat:</b> Input spesifikasi teknis dan titik koordinat GPS (ketik manual atau klik tombol 📍 <b>GPS</b>) langsung di setiap baris tiang. Tahap 4 berikutnya akan menampilkan visualisasi peta dan hasil tagging tiangnya.
                    </div>
                  </div>

                  {/* JTM / JTR / Upload Foto Lokasi Segmented Tabs */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setNetworkTab('JTM')}
                        className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-2 ${
                          networkTab === 'JTM'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        <span>⚡ JTM</span>
                        <span className="text-[10px] font-normal opacity-90">({tmPoles.length} Tiang)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNetworkTab('JTR')}
                        className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-2 ${
                          networkTab === 'JTR'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        <span>🔌 JTR</span>
                        <span className="text-[10px] font-normal opacity-90">({trPoles.length} Tiang)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNetworkTab('FOTO')}
                        className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-2 ${
                          networkTab === 'FOTO'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Upload Foto Lokasi</span>
                        <span className="text-[10px] font-normal opacity-90">({locationPhotos.length} Foto)</span>
                      </button>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-500 pr-2 flex items-center gap-2">
                      <span>Total: <b className="text-slate-800">{allPoles.length} Tiang • {locationPhotos.length} Foto Lokasi</b></span>
                    </div>
                  </div>

                  {/* Content Tab: If FOTO, display Photo Upload Gallery; otherwise display Pole Table */}
                  {networkTab === 'FOTO' ? (
                    <div className="space-y-4">
                      {/* Photo Upload Zone */}
                      <div className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/40 rounded-2xl p-6 text-center transition flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2 shadow-2xs">
                          <Camera className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-xs mb-1">Upload Dokumentasi Foto Lapangan</h4>
                        <p className="text-[11px] text-slate-500 max-w-md mb-3">
                          Lampirkan foto kondisi lokasi, akses jalan, calon titik tiang, atau patokan lapangan (bisa langsung dari kamera HP atau galeri).
                        </p>
                        <label className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition">
                          <Plus className="w-4 h-4" />
                          <span>Pilih Foto dari Perangkat</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleLocationPhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Photo Grid Gallery */}
                      {locationPhotos.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {locationPhotos.map((photo, pIdx) => (
                            <div key={photo.id} className="relative group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition">
                              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setPreviewPhoto({ url: photo.url, title: `Foto Lokasi #${pIdx + 1}`, caption: photo.caption })}>
                                <img
                                  src={photo.url}
                                  alt={photo.caption}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[11px] font-bold gap-1">
                                  <Eye className="w-4 h-4" /> Perbesar
                                </div>
                              </div>
                              <div className="p-2.5">
                                <input
                                  type="text"
                                  value={photo.caption}
                                  onChange={(e) => {
                                    const updated = [...locationPhotos];
                                    updated[pIdx].caption = e.target.value;
                                    setLocationPhotos(updated);
                                  }}
                                  placeholder="Keterangan foto..."
                                  className="w-full text-[11px] font-semibold text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none py-0.5 bg-transparent"
                                />
                                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                                  <span>{photo.date}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeLocationPhoto(photo.id)}
                                    className="text-rose-500 hover:text-rose-700 font-bold hover:underline cursor-pointer"
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-slate-400 border border-slate-200 rounded-xl bg-slate-50 text-xs">
                          Belum ada foto lokasi yang diunggah. Klik tombol di atas untuk menambahkan foto dokumentasi.
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Tabular Form Container for Poles */}
                      <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs min-w-[880px] border-collapse">
                            <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-700 font-bold text-[11px]">
                              <tr className="divide-x divide-slate-200">
                                <th className="py-3.5 px-3 w-[8%] text-center">No Tiang</th>
                                <th className="py-3.5 px-3 w-[26%]">Tiang</th>
                                {networkTab === 'JTM' ? (
                                  <>
                                    <th className="py-3.5 px-3 w-[20%]">Konstruksi TM</th>
                                    <th className="py-3.5 px-3 w-[16%]">A3CS</th>
                                  </>
                                ) : (
                                  <>
                                    <th className="py-3.5 px-3 w-[20%]">Konstruksi TR</th>
                                    <th className="py-3.5 px-3 w-[16%]">JTR 70</th>
                                  </>
                                )}
                                <th className="py-3.5 px-3 w-[24%]">Koordinat GPS (Lat, Long)</th>
                                <th className="py-3.5 px-2 w-[6%] text-center">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {(networkTab === 'JTM' ? tmPoles : trPoles).map((p, idx) => (
                                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors divide-x divide-slate-200">
                                  {/* No Tiang */}
                                  <td className="py-3.5 px-3 text-center font-bold text-slate-800">
                                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                      networkTab === 'JTM' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                      {p.id}
                                    </span>
                                  </td>

                                  {/* 1. Input Tiang */}
                                  <td className="py-3 px-3">
                                    <select
                                      value={p.poleType || (networkTab === 'JTM' ? 'Tiang Beton 11m / 200 daN' : 'Tiang Beton 9m / 200 daN')}
                                      onChange={(e) => {
                                        if (networkTab === 'JTM') {
                                          const updated = [...tmPoles];
                                          updated[idx].poleType = e.target.value;
                                          setTmPoles(updated);
                                        } else {
                                          const updated = [...trPoles];
                                          updated[idx].poleType = e.target.value;
                                          setTrPoles(updated);
                                        }
                                      }}
                                      className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
                                    >
                                      <option value="">Pilih Tiang</option>
                                      {networkTab === 'JTM' ? (
                                        <>
                                          <option>Tiang Beton 11m / 200 daN</option>
                                          <option>Tiang Beton 11m / 350 daN</option>
                                          <option>Tiang Beton 11m / 500 daN</option>
                                          <option>Tiang Beton 12m / 350 daN</option>
                                          <option>Tiang Beton 13m / 350 daN</option>
                                          <option>Tiang Beton 14m / 350 daN</option>
                                          <option>Tiang Besi 11m</option>
                                          <option>Tiang Besi 12m</option>
                                        </>
                                      ) : (
                                        <>
                                          <option>Tiang Beton 9m / 200 daN</option>
                                          <option>Tiang Beton 9m / 350 daN</option>
                                          <option>Tiang Beton 11m / 200 daN</option>
                                          <option>Tiang Besi 9m</option>
                                          <option>Tiang Besi 11m</option>
                                        </>
                                      )}
                                    </select>
                                  </td>

                                  {/* 2 & 3. JTM vs JTR Fields */}
                                  {networkTab === 'JTM' ? (
                                    <>
                                      {/* Input Konstruksi TM */}
                                      <td className="py-3 px-3">
                                        <select
                                          value={p.tmConstruction || '1B'}
                                          onChange={(e) => {
                                            const updated = [...tmPoles];
                                            updated[idx].tmConstruction = e.target.value;
                                            setTmPoles(updated);
                                          }}
                                          className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
                                        >
                                          <option value="">Pilih Konstruksi TM</option>
                                          <option value="1B">1B (Tumpu)</option>
                                          <option value="2B">2B (Sudut Kecil)</option>
                                          <option value="3B">3B (Sudut Besar)</option>
                                          <option value="4B">4B (Tegang Akhir)</option>
                                          <option value="5B">5B (Awal / Akhir)</option>
                                          <option value="6B">6B (Cabang)</option>
                                          <option value="7B">7B (Double Arm)</option>
                                          <option value="8B">8B (Transposisi)</option>
                                          <option value="9B">9B (Portal TM)</option>
                                          <option value="10B">10B (Section)</option>
                                          <option value="11B">11B (+ LA 3)</option>
                                          <option value="12B">12B (+ LA 3)</option>
                                          <option value="13B">13B</option>
                                          <option value="14B">14B</option>
                                          <option value="GARDU CANTOL">GARDU CANTOL</option>
                                          <option value="GARDU PORTAL">GARDU PORTAL</option>
                                          <option value="GARDU PORTAL RMU">GARDU PORTAL RMU</option>
                                          <option value="GARDU BETON">GARDU BETON</option>
                                          <option value="STAYSET">STAYSET</option>
                                          <option value="CO AFTAK">CO AFTAK</option>
                                        </select>
                                      </td>

                                      {/* Input A3CS */}
                                      <td className="py-3 px-3">
                                        <select
                                          value={p.a3cs || '3x150 mm²'}
                                          onChange={(e) => {
                                            const updated = [...tmPoles];
                                            updated[idx].a3cs = e.target.value;
                                            setTmPoles(updated);
                                          }}
                                          className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
                                        >
                                          <option value="">Pilih A3CS</option>
                                          <option>3x150 mm² (Span Standar)</option>
                                          <option>3x240 mm² (Span Standar)</option>
                                          <option>1x150 mm²</option>
                                          <option>1x240 mm²</option>
                                          <option>3x70 mm²</option>
                                          <option>A3C 150 mm² (Non-Insulated)</option>
                                          <option>Tanpa Tarikan Kabel</option>
                                        </select>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      {/* Input Konstruksi TR */}
                                      <td className="py-3 px-3">
                                        <select
                                          value={p.trConstruction || '1B'}
                                          onChange={(e) => {
                                            const updated = [...trPoles];
                                            updated[idx].trConstruction = e.target.value;
                                            setTrPoles(updated);
                                          }}
                                          className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
                                        >
                                          <option value="">Pilih Konstruksi TR</option>
                                          <option value="1B">1B (Tumpu TR)</option>
                                          <option value="2B">2B (Sudut Kecil TR)</option>
                                          <option value="3B">3B</option>
                                          <option value="4B">4B</option>
                                          <option value="5B">5B</option>
                                          <option value="6B">6B</option>
                                          <option value="7B">7B</option>
                                          <option value="8B">8B</option>
                                          <option value="9B">9B</option>
                                          <option value="10B AWAL">10B AWAL (Tegang Awal TR)</option>
                                          <option value="10B AKHIR">10B AKHIR (Tegang Akhir TR)</option>
                                          <option value="11B">11B</option>
                                          <option value="PEMBUMIAN">PEMBUMIAN</option>
                                          <option value="STAY SET TR">STAY SET TR</option>
                                        </select>
                                      </td>

                                      {/* Input JTR 70 (Kabel TR) */}
                                      <td className="py-3 px-3">
                                        <select
                                          value={p.lvTwisted || 'JTR 70'}
                                          onChange={(e) => {
                                            const updated = [...trPoles];
                                            updated[idx].lvTwisted = e.target.value;
                                            setTrPoles(updated);
                                          }}
                                          className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
                                        >
                                          <option value="">Pilih JTR</option>
                                          <option value="JTR 70">JTR 70 (3x70 + 1x50 mm²)</option>
                                          <option value="JTR 35">JTR 35 (3x35 + 1x25 mm²)</option>
                                          <option value="JTR 50">JTR 50 (3x50 + 1x35 mm²)</option>
                                          <option value="JTR 25">JTR 25 (3x25 + 1x25 mm²)</option>
                                          <option value="2x16 mm²">2x16 mm² (Sambungan Rumah)</option>
                                          <option value="Tanpa JTR">Tanpa JTR</option>
                                        </select>
                                      </td>
                                    </>
                                  )}

                                  {/* 4. Koordinat (Lat, Long) & Tombol GPS */}
                                  <td className="py-3 px-3">
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        type="text"
                                        placeholder="-6.xxxxxx, 106.xxxxxx"
                                        value={p.coordStr}
                                        onChange={(e) => {
                                          const isTM = networkTab === 'JTM';
                                          const updated = isTM ? [...tmPoles] : [...trPoles];
                                          updated[idx].coordStr = e.target.value;
                                          const val = e.target.value.trim();
                                          const parts = val.includes(',') ? val.split(',') : val.split(/\s+/);
                                          if (parts.length >= 2) {
                                            const lat = parseFloat(parts[0].trim());
                                            const lng = parseFloat(parts[1].trim());
                                            updated[idx].lat = isNaN(lat) ? null : lat;
                                            updated[idx].lng = isNaN(lng) ? null : lng;
                                          } else if (val === '') {
                                            updated[idx].lat = null;
                                            updated[idx].lng = null;
                                          }
                                          if (isTM) setTmPoles(updated);
                                          else setTrPoles(updated);
                                        }}
                                        className="flex-1 p-2 border border-slate-200 rounded-xl text-xs font-mono font-medium bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleGpsCurrentLocation(idx)}
                                        className="px-2.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer"
                                        title="Ambil titik GPS real-time saat ini"
                                      >
                                        <span>📍</span>
                                        <span>GPS</span>
                                      </button>
                                    </div>
                                  </td>

                                  {/* 5. Tombol Hapus */}
                                  <td className="py-3 px-2 text-center">
                                    <button
                                      type="button"
                                      onClick={() => removePoleRow(idx)}
                                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
                                    >
                                      Hapus
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Tombol Tambah Baris */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={addPoleRow}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Tambah baris survey ({networkTab})</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* STEP 4: Koordinat Map (Hanya Gambar Peta dan Hasil Tagging) */}
              {step === 4 && (
                <div className="space-y-4 text-xs">
                  {/* Notice Banner */}
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs flex items-center justify-between">
                    <div>
                      <b>Peta Geotagging & Hasil Tagging:</b> Menampilkan gambar peta satelit dan persebaran titik tiang (<b>⚡ TM</b> dan <b>🔌 TR</b>) serta bentangan jaringan yang telah diinput di tahap sebelumnya.
                    </div>
                  </div>

                  {/* Leaflet Map with Google Satelit Hybrid & Tagging Markers */}
                  <GeotagMap
                    poles={allPoles}
                    onViewPhoto={(url, title, caption) => setPreviewPhoto({ url, title, caption })}
                  />
                </div>
              )}

              {/* STEP 5: Review & Simpan */}
              {step === 5 && (
                <div className="space-y-4">
                  {/* Customer summary */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-slate-400 block font-semibold">Nama Pelanggan:</span>
                      <b className="text-slate-900 text-xs">{name || computedCustomerName || '-'}</b>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">IDPEL:</span>
                      <b className="text-slate-800 font-mono">{idpel || '—'}</b>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Petugas Survey:</span>
                      <b className="text-slate-800">{officer || 'Petugas Lapangan'}</b>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-slate-400 block font-semibold">Alamat:</span>
                      <b className="text-slate-800">{address || computedLocation || location || '-'}</b>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Daya & Tarif Baru:</span>
                      <b className="text-blue-900 font-mono">{dayaBaru || daya} VA ({tarifBaru || tarif})</b>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Daya & Tarif Lama:</span>
                      <b className="text-slate-700 font-mono">{dayaLama ? `${dayaLama} VA (${tarifLama || '-'})` : '— (Baru)'}</b>
                    </div>
                  </div>

                  {/* Technical Data summary */}
                  <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Gardu Induk</span>
                      <b className="text-slate-900 truncate block">{garduInduk || '-'}</b>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Penyulang</span>
                      <b className="text-slate-900 truncate block">{penyulang || '-'}</b>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Gardu</span>
                      <b className="text-slate-900 font-mono">{gardu || '-'}</b>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">ULP</span>
                      <b className="text-slate-900">{ulp || '-'}</b>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Tipe Gardu</span>
                      <b className="text-slate-900">{tipeGardu || '-'}</b>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Kapasitas Trafo</span>
                      <b className="font-mono text-slate-900">{kapasitasTrafo || '-'}</b>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Kabel Naik</span>
                      <b className="text-slate-900">{jumlahKabelNaik || '-'}</b>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Perluasan JTM / JTR</span>
                      <b className="text-slate-900">{[perluasanJTM, perluasanJTR].filter(Boolean).join(' • ') || '-'}</b>
                    </div>
                  </div>

                  {/* Table review */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-slate-700 font-semibold text-[11px] border-b border-slate-200">
                        <tr className="divide-x divide-slate-200">
                          <th className="p-2.5">No</th>
                          <th className="p-2.5">Jaringan & Tiang</th>
                          <th className="p-2.5">Konstruksi</th>
                          <th className="p-2.5">Kabel Konduktor</th>
                          <th className="p-2.5">Koordinat (GPS)</th>
                          <th className="p-2.5">Keterangan</th>
                          <th className="p-2.5 text-center">Foto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {allPoles.map((p, idx) => (
                          <tr key={idx} className="divide-x divide-slate-200">
                            <td className="p-2.5 font-bold text-slate-800">{p.id}</td>
                            <td className="p-2.5">
                              <div className="font-semibold text-slate-800">{p.poleType || 'Tiang Beton 11m'}</div>
                              <span className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                ((p.networkType || 'JTM') === 'JTM' || p.networkType === 'SUTM') ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                {((p.networkType || 'JTM') === 'JTM' || p.networkType === 'SUTM') ? 'JTM' : 'JTR'}
                              </span>
                            </td>
                            <td className="p-2.5">
                              {((p.networkType || 'JTM') === 'JTM' || p.networkType === 'SUTM') ? (
                                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-bold border border-purple-200 text-[10px]">
                                  TM: {p.tmConstruction || '1B'}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[10px]">
                                  TR: {p.trConstruction || '1B'}
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 text-slate-700">
                              {((p.networkType || 'JTM') === 'JTM' || p.networkType === 'SUTM') ? (p.a3cs || '3x150 mm²') : (p.lvTwisted || 'JTR 70')}
                            </td>
                            <td className="p-2.5 font-mono text-[11px]">
                              {p.lat && p.lng ? (
                                <span className="text-blue-700 font-bold">{p.lat.toFixed(6)}, {p.lng.toFixed(6)}</span>
                              ) : (
                                <span className="text-amber-600">Belum ada GPS</span>
                              )}
                            </td>
                            <td className="p-2.5 text-slate-600">{p.note || '—'}</td>
                            <td className="p-2.5">
                              {p.photo ? (
                                <button
                                  type="button"
                                  onClick={() => setPreviewPhoto({ url: p.photo!, title: `Foto ${p.name}`, caption: p.note || p.std })}
                                  className="text-blue-600 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                                >
                                  <Camera className="w-3 h-3" /> Lihat Foto
                                </button>
                              ) : (
                                <span className="text-slate-400 text-[11px]">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Foto Dokumentasi Lokasi Review */}
                  {locationPhotos.length > 0 && (
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-purple-600" /> Foto Dokumentasi Lokasi ({locationPhotos.length} Foto)
                          </span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {locationPhotos.map((lp, idx) => (
                            <div
                              key={lp.id || idx}
                              onClick={() => setPreviewPhoto({ url: lp.url, title: lp.caption || `Foto Lokasi #${idx + 1}`, caption: lp.date })}
                              className="group relative aspect-4/3 rounded-lg overflow-hidden border border-slate-200 bg-white cursor-pointer shadow-2xs hover:shadow-md transition"
                            >
                              <img src={lp.url} alt={lp.caption} className="w-full h-full object-cover group-hover:scale-105 transition" />
                              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[9px] font-bold">
                                Perbesar
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
              )}
            </div>


            {/* Modal Footer Actions */}
            <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((step - 1) as any)}
                  className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Sebelumnya
                </button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep((step + 1) as any)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  Lanjut Tahap Berikutnya <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveSurvey}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md"
                >
                  <Check className="w-4 h-4" /> Simpan Survey Lapangan
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Resolution Photo Viewer Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-800">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm">{previewPhoto.title}</h4>
              <button onClick={() => setPreviewPhoto(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-950 flex items-center justify-center">
              <img
                src={previewPhoto.url}
                alt={previewPhoto.title}
                className="max-h-[360px] max-w-full rounded-lg object-contain shadow-lg"
              />
            </div>
            <div className="p-3 px-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>{previewPhoto.caption || 'Dokumentasi visual fisik lapangan'}</span>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="px-3 py-1 bg-slate-200 text-slate-700 rounded font-semibold text-xs hover:bg-slate-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
