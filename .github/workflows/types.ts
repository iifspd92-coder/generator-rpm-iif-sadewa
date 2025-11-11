
export interface FormData {
    namaSatuanPendidikan: string;
    namaGuru: string;
    nipGuru: string;
    namaKepalaSekolah: string;
    nipKepalaSekolah: string;
    jenjang: string;
    kelas: string;
    mapel: string;
    cp: string;
    tujuan: string;
    materi: string;
    jumlahPertemuan: number;
    durasiPertemuan: string;
    praktikPedagogis: string[];
    dimensiLulusan: string[];
}

export interface PengalamanBelajar {
    pertemuan: number;
    memahami: { tag: string; kegiatan: string };
    mengaplikasi: { tag: string; kegiatan: string };
    refleksi: { tag: string; kegiatan: string };
}

export interface RpmData {
    siswa: string;
    lintasDisiplin: string;
    topikPembelajaran: string;
    kemitraanPembelajaran: string;
    lingkunganPembelajaran: string;
    pemanfaatanDigital: string;
    pengalamanBelajar: PengalamanBelajar[];
    asesmen: {
        awal: string;
        proses: string;
        akhir: string;
    };
}

export interface AuthData {
    isAuthenticated: boolean;
    isAdmin: boolean;
    user: string;
}
