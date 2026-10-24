import { create } from 'zustand';
import { Role, SurveyRecord, DaftungRecord, WorkOrderRecord, StockMaterial, AuditRecord, PoleData, ApplyWoInputParams } from '@/types';

interface PromotorState {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // Surveys
  surveys: SurveyRecord[];
  addSurvey: (survey: Omit<SurveyRecord, 'id' | 'createdAt' | 'status'> & { poles: PoleData[] }) => string;
  updateSurveyStatus: (id: string, status: SurveyRecord['status']) => void;
  deleteSurvey: (id: string) => void;

  // Daftung
  daftungs: DaftungRecord[];
  addDaftungFromSurvey: (surveyId: string, finalName: string, finalIdpel: string) => string;
  updateDaftungDoc: (id: string, doc: 'nidi' | 'slo', val: boolean) => void;
  deleteDaftung: (id: string) => void;

  // Work Orders
  workOrders: WorkOrderRecord[];
  createWorkOrdersFromDaftung: (
    daftungId: string,
    idpel: string,
    customerName: string,
    customParams?: {
      paket1: {
        enabled: boolean;
        vendor: string;
        noWorkOrder: string;
        pengawas2?: string;
        pengawas1: string;
      };
      paket2: {
        enabled: boolean;
        vendor: string;
        noWorkOrder: string;
        pengawas2?: string;
        pengawas1: string;
      };
    }
  ) => void;
  updateWoProgress: (id: string, progress: number, note?: string) => void;
  updateWoReservation: (id: string, status: WorkOrderRecord['reservationStatus']) => void;
  deleteWorkOrder: (id: string) => void;

  // Stocks
  stocks: StockMaterial[];

  // Audits
  audits: AuditRecord[];
  addAudit: (activity: string, object: string, source: string) => void;
  clearAudits: () => void;

  // Toast notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

export const usePromotorStore = create<PromotorState>((set, get) => ({
  currentRole: 'Admin Daftung',
  setCurrentRole: (role) => set({ currentRole: role }),
  currentPage: 'dashboard',
  setCurrentPage: (page) => set({ currentPage: page }),

  toastMessage: null,
  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      if (get().toastMessage === msg) {
        set({ toastMessage: null });
      }
    }, 3000);
  },
  clearToast: () => set({ toastMessage: null }),

