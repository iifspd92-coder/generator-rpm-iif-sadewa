
import React, { useRef } from 'react';
import { RpmData, FormData } from '../types';

interface RPMOutputComponentProps {
    rpmData: RpmData;
    formData: FormData;
}

const RPMOutputComponent: React.FC<RPMOutputComponentProps> = ({ rpmData, formData }) => {
    const outputRef = useRef<HTMLDivElement>(null);

    const copyToClipboard = () => {
        if (outputRef.current) {
            const content = outputRef.current.innerHTML;
            const blob = new Blob([content], { type: 'text/html' });
            const item = new ClipboardItem({ 'text/html': blob });
            navigator.clipboard.write([item]).then(() => {
                alert('Konten disalin! Buka tab baru Google Dokumen untuk menempel.');
                window.open('https://docs.new', '_blank');
            }).catch(err => {
                console.error('Gagal menyalin:', err);
                alert('Gagal menyalin konten.');
            });
        }
    };
    
    const printPdf = () => {
        window.print();
    };

    // FIX: Removed unused 'children' prop from the Section component definition.
    const Section = ({ title }: { title: string }) => (
        <tr>
            <td className="font-bold bg-gray-700 text-cyan-400 p-3 text-lg" colSpan={2}>{title}</td>
        </tr>
    );

    const Row = ({ label, value }: { label: string, value: string | string[] }) => (
        <tr>
            <td className="font-semibold p-3 w-1/3 align-top">{label}</td>
            <td className="p-3 text-justify">{Array.isArray(value) ? value.join(', ') : value}</td>
        </tr>
    );
    
    const PengalamanRow = ({ label, data, subLabel }: { label: string, data: {tag: string, kegiatan: string}, subLabel: string }) => (
         <tr>
            <td className="font-semibold p-3 w-1/3 align-top">{label}<br/><em className="text-sm text-cyan-300">({subLabel})</em></td>
            <td className="p-3 text-justify">
                <span className="font-bold text-gray-300">{data.tag}</span>: {data.kegiatan}
            </td>
        </tr>
    );

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-cyan-400 border-b border-gray-600 pb-2">Hasil Rencana Pembelajaran Mendalam (RPM)</h2>
            <div className="flex space-x-4">
                 <button onClick={copyToClipboard} className="px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700">
                    Salin & Buka di Google Dokumen
                </button>
                <button onClick={printPdf} className="px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Cetak PDF
                </button>
            </div>
            <div id="print-area" ref={outputRef} className="text-gray-200 bg-gray-800 p-4 rounded-md">
                <style>
                    {`
                    #print-area table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
                    #print-area td { border: 1px solid #4A5568; padding: 12px; vertical-align: top; text-align: justify; }
                    #print-area h3 { font-size: 1.5rem; text-align: center; font-weight: bold; margin-bottom: 1rem; color: #2DD4BF; }
                    `}
                </style>
                <h3 className="text-2xl font-bold text-center mb-4 text-cyan-400">RENCANA PEMBELAJARAN MENDALAM (RPM)</h3>
                <table className="w-full border-collapse border border-gray-600">
                    <tbody>
                        <Section title="1. Identitas" />
                        <Row label="Nama Satuan Pendidikan" value={formData.namaSatuanPendidikan} />
                        <Row label="Mata Pelajaran" value={formData.mapel} />
                        <Row label="Kelas/Semester" value={formData.kelas} />
                        <Row label="Durasi Pertemuan" value={`${formData.jumlahPertemuan} x ${formData.durasiPertemuan}`} />

                        <Section title="2. Identifikasi" />
                        <Row label="Siswa" value={rpmData.siswa} />
                        <Row label="Materi Pelajaran" value={formData.materi} />
                        <Row label="Capaian Dimensi Lulusan" value={formData.dimensiLulusan} />

                        <Section title="3. Desain Pembelajaran" />
                        <Row label="Capaian Pembelajaran" value={formData.cp} />
                        <Row label="Lintas Disiplin Ilmu" value={rpmData.lintasDisiplin} />
                        <Row label="Tujuan Pembelajaran" value={formData.tujuan} />
                        <Row label="Topik Pembelajaran" value={rpmData.topikPembelajaran} />
                        <Row label="Praktik Pedagogis per Pertemuan" value={formData.praktikPedagogis.map((p, i) => `Pertemuan ${i + 1}: ${p}`).join('; ')} />
                        <Row label="Kemitraan Pembelajaran" value={rpmData.kemitraanPembelajaran} />
                        <Row label="Lingkungan Pembelajaran" value={rpmData.lingkunganPembelajaran} />
                        <Row label="Pemanfaatan Digital" value={rpmData.pemanfaatanDigital} />
                        
                        <Section title="4. Pengalaman Belajar" />
                        {rpmData.pengalamanBelajar.map((item, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td className="font-bold bg-gray-700 p-3 text-cyan-300" colSpan={2}>Pertemuan {item.pertemuan}</td>
                                </tr>
                                <PengalamanRow label="Memahami" subLabel="Kegiatan Awal" data={item.memahami} />
                                <PengalamanRow label="Mengaplikasi" subLabel="Kegiatan Inti" data={item.mengaplikasi} />
                                <PengalamanRow label="Refleksi" subLabel="Kegiatan Penutup" data={item.refleksi} />
                            </React.Fragment>
                        ))}

                        <Section title="5. Asesmen Pembelajaran" />
                        <Row label="Asesmen Awal (diagnostik/apersepsi)" value={rpmData.asesmen.awal} />
                        <Row label="Asesmen Proses (observasi, rubrik, diskusi)" value={rpmData.asesmen.proses} />
                        <Row label="Asesmen Akhir (produk, tugas, presentasi, portofolio)" value={rpmData.asesmen.akhir} />
                    </tbody>
                </table>
                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontFamily: 'sans-serif' }}>
                    <div>
                        <p>Mengetahui,</p>
                        <p>Kepala Sekolah</p>
                        <br /><br /><br />
                        <p style={{ fontWeight: 'bold' }}>{formData.namaKepalaSekolah}</p>
                        <p>NIP. {formData.nipKepalaSekolah}</p>
                    </div>
                    <div>
                        <p>Guru Mata Pelajaran,</p>
                        <br /><br /><br /><br />
                        <p style={{ fontWeight: 'bold' }}>{formData.namaGuru}</p>
                        <p>NIP. {formData.nipGuru}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RPMOutputComponent;
