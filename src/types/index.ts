export type Role = 'Admin Daftung' | 'Admin WO' | 'Pengawas' | 'Admin Gudang';

export interface PoleData {
  id: string; // T1, T2
  name: string;
  std: string;
  networkType?: 'JTM' | 'JTR' | 'SUTM' | 'SUTR'; // Default JTM (Jaringan Tegangan Menengah) atau JTR (Jaringan Tegangan Rendah)
  poleType?: string; // Tiang beton (9m/11m/12m/13m/14m), dll
  tmConstruction?: string; // 1B, 2B, 3B ... Gardu Cantol, Gardu Portal, dll
  a3cs?: string; // 1x150, 1x240, 3x150, 3x240, meteran/span
  trConstruction?: string; // 1B, 2B, 3B, 4B, 10B AWAL, 10B AKHIR, STAY SET TR, dll
  lvTwisted?: string; // JTR 70, JTR 35, JTR 50, JTR 25, 2x16 mm², dll
  qty: number;
  coordStr: string;
  lat: number | null;
  lng: number | null;
  note: string;
  photo?: string;
}

export interface SurveyRecord {
  id: string;
  customerName: string;
  namaDasar?: string; // Nama pelanggan / proyek / perumahan
  jumlahUnit?: number; // Jumlah unit
  dayaPerUnit?: string; // Daya per unit (VA)
  idpel?: string;
  jobType: string;
  location: string;
  address?: string;
  // Alamat terstruktur
  kampung?: string;
  desa?: string;
  kecamatan?: string;
  kabupaten?: string;
  officerName?: string;
  // Daya & Tarif (Lama vs Baru)
  dayaLama?: string;
  tarifLama?: string;
  dayaBaru?: string;
  tarifBaru?: string;
  // Data Teknis (Sesuai Isian Excel Baris 21-38)
  garduInduk?: string; // Baris 21: Gardu Induk
  penyulang?: string; // Baris 22: Penyulang
  gardu?: string; // Baris 23: Gardu
  ulp?: string; // Baris 24: ULP
  perluasanJTM?: string; // Baris 26: Perluasan JTM
  tipePembangunanGardu?: string; // Baris 27: Tipe Pembangunan Gardu
  tipeGardu?: string; // Alias
  kapasitasTrafo?: string; // Baris 28: Kapasitas Trafo
  jumlahKabelNaik?: string; // Baris 29: Jumlah Kabel Naik
  perluasanJTR?: string; // Baris 30: Perluasan JTR
  trafoLama?: string; // Baris 33: Mutasi Trafo Lama
  trafoBaru?: string; // Baris 34: Mutasi Trafo Baru
  jenisPekerjaanGardu?: string; // Baris 37: Gardu Beton Jenis Pekerjaan
  jumlahKubikelLBS?: string; // Baris 38: Jumlah Kubikel LBS
  daya?: string;
  tarif?: string;
  status: 'Menunggu verifikasi Daftung' | 'Masuk Antrean AP2T' | 'Terverifikasi' | 'Draf';
  poles: PoleData[];
  locationPhotos?: string[]; // Foto dokumentasi lokasi / survey lapangan umum
  createdAt: string;
}

export interface DaftungRecord {
  id: string;
  idpel: string;
  customerName: string;
  source: string;
  woIssued: string;
  nidi: boolean;
  slo: boolean;
  status: 'Siap Apply' | 'WO Terbit' | 'Selesai';
  surveyId?: string;
}

export interface WoMaterialItem {
  material: string;
  qtyReksis: number;
  qtyAllocated: number;
  qtyReserved?: number;
  unit: string;
}

export interface ApplyWoPackageInput {
  enabled: boolean;
  vendor: string;
  noWorkOrder: string;
  pengawas2?: string;
  pengawas1: string;
}

export interface ApplyWoInputParams {
  daftungId: string;
  idpel: string;
  customerName: string;
  paket1: ApplyWoPackageInput;
  paket2: ApplyWoPackageInput;
}

export interface WorkOrderRecord {
  id: string; // No Work Order (misal: 537.10.WO.2026)
  customerName: string;
  idpel: string;
  category: 'WO Tiang' | 'WO Paket 1' | 'WO Paket 2';
  vendor: string;
  supervisor: string;
  supervisor1?: string; // Pengawas 1 (TC Lola Konstruksi / Officer Kinerja)
  supervisor2?: string; // Pengawas 2 (TL Teknik ULP)
  noWorkOrder?: string;
  progress: number;
  status: 'Konstruksi' | 'Verifikasi SJ' | 'Selesai' | 'Draf';
  reservationStatus: 'Belum Reservasi' | 'Reservasi Sebagian' | 'Siap Ambil' | 'Selesai';
  reservationLink?: string;
  materials: WoMaterialItem[];
}

export interface StockMaterial {
  code: string;
  name: string;
  category: string;
  qtyFisik: number;
  qtyAlokasi: number;
  qtySisa: number;
  unit: string;
  status: 'Aman' | 'Kritis' | 'Menipis';
}

export interface AuditRecord {
  time: string;
  user: string;
  activity: string;
  object: string;
  source: string;
}
