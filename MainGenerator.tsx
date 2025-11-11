
import React, { useState, useCallback, useRef } from 'react';
import { AuthData, FormData, RpmData } from '../types';
import { generateRpm } from '../services/geminiService';
import RPMFormComponent from './RPMFormComponent';
import RPMOutputComponent from './RPMOutputComponent';

interface MainGeneratorProps {
    auth: AuthData;
    onLogout: () => void;
}

const MainGenerator: React.FC<MainGeneratorProps> = ({ auth, onLogout }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rpmData, setRpmData] = useState<RpmData | null>(null);
    const [formData, setFormData] = useState<FormData | null>(null);
    const [generatedToken, setGeneratedToken] = useState('');

    const outputRef = useRef<HTMLDivElement>(null);

    const handleGenerate = useCallback(async (data: FormData) => {
        setIsLoading(true);
        setError(null);
        setRpmData(null);
        setFormData(data);

        try {
            const result = await generateRpm(data);
            setRpmData(result);
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan yang tidak diketahui.');
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                outputRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, []);
    
    const generateNewToken = () => {
        const newToken = `TOKEN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        setGeneratedToken(newToken);
        navigator.clipboard.writeText(newToken);
    };


    return (
        <>
            <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h1 className="text-xl font-bold text-cyan-400">Generator RPM IIF SADEWA GOA</h1>
                    <p className="text-sm text-gray-400">Selamat datang, {auth.user}</p>
                </div>
                <button
                    onClick={onLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                >
                    Logout
                </button>
            </header>

            <main className="p-4 md:p-8">
                {auth.isAdmin && (
                    <div className="mb-8 p-4 bg-gray-800 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold text-cyan-400 mb-2">Panel Admin</h2>
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={generateNewToken}
                                className="px-4 py-2 font-bold text-white bg-cyan-600 rounded-md hover:bg-cyan-700"
                            >
                                Buat Token Baru
                            </button>
                            {generatedToken && (
                                <p className="text-gray-300 bg-gray-700 px-3 py-1 rounded">
                                    Token: <span className="font-mono">{generatedToken}</span> (disalin ke clipboard)
                                </p>
                            )}
                        </div>
                    </div>
                )}
            
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <RPMFormComponent onGenerate={handleGenerate} isLoading={isLoading} />
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg min-h-[50vh]">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center h-full">
                                <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="mt-4 text-lg text-gray-300">Sedang membuat RPM... Ini mungkin memakan waktu sejenak.</p>
                            </div>
                        )}
                        {error && (
                             <div className="flex items-center justify-center h-full text-center">
                                <p className="text-red-400 bg-red-900/50 p-4 rounded-md">{error}</p>
                            </div>
                        )}
                        {rpmData && formData && (
                            <div ref={outputRef}>
                                <RPMOutputComponent rpmData={rpmData} formData={formData} />
                            </div>
                        )}
                        {!isLoading && !error && !rpmData && (
                            <div className="flex items-center justify-center h-full text-center">
                                <p className="text-gray-400">Hasil Rencana Pembelajaran Mendalam (RPM) akan muncul di sini setelah Anda mengisi formulir dan menekan tombol "Buat RPM".</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
             <footer className="text-center p-4 mt-8 text-gray-500 text-sm">
                © {new Date().getFullYear()} IIF SADEWA GOA. Ditenagai oleh Teknologi AI.
            </footer>
        </>
    );
};

export default MainGenerator;
