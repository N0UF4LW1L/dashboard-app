'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import {
    Crown,
    DollarSign,
    Car,
    ArrowLeft,
    Eye,
    EyeOff,
    AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/use-auth';

type RoleKey = 'admin' | 'finance' | 'driver';

interface RoleConfig {
    key: RoleKey;
    label: string;
    description: string;
    Icon: React.ElementType;
}

const ROLES: Record<RoleKey, RoleConfig> = {
    admin: {
        key: 'admin',
        label: 'ADMIN',
        description: 'Administrasi sistem lengkap',
        Icon: Crown,
    },
    finance: {
        key: 'finance',
        label: 'FINANCE',
        description: 'Kelola keuangan dan reimburse',
        Icon: DollarSign,
    },
    driver: {
        key: 'driver',
        label: 'DRIVER',
        description: 'Akses ke fitur reimburse',
        Icon: Car,
    },
};

const DEFAULT_ROUTE: Record<RoleKey, string> = {
    admin: '/dashboard',
    finance: '/dashboard',
    driver: '/dashboard',
};

function LoginFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const loginMutation = useLogin();

    const roleParam = searchParams.get('role') as RoleKey | null;
    const selectedRole = roleParam && ROLES[roleParam] ? ROLES[roleParam] : null;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!roleParam || !ROLES[roleParam]) {
            router.replace('/auth/role-selection');
            return;
        }
        const token = localStorage.getItem('access_token');
        if (token) router.push('/dashboard');
    }, [router, roleParam]);

    const handleBack = () => router.push('/auth/role-selection');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole) return;

        loginMutation.mutate(
            { email, password, role: selectedRole.key },
            {
                onSuccess: (data) => {
                    document.cookie = `access_token=${data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}`;
                    if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
                    router.push(DEFAULT_ROUTE[selectedRole.key]);
                    router.refresh();
                },
            }
        );
    };

    if (!mounted || !selectedRole) return null;

    const IconComponent = selectedRole.Icon;

    return (
        <>
            <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-30 animate-pulse"></div>
                    <div className="absolute top-32 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-40 animate-bounce"></div>
                    <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-100 rounded-full opacity-30 animate-pulse delay-1000"></div>
                    <div className="absolute bottom-32 right-10 w-12 h-12 bg-blue-200 rounded-full opacity-40 animate-bounce delay-500"></div>
                </div>

                {/* ── Left Panel — Blue ── */}
                <div className="w-full md:w-2/5 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex flex-col justify-center items-center relative py-12 md:py-0 overflow-hidden">
                    {/* Back button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="absolute top-6 left-6 text-white hover:bg-blue-700/50 transition-all duration-300 z-10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    {/* Animated background patterns */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full animate-pulse"></div>
                        <div className="absolute top-1/4 -right-8 w-32 h-32 bg-white/5 rounded-full animate-bounce delay-1000"></div>
                        <div className="absolute bottom-1/4 -left-6 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-500"></div>
                        <div className="absolute -bottom-8 right-1/4 w-36 h-36 bg-white/5 rounded-full animate-bounce delay-500"></div>
                    </div>

                    <div className="text-center text-white relative z-10">
                        {/* Role Icon with glow + spinning rings */}
                        <div className="relative mb-6 md:mb-8 flex items-center justify-center">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden" style={{ animation: 'scale-in 0.6s ease-out 0.4s both' }}>
                                <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
                                <IconComponent className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10 drop-shadow-lg" />
                            </div>
                            {/* Decorative rings */}
                            <div className="absolute w-20 h-20 md:w-24 md:h-24 border-2 border-white/20 rounded-full" style={{ animation: 'spin-slow 8s linear infinite' }}></div>
                            <div className="absolute w-16 h-16 md:w-20 md:h-20 border border-white/10 rounded-full" style={{ animation: 'spin-slow-reverse 6s linear infinite' }}></div>
                        </div>

                        {/* Welcome text */}
                        <div className="space-y-2 md:space-y-3">
                            <h2
                                className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg"
                                style={{ animation: 'slide-up 0.6s ease-out' }}
                            >
                                SELAMAT DATANG,
                            </h2>
                            <div className="relative">
                                <h3
                                    className="text-lg md:text-xl font-semibold relative z-10"
                                    style={{ animation: 'slide-up 0.6s ease-out 0.2s both' }}
                                >
                                    {selectedRole.label}
                                </h3>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-white/60" style={{ animation: 'expand-width 1s ease-out 0.8s both', width: '0' }}></div>
                            </div>
                        </div>

                        {/* Role description */}
                        <p
                            className="text-sm md:text-base text-blue-100 mt-4 md:mt-6 max-w-xs mx-auto leading-relaxed"
                            style={{ animation: 'fade-in 0.8s ease-out 0.6s both' }}
                        >
                            {selectedRole.description}
                        </p>
                    </div>
                </div>

                {/* ── Right Panel — White ── */}
                <div className="w-full md:w-3/5 bg-gradient-to-br from-white via-blue-50/30 to-white flex flex-col justify-center items-center p-6 md:p-12 relative">
                    <div className="w-full max-w-md relative z-10">
                        <div className="text-center mb-8" style={{ animation: 'fade-in 0.8s ease-out' }}>
                            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-1">
                                LOGIN KE DASHBOARD
                            </h1>
                            <p className="text-gray-500 text-sm">Masukkan kredensial Anda untuk melanjutkan</p>
                        </div>

                        {/* Error message */}
                        {loginMutation.isError && (
                            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600 mb-4 animate-in fade-in duration-200">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {loginMutation.error?.message || 'Email atau password salah'}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6" style={{ animation: 'slide-up 0.6s ease-out' }}>
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    EMAIL
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:border-blue-300"
                                    placeholder="Masukkan email..."
                                    disabled={loginMutation.isPending}
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    PASSWORD
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:border-blue-300 pr-10"
                                        placeholder="Masukkan password..."
                                        disabled={loginMutation.isPending}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                                        disabled={loginMutation.isPending}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={loginMutation.isPending || !email || !password}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 text-lg font-semibold uppercase transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                {loginMutation.isPending ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Loading...
                                    </div>
                                ) : (
                                    'LOGIN'
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.8); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes spin-slow-reverse {
                    from { transform: rotate(360deg); }
                    to   { transform: rotate(0deg); }
                }
                @keyframes expand-width {
                    from { width: 0; }
                    to   { width: 4rem; }
                }
            `}</style>
        </>
    );
}

export default function LoginFormPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        }>
            <LoginFormContent />
        </Suspense>
    );
}
