
import React, { useState } from 'react';
import { AuthData } from '../types';

interface LoginComponentProps {
    onLogin: (authData: AuthData) => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [isTokenLogin, setIsTokenLogin] = useState(true);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isTokenLogin) {
            if (token.trim()) {
                onLogin({ isAuthenticated: true, isAdmin: false, user: 'Peserta' });
            } else {
                setError('Token tidak boleh kosong.');
            }
        } else {
            // Admin login
            if (username === 'IIF SADEWA GOA' && password === '29021996') {
                onLogin({ isAuthenticated: true, isAdmin: true, user: 'Admin' });
            } else {
                setError('Username atau password admin salah.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-cyan-400">Generator RPM</h1>
                    <p className="text-lg text-gray-300">IIF SADEWA GOA</p>
                </div>

                <div className="flex justify-center border-b border-gray-600">
                    <button 
                        onClick={() => setIsTokenLogin(true)} 
                        className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${isTokenLogin ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-cyan-300'}`}
                    >
                        Login Peserta
                    </button>
                    <button 
                        onClick={() => setIsTokenLogin(false)} 
                        className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${!isTokenLogin ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-cyan-300'}`}
                    >
                        Login Admin
                    </button>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {isTokenLogin ? (
                        <div>
                            <label htmlFor="token" className="sr-only">Token</label>
                            <input
                                id="token"
                                name="token"
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                required
                                className="w-full px-3 py-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="Masukkan Token Anda"
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="sr-only">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Username Admin"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Password Admin"
                                />
                            </div>
                        </div>
                    )}

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-bold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-transform transform hover:scale-105"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginComponent;