  surveys: [
    {
      id: 'SRV-0285',
      customerName: 'Perumahan Mutiara Maja Cluster Beryl 212 x 1.300 VA',
      namaDasar: 'Perumahan Mutiara Maja Cluster Beryl',
      jumlahUnit: 212,
      dayaPerUnit: '1.300',
      dayaBaru: '1.300',
      tarifBaru: 'R1T',
      kampung: 'Curug Badak',
      desa: 'Curugbadak',
      kecamatan: 'Maja',
      kabupaten: 'Kabupaten Lebak',
      location: 'Curug Badak, Curugbadak, Maja, Kabupaten Lebak',
      address: 'Dekat Stasiun Maja',
      officerName: 'Suryadi (Petugas Survey)',
      jobType: 'Pasang Baru',
      status: 'Menunggu verifikasi Daftung',
      createdAt: '23 Okt 2026 10:30',
      poles: [
        {
          id: 'TM 1',
          name: 'Tiang TM #1',
          std: 'Tiang A1',
          networkType: 'JTM',
          poleType: 'Tiang Beton 11m / 200 daN',
          tmConstruction: '1B',
          a3cs: '3x150 mm²',
          qty: 1,
          coordStr: '-6.328120, 106.398410',
          lat: -6.32812,
          lng: 106.39841,
          note: 'Pangkal tarikan depan gerbang cluster',
        },
      ],
    },
    {
      id: 'SRV-0284',
      customerName: 'PT Cipta Beton Sejahtera',
      namaDasar: 'PT Cipta Beton Sejahtera',
      idpel: '541098234112',
      jobType: 'Pasang Baru',
      kampung: 'Kawasan Industri Blok C3',
      desa: 'Cikande',
      kecamatan: 'Cikande',
      kabupaten: 'Kabupaten Serang',
      location: 'Kawasan Industri Cikande Blok C3, Serang',
      address: 'Dekat interchange tol',
      dayaBaru: '197,000',
      tarifBaru: 'I2',
      officerName: 'Suryadi (Petugas Survey)',
      status: 'Menunggu verifikasi Daftung',
      createdAt: '21 Okt 2026 14:20',
      poles: [
        {
          id: 'T1',
          name: 'Tiang #1',
          std: 'Tiang A1',
          qty: 1,
          coordStr: '-6.185240, 106.350120',
          lat: -6.18524,
          lng: 106.35012,
          note: 'Tiang sudut depan gerbang utama',
        },
        {
          id: 'T2',
          name: 'Tiang #2',
          std: 'Tiang B2',
          qty: 1,
          coordStr: '-6.185450, 106.350890',
          lat: -6.18545,
          lng: 106.35089,
          note: 'Penarikan ke arah Gardu Beton',
        },
      ],
    },
    {
      id: 'SRV-0283',
      customerName: 'Bpk. Ahmad Fauzi',
      idpel: '541088761234',
      jobType: 'Perluasan Jaringan',
      location: 'Kp. Sukamaju RT 03/02 Ds. Sindangsari',
      officerName: 'Rahmat Hidayat',
      status: 'Terverifikasi',
      createdAt: '20 Okt 2026 10:15',
      poles: [
        {
          id: 'T1',
          name: 'Tiang #1',
          std: 'Tiang A1',
          qty: 1,
          coordStr: '-6.118920, 106.148200',
          lat: -6.11892,
          lng: 106.1482,
          note: 'Pangkal percabangan JTR',
        },
      ],
    },
  ],

  addSurvey: (data) => {
    const newId = `SRV-${String(Date.now()).slice(-4)}`;
    const newRecord: SurveyRecord = {
      ...data,
      id: newId,
      status: 'Menunggu verifikasi Daftung',
      createdAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
    };
    set((state) => ({
      surveys: [newRecord, ...state.surveys],
    }));
    get().addAudit(`Survey baru ${newId} didaftarkan`, newId, 'Survey Lapangan');
    get().showToast(`✓ Survey ${newId} berhasil disimpan dengan Geotagging`);
    return newId;
  },

  updateSurveyStatus: (id, status) => {
    set((state) => ({
      surveys: state.surveys.map((s) => (s.id === id ? { ...s, status } : s)),
    }));
  },

  deleteSurvey: (id) => {
    set((state) => ({
      surveys: state.surveys.filter((s) => s.id !== id),
    }));
    get().addAudit(`Hapus data survey ${id}`, id, 'Survey');
    get().showToast(`✓ Data survey ${id} berhasil dihapus`);
  },

  daftungs: [
    {
      id: 'DF-2026-0148',
      idpel: '541012345678',
      customerName: 'CV Laut Selatan',
      source: 'Survey → REKSIS',
      woIssued: 'Belum dibuat',
      nidi: false,
      slo: false,
      status: 'Siap Apply',
    },
    {
      id: 'DF-2026-0145',
      idpel: '541088761234',
      customerName: 'Bpk. Ahmad Fauzi',
      source: 'SRV-0283',
      woIssued: '3 WO Terbit',
      nidi: true,
      slo: true,
      status: 'WO Terbit',
    },
  ],

  addDaftungFromSurvey: (surveyId, finalName, finalIdpel) => {
    const newDf = `DF-2026-${String(Date.now()).slice(-4)}`;
    const newRec: DaftungRecord = {
      id: newDf,
      idpel: finalIdpel,
      customerName: finalName,
      source: `REKSIS dari ${surveyId}`,
      woIssued: 'Belum dibuat',
      nidi: false,
      slo: false,
      status: 'Siap Apply',
      surveyId,
    };
    set((state) => ({
      daftungs: [newRec, ...state.daftungs],
      surveys: state.surveys.map((s) => (s.id === surveyId ? { ...s, status: 'Terverifikasi' } : s)),
    }));
    get().addAudit(`Survey ${surveyId} diverifikasi AP2T -> Terbit Daftung ${newDf}`, newDf, 'Daftung');
    get().showToast(`✓ Daftung ${newDf} berhasil dibuat dari ${surveyId}`);
    return newDf;
  },

