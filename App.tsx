
import React, { useState, useCallback, useEffect } from 'react';
import LoginComponent from './components/LoginComponent';
import MainGenerator from './components/MainGenerator';
import { AuthData } from './types';

const App: React.FC = () => {
    const [auth, setAuth] = useState<AuthData | null>(null);

    useEffect(() => {
        const storedAuth = localStorage.getItem('rpm-auth');
        if (storedAuth) {
            setAuth(JSON.parse(storedAuth));
        }
    }, []);

    const handleLogin = useCallback((authData: AuthData) => {
        setAuth(authData);
        localStorage.setItem('rpm-auth', JSON.stringify(authData));
    }, []);

    const handleLogout = useCallback(() => {
        setAuth(null);
        localStorage.removeItem('rpm-auth');
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            {auth ? (
                <MainGenerator auth={auth} onLogout={handleLogout} />
            ) : (
                <LoginComponent onLogin={handleLogin} />
            )}
        </div>
    );
};

export default App;
