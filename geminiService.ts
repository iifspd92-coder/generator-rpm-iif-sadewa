
import { GoogleGenAI, Type } from '@google/genai';
import { FormData, RpmData } from '../types';

export async function generateRpm(formData: FormData): Promise<RpmData> {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const praktikPedagogisPerPertemuan = formData.praktikPedagogis.map((praktik, index) => {
        return `Pertemuan ${index + 1}: ${praktik}`;
    }).join('; ');

    const prompt = `
Anda adalah seorang ahli perancangan kurikulum dan pedagogi yang sangat berpengalaman di Indonesia. Tugas Anda adalah membuat konten untuk Rencana Pembelajaran Mendalam (RPM) yang komprehensif dan berkualitas tinggi berdasarkan data yang diberikan.

Tolong hasilkan output dalam format JSON yang valid dan HANYA JSON, tidak ada teks pembuka atau penutup lain.

Berikut adalah data input dari guru:
- Jenjang Pendidikan: ${formData.jenjang}
- Kelas: ${formData.kelas}
- Mata Pelajaran: ${formData.mapel}
- Capaian Pembelajaran (CP): ${formData.cp}
- Tujuan Pembelajaran: ${formData.tujuan}
- Materi Pelajaran: ${formData.materi}
- Jumlah Pertemuan: ${formData.jumlahPertemuan}
- Dimensi Lulusan yang dituju: ${formData.dimensiLulusan.join(', ')}
- Praktik Pedagogis per Pertemuan: ${praktikPedagogisPerPertemuan}

Pastikan semua langkah kegiatan dijelaskan secara rinci, praktis, dan sesuai dengan konteks pendidikan di Indonesia. Untuk bagian 'mengaplikasi', perhatikan sintaks dari praktik pedagogis yang dipilih untuk setiap pertemuan. Setiap kegiatan dalam pengalaman belajar (memahami, mengaplikasi, refleksi) harus dalam bentuk paragraf yang justifikasi (rata kanan-kiri).
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            siswa: { type: Type.STRING, description: 'Deskripsi singkat karakteristik siswa umum untuk jenjang dan kelas ini.' },
            lintasDisiplin: { type: Type.STRING, description: 'Identifikasi 2-3 mata pelajaran lain yang relevan dan jelaskan keterkaitannya.' },
            topikPembelajaran: { type: Type.STRING, description: 'Buat judul topik yang menarik berdasarkan materi pelajaran yang diberikan.' },
            kemitraanPembelajaran: { type: Type.STRING, description: 'Saran kemitraan yang relevan, misal: orang tua, komunitas lokal, profesional.' },
            lingkunganPembelajaran: { type: Type.STRING, description: 'Deskripsi lingkungan belajar yang mendukung, misal: kelas kolaboratif, luar ruangan.' },
            pemanfaatanDigital: { type: Type.STRING, description: 'Saran tools digital/online yang relevan dengan materi, beserta link jika memungkinkan.' },
            pengalamanBelajar: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        pertemuan: { type: Type.NUMBER },
                        memahami: { 
                            type: Type.OBJECT, 
                            properties: {
                                tag: { type: Type.STRING, description: "Pilih salah satu: berkesadaran, bermakna, menggembirakan" },
                                kegiatan: { type: Type.STRING, description: "Langkah-langkah kegiatan Awal/Pembuka" }
                            }
                        },
                        mengaplikasi: { 
                            type: Type.OBJECT, 
                            properties: {
                                tag: { type: Type.STRING, description: "Pilih salah satu: berkesadaran, bermakna, menggembirakan" },
                                kegiatan: { type: Type.STRING, description: "Langkah-langkah kegiatan Inti, sesuaikan dengan sintaks praktik pedagogis yang dipilih" }
                            }
                        },
                        refleksi: { 
                            type: Type.OBJECT, 
                            properties: {
                                tag: { type: Type.STRING, description: "Pilih salah satu: berkesadaran, bermakna, menggembirakan" },
                                kegiatan: { type: Type.STRING, description: "Langkah-langkah kegiatan Penutup/Refleksi" }
                            }
                        },
                    }
                }
            },
            asesmen: {
                type: Type.OBJECT,
                properties: {
                    awal: { type: Type.STRING, description: 'Deskripsi asesmen diagnostik/apersepsi yang sesuai.' },
                    proses: { type: Type.STRING, description: 'Deskripsi asesmen formatif selama proses pembelajaran (observasi, rubrik, dll).' },
                    akhir: { type: Type.STRING, description: 'Deskripsi asesmen sumatif di akhir (produk, tugas, presentasi, dll).' },
                }
            }
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.7,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as RpmData;
    } catch (error) {
        console.error("Error generating RPM with Gemini:", error);
        throw new Error("Gagal menghasilkan RPM. Silakan coba lagi.");
    }
}