  updateDaftungDoc: (id, doc, val) => {
    set((state) => ({
      daftungs: state.daftungs.map((d) => (d.id === id ? { ...d, [doc]: val } : d)),
    }));
    get().addAudit(`Update status ${doc.toUpperCase()} pada ${id}`, id, 'Daftung');
  },

  deleteDaftung: (id) => {
    set((state) => ({
      daftungs: state.daftungs.filter((d) => d.id !== id),
    }));
    get().addAudit(`Hapus data Daftung ${id}`, id, 'Daftung');
    get().showToast(`✓ Data Daftung ${id} berhasil dihapus`);
  },

  workOrders: [
    {
      id: '537.10.WO.2026',
      customerName: 'Bpk. Ahmad Fauzi',
      idpel: '541088761234',
      category: 'WO Paket 1',
      vendor: 'PT. HILMAN PRIMA PERKASA',
      supervisor: 'Hasian Sitorus (TC Lola Konstruksi)',
      supervisor1: 'Hasian Sitorus (TC Lola Konstruksi)',
      supervisor2: 'Daud Febrizer (TL Teknik ULP Rangkasbitung)',
      progress: 60,
      status: 'Konstruksi',
      reservationStatus: 'Siap Ambil',
      reservationLink: 'https://promotor.pln.co.id/r/tk-537-10-wo-2026',
      materials: [
        { material: 'Tiang beton 11m / 200 daN', qtyReksis: 4, qtyAllocated: 4, qtyReserved: 4, unit: 'Batang' },
        { material: 'Cross arm UNP 2000 mm', qtyReksis: 4, qtyAllocated: 4, qtyReserved: 4, unit: 'Set' },
        { material: 'Isolator tumpu 20 kV', qtyReksis: 12, qtyAllocated: 12, qtyReserved: 12, unit: 'Buah' },
      ],
    },
    {
      id: '538.10.WO.2026',
      customerName: 'Bpk. Ahmad Fauzi',
      idpel: '541088761234',
      category: 'WO Paket 2',
      vendor: 'PT. TAWAKAL KARYA TEKNIK',
      supervisor: 'Winnetou Chandra Sadli (Officer Kinerja Konstruksi)',
      supervisor1: 'Winnetou Chandra Sadli (Officer Kinerja Konstruksi)',
      supervisor2: 'Daud Febrizer (TL Teknik ULP Rangkasbitung)',
      progress: 20,
      status: 'Konstruksi',
      reservationStatus: 'Belum Reservasi',
      materials: [
        { material: 'Kabel LVTC (Twisted) 3x70 + 1x50 mm²', qtyReksis: 350, qtyAllocated: 300, qtyReserved: 0, unit: 'Meter' },
        { material: 'Bracket kabel & Suspension Clamp', qtyReksis: 8, qtyAllocated: 8, qtyReserved: 0, unit: 'Buah' },
      ],
    },
  ],

