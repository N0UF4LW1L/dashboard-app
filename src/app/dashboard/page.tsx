'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/login');
            return;
        }
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch {
                // ignore
            }
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        document.cookie = 'access_token=; path=/; max-age=0';
        router.push('/login');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0f',
            color: '#fff',
            fontFamily: 'var(--font-geist-sans), -apple-system, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
        }}>
            <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: '40px 48px',
                textAlign: 'center',
                maxWidth: '480px',
                width: '100%',
            }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
                    Login Berhasil!
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 24px', fontSize: '15px' }}>
                    Selamat datang kembali,{' '}
                    <strong style={{ color: '#a78bfa' }}>{user?.name || 'Admin'}</strong>
                </p>
                <div style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '24px',
                    textAlign: 'left',
                }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Info Akun</div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>📧 {user?.email}</div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>🔑 Role: {user?.role}</div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '10px',
                        padding: '10px 24px',
                        color: '#fca5a5',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        fontFamily: 'inherit',
                        transition: 'all 0.2s',
                    }}
                >
                    Logout
                </button>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>
                Dashboard lengkap akan segera hadir 🚀
            </p>
        </div>
    );
}
