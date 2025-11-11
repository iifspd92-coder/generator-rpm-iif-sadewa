
import React, { useState, useEffect } from 'react';
import { FormData } from '../types';
import { JENJANG_PENDIDIKAN, KELAS_OPTIONS, PRAKTIK_PEDAGOGIS, DIMENSI_LULUSAN } from '../constants';

interface RPMFormComponentProps {
    onGenerate: (data: FormData) => void;
    isLoading: boolean;
}

const RPMFormComponent: React.FC<RPMFormComponentProps> = ({ onGenerate, isLoading }) => {
    const [formData, setFormData] = useState<FormData>({
        namaSatuanPendidikan: '',
        namaGuru: '',
        nipGuru: '',
        namaKepalaSekolah: '',
        nipKepalaSekolah: '',
        jenjang: JENJANG_PENDIDIKAN[0],
        kelas: KELAS_OPTIONS[JENJANG_PENDIDIKAN[0]][0],
        mapel: '',
        cp: '',
        tujuan: '',
        materi: '',
        jumlahPertemuan: 1,
        durasiPertemuan: '2 x 45 menit',
        praktikPedagogis: [PRAKTIK_PEDAGOGIS[0]],
        dimensiLulusan: [],
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            kelas: KELAS_OPTIONS[prev.jenjang][0]
        }));
    }, [formData.jenjang]);
    
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            praktikPedagogis: Array(prev.jumlahPertemuan).fill(PRAKTIK_PEDAGOGIS[0])
        }));
    }, [formData.jumlahPertemuan]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'jumlahPertemuan' ? parseInt(value) || 1 : value }));
    };
    
    const handlePraktikChange = (index: number, value: string) => {
        const newPraktik = [...formData.praktikPedagogis];
        newPraktik[index] = value;
        setFormData(prev => ({ ...prev, praktikPedagogis: newPraktik }));
    };

    const handleDimensiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            if (checked) {
                return { ...prev, dimensiLulusan: [...prev.dimensiLulusan, value] };
            } else {
                return { ...prev, dimensiLulusan: prev.dimensiLulusan.filter(dimensi => dimensi !== value) };
            }
        });
    };
    
    const validate = () => {
        const newErrors: Partial<FormData> = {};
        if (!formData.namaSatuanPendidikan) newErrors.namaSatuanPendidikan = 'Wajib diisi';
        if (!formData.namaGuru) newErrors.namaGuru = 'Wajib diisi';
        if (!formData.namaKepalaSekolah) newErrors.namaKepalaSekolah = 'Wajib diisi';
        if (!formData.mapel) newErrors.mapel = 'Wajib diisi';
        if (!formData.cp) newErrors.cp = 'Wajib diisi';
        if (!formData.tujuan) newErrors.tujuan = 'Wajib diisi';
        if (!formData.materi) newErrors.materi = 'Wajib diisi';
        if (formData.dimensiLulusan.length === 0) (newErrors as any).dimensiLulusan = 'Pilih minimal satu dimensi';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onGenerate(formData);
        }
    };

    const InputField = ({ label, name, value, onChange, error, type = "text", required = true }: any) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
            <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} className={`mt-1 block w-full bg-gray-700 border ${error ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500`} />
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        </div>
    );
    
    const TextAreaField = ({ label, name, value, onChange, error, rows=3 }: any) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
            <textarea id={name} name={name} value={value} onChange={onChange} required rows={rows} className={`mt-1 block w-full bg-gray-700 border ${error ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500`} />
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-cyan-400 border-b border-gray-600 pb-2">Formulir Input RPM</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Nama Satuan Pendidikan" name="namaSatuanPendidikan" value={formData.namaSatuanPendidikan} onChange={handleChange} error={errors.namaSatuanPendidikan} />
                <InputField label="Mata Pelajaran" name="mapel" value={formData.mapel} onChange={handleChange} error={errors.mapel} />
                <InputField label="Nama Guru" name="namaGuru" value={formData.namaGuru} onChange={handleChange} error={errors.namaGuru} />
                <InputField label="NIP Guru" name="nipGuru" value={formData.nipGuru} onChange={handleChange} required={false}/>
                <InputField label="Nama Kepala Sekolah" name="namaKepalaSekolah" value={formData.namaKepalaSekolah} onChange={handleChange} error={errors.namaKepalaSekolah} />
                <InputField label="NIP Kepala Sekolah" name="nipKepalaSekolah" value={formData.nipKepalaSekolah} onChange={handleChange} required={false} />

                <div>
                    <label htmlFor="jenjang" className="block text-sm font-medium text-gray-300">Jenjang Pendidikan</label>
                    <select id="jenjang" name="jenjang" value={formData.jenjang} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500">
                        {JENJANG_PENDIDIKAN.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="kelas" className="block text-sm font-medium text-gray-300">Kelas</label>
                    <select id="kelas" name="kelas" value={formData.kelas} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500">
                        {KELAS_OPTIONS[formData.jenjang]?.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                </div>
                
                <InputField label="Jumlah Pertemuan" name="jumlahPertemuan" value={formData.jumlahPertemuan} onChange={handleChange} type="number" />
                <InputField label="Durasi Setiap Pertemuan" name="durasiPertemuan" value={formData.durasiPertemuan} onChange={handleChange} />
            </div>
            
            <TextAreaField label="Capaian Pembelajaran (CP)" name="cp" value={formData.cp} onChange={handleChange} error={errors.cp} />
            <TextAreaField label="Tujuan Pembelajaran" name="tujuan" value={formData.tujuan} onChange={handleChange} error={errors.tujuan} />
            <TextAreaField label="Materi Pelajaran" name="materi" value={formData.materi} onChange={handleChange} error={errors.materi} rows={4}/>

            <div>
                <label className="block text-sm font-medium text-gray-300">Praktik Pedagogis per Pertemuan</label>
                <div className="mt-2 space-y-2">
                    {Array.from({ length: formData.jumlahPertemuan }, (_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <span className="text-gray-400 w-28">Pertemuan {i + 1}:</span>
                            <select value={formData.praktikPedagogis[i] || ''} onChange={e => handlePraktikChange(i, e.target.value)} className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500">
                                {PRAKTIK_PEDAGOGIS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
            </div>
            
            <div>
                 <label className="block text-sm font-medium text-gray-300">Dimensi Lulusan</label>
                 <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {DIMENSI_LULUSAN.map(dimensi => (
                        <label key={dimensi} className="flex items-center space-x-2 text-sm text-gray-200">
                            <input type="checkbox" value={dimensi} onChange={handleDimensiChange} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-cyan-600 focus:ring-cyan-500"/>
                            <span>{dimensi}</span>
                        </label>
                    ))}
                 </div>
                 {(errors as any).dimensiLulusan && <p className="mt-1 text-sm text-red-400">{(errors as any).dimensiLulusan}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-transform transform hover:scale-105 disabled:transform-none">
                {isLoading ? 'Memproses...' : 'Buat RPM'}
            </button>
        </form>
    );
};

export default RPMFormComponent;