  createWorkOrdersFromDaftung: (daftungId, idpel, customerName, customParams) => {
    let newWos: WorkOrderRecord[] = [];

    if (customParams) {
      if (customParams.paket1?.enabled) {
        newWos.push({
          id: customParams.paket1.noWorkOrder || '537.10.WO.2026',
          noWorkOrder: customParams.paket1.noWorkOrder || '537.10.WO.2026',
          customerName,
          idpel,
          category: 'WO Paket 1',
          vendor: customParams.paket1.vendor || 'PT. HILMAN PRIMA PERKASA',
          supervisor: customParams.paket1.pengawas1 || 'Hasian Sitorus (TC Lola Konstruksi)',
          supervisor1: customParams.paket1.pengawas1 || 'Hasian Sitorus (TC Lola Konstruksi)',
          supervisor2: customParams.paket1.pengawas2 || 'Daud Febrizer (TL Teknik ULP Rangkasbitung)',
          progress: 0,
          status: 'Konstruksi',
          reservationStatus: 'Belum Reservasi',
          materials: [
            { material: 'Tiang beton 11m / 200 daN', qtyReksis: 4, qtyAllocated: 4, unit: 'Batang' },
            { material: 'Cross arm UNP 2000 mm', qtyReksis: 4, qtyAllocated: 4, unit: 'Set' },
            { material: 'Isolator Tumpu 20 kV', qtyReksis: 12, qtyAllocated: 12, unit: 'Buah' },
            { material: 'Kabel A3CS 150 mm²', qtyReksis: 200, qtyAllocated: 200, unit: 'Meter' },
          ],
        });
      }

      if (customParams.paket2?.enabled) {
        newWos.push({
          id: customParams.paket2.noWorkOrder || '538.10.WO.2026',
          noWorkOrder: customParams.paket2.noWorkOrder || '538.10.WO.2026',
          customerName,
          idpel,
          category: 'WO Paket 2',
          vendor: customParams.paket2.vendor || 'PT. TAWAKAL KARYA TEKNIK',
          supervisor: customParams.paket2.pengawas1 || 'Winnetou Chandra Sadli (Officer Kinerja Konstruksi)',
          supervisor1: customParams.paket2.pengawas1 || 'Winnetou Chandra Sadli (Officer Kinerja Konstruksi)',
          supervisor2: customParams.paket2.pengawas2 || '',
          progress: 0,
          status: 'Konstruksi',
          reservationStatus: 'Belum Reservasi',
          materials: [
            { material: 'Kabel LVTC (Twisted) 3x70 + 1x50 mm²', qtyReksis: 350, qtyAllocated: 350, unit: 'Meter' },
            { material: 'Suspension Clamp Assembly', qtyReksis: 6, qtyAllocated: 6, unit: 'Set' },
            { material: 'Fixed Dead End Assembly', qtyReksis: 2, qtyAllocated: 2, unit: 'Set' },
          ],
        });
      }
    } else {
      const ts = String(Date.now()).slice(-3);
      newWos = [
        {
          id: `537.${ts}.WO.2026`,
          customerName,
          idpel,
          category: 'WO Paket 1',
          vendor: 'PT. HILMAN PRIMA PERKASA',
          supervisor: 'Hasian Sitorus (TC Lola Konstruksi)',
          supervisor1: 'Hasian Sitorus (TC Lola Konstruksi)',
          supervisor2: 'Daud Febrizer (TL Teknik ULP Rangkasbitung)',
          progress: 0,
          status: 'Konstruksi',
          reservationStatus: 'Belum Reservasi',
          materials: [
            { material: 'Tiang beton 11m / 200 daN', qtyReksis: 4, qtyAllocated: 4, unit: 'Batang' },
            { material: 'Cross arm', qtyReksis: 4, qtyAllocated: 4, unit: 'Set' },
          ],
        },
        {
          id: `538.${ts}.WO.2026`,
          customerName,
          idpel,
          category: 'WO Paket 2',
          vendor: 'PT. TAWAKAL KARYA TEKNIK',
          supervisor: 'Winnetou Chandra Sadli (Officer Kinerja Konstruksi)',
          supervisor1: 'Winnetou Chandra Sadli (Officer Kinerja Konstruksi)',
          supervisor2: '',
          progress: 0,
          status: 'Konstruksi',
          reservationStatus: 'Belum Reservasi',
          materials: [
            { material: 'Kabel LVTC (Twisted) 3x70 + 1x50 mm²', qtyReksis: 250, qtyAllocated: 250, unit: 'Meter' },
          ],
        },
      ];
    }

    const count = newWos.length;
    const woLabels = newWos.map((w) => w.id).join(' & ');

    set((state) => ({
      workOrders: [...newWos, ...state.workOrders],
      daftungs: state.daftungs.map((d) => (d.id === daftungId ? { ...d, woIssued: `${count} WO Terbit`, status: 'WO Terbit' } : d)),
    }));
    get().addAudit(`Apply WO Daftung ${daftungId} berhasil: terbit ${count} WO (${woLabels})`, daftungId, 'Work Order');
    get().showToast(`✓ Berhasil menerbitkan ${count} Work Order (${woLabels})`);
  },

  updateWoProgress: (id, progress, note) => {
    set((state) => ({
      workOrders: state.workOrders.map((w) => (w.id === id ? { ...w, progress, status: progress === 100 ? 'Selesai' : 'Konstruksi' } : w)),
    }));
    get().addAudit(`Update progress WO ${id} menjadi ${progress}%: ${note || '-'}`, id, 'Pengawasan');
  },

  updateWoReservation: (id, status) => {
    set((state) => ({
      workOrders: state.workOrders.map((w) => (w.id === id ? { ...w, reservationStatus: status, reservationLink: `https://promotor.pln.co.id/r/tk-${id.toLowerCase()}` } : w)),
    }));
    get().addAudit(`Reservasi material WO ${id} dibuat: status ${status}`, id, 'Gudang & Reservasi');
    get().showToast(`✓ Reservasi material ${id} berhasil diperbarui`);
  },

  deleteWorkOrder: (id) => {
    set((state) => ({
      workOrders: state.workOrders.filter((w) => w.id !== id),
    }));
    get().addAudit(`Hapus Work Order ${id}`, id, 'Work Order');
    get().showToast(`✓ Work Order ${id} berhasil dihapus`);
  },

  stocks: [
    { code: 'M-01', name: 'Tiang beton 9 m', category: 'Tiang', qtyFisik: 42, qtyAlokasi: 28, qtySisa: 14, unit: 'Unit', status: 'Aman' },
    { code: 'M-02', name: 'Kabel pilin 3×70 + 50 mm²', category: 'Kabel', qtyFisik: 3200, qtyAlokasi: 2800, qtySisa: 400, unit: 'Meter', status: 'Menipis' },
    { code: 'M-03', name: 'Trafo 100 kVA 20 kV/400 V', category: 'Trafo', qtyFisik: 3, qtyAlokasi: 3, qtySisa: 0, unit: 'Unit', status: 'Kritis' },
    { code: 'M-04', name: 'Cross arm UNP 100×50×5', category: 'Aksesori', qtyFisik: 86, qtyAlokasi: 52, qtySisa: 34, unit: 'Set', status: 'Aman' },
    { code: 'M-05', name: 'Isolator tumpu 20 kV', category: 'Isolator', qtyFisik: 120, qtyAlokasi: 96, qtySisa: 24, unit: 'Buah', status: 'Aman' },
  ],

  audits: [
    { time: 'Baru saja', user: 'Admin Daftung', activity: 'Inisialisasi sistem Next.js modern', object: 'SYS-NEXTJS', source: 'Core System' },
    { time: '21 Okt 2026 14:20', user: 'Petugas Survey', activity: 'Input survey dan geotagging tiang', object: 'SRV-0284', source: 'Survey Lapangan' },
    { time: '21 Okt 2026 09:42', user: 'Admin Gudang', activity: 'Upload snapshot stok fisik gudang', object: 'STK-2026-1001', source: 'Stok Gudang' },
    { time: '21 Okt 2026 09:18', user: 'Pengawas 1', activity: 'Verifikasi Surat Jalan (SJ-0264-03)', object: 'SJ-0264-03', source: 'Pengawasan' },
  ],

  addAudit: (activity, object, source) => {
    const user = get().currentRole;
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    set((state) => ({
      audits: [{ time: `Hari ini ${time}`, user, activity, object, source }, ...state.audits],
    }));
  },

  clearAudits: () => {
    set({ audits: [] });
    get().showToast('✓ Riwayat log aktivitas berhasil dibersihkan');
  },
}));
