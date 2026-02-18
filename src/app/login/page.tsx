'use client';

import Image from 'next/image';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Crown,
    DollarSign,
    Car,
    ArrowLeft,
    Mail,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    Loader2,
    ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useLogin } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

type RoleKey = 'admin' | 'finance' | 'driver';

interface RoleConfig {
    key: RoleKey;
    label: string;
    description: string;
    Icon: React.ElementType;
}

const roles: RoleConfig[] = [
    {
        key: 'admin',
        label: 'ADMIN',
        description: 'Akses administrasi penuh',
        Icon: Crown,
    },
    {
        key: 'finance',
        label: 'FINANCE',
        description: 'Akses ke fitur keuangan',
        Icon: DollarSign,
    },
    {
        key: 'driver',
        label: 'DRIVER',
        description: 'Akses ke reimburse dan charge customer',
        Icon: Car,
    },
];

export default function LoginPage() {
    const router = useRouter();
    const loginMutation = useLogin();

    const [step, setStep] = useState<'role' | 'form'>('role');
    const [selectedRole, setSelectedRole] = useState<RoleConfig | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem('access_token');
        if (token) router.push('/dashboard');
    }, [router]);

    const handleRoleSelect = (role: RoleConfig) => {
        setSelectedRole(role);
        setStep('form');
    };

    const handleBack = () => {
        setStep('role');
        setSelectedRole(null);
        loginMutation.reset();
        setEmail('');
        setPassword('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate(
            { email, password, role: selectedRole!.key },
            {
                onSuccess: (data) => {
                    document.cookie = `access_token=${data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}`;
                    if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
                    router.push('/dashboard');
                    router.refresh();
                },
            }
        );
    };

    if (!mounted) return null;

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                background: 'linear-gradient(135deg, #dde8f8 0%, #f0f5ff 30%, #ffffff 60%, #e8f0fb 100%)',
            }}
        >
            {/* ── Main content ── */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">

                {/* ── Logo — taruh file logo di public/logo.png ── */}
                <div className="mb-10">
                    <Image
                        src="/logo.png"
                        alt="TransGo Logo"
                        width={160}
                        height={80}
                        priority
                        className="object-contain"
                    />
                </div>

                {/* ── STEP 1: Role Selection ── */}
                {step === 'role' && (
                    <div className="flex w-full max-w-3xl flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-3 duration-300">

                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Selamat Datang di Dashboard Transgo
                            </h1>
                            <p className="mt-2 text-base text-gray-500">
                                Pilih role untuk melanjutkan ke dashboard
                            </p>
                        </div>

                        {/* Grid 3 kolom — 1 baris */}
                        <div className="grid w-full grid-cols-3 gap-5">
                            {roles.map((role) => (
                                <button
                                    key={role.key}
                                    onClick={() => handleRoleSelect(role)}
                                    className={cn(
                                        'group flex flex-col items-center gap-4 rounded-2xl bg-white p-10 text-center',
                                        'border-2 border-blue-200 shadow-sm',
                                        'transition-all duration-200 cursor-pointer',
                                        'hover:-translate-y-1 hover:shadow-md hover:border-blue-400',
                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400'
                                    )}
                                >
                                    {/* Icon circle */}
                                    <div
                                        className="flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105"
                                        style={{ background: '#1a56db' }}
                                    >
                                        <role.Icon className="h-8 w-8 text-white" strokeWidth={1.8} />
                                    </div>

                                    {/* Label */}
                                    <div>
                                        <p
                                            className="text-sm font-extrabold uppercase tracking-wider"
                                            style={{ color: '#1a56db' }}
                                        >
                                            {role.label}
                                        </p>
                                        <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
                                            {role.description}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── STEP 2: Login Form ── */}
                {step === 'form' && selectedRole && (
                    <div className="flex w-full max-w-sm flex-col gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300">

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBack}
                            className="w-fit gap-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Pilih Role Lain
                        </Button>

                        <Card className="border-2 border-blue-200 bg-white shadow-sm">
                            <CardContent className="pt-6 pb-6 flex flex-col gap-5">

                                {/* Role header */}
                                <div className="flex flex-col items-center gap-3 pb-1">
                                    <div
                                        className="flex h-14 w-14 items-center justify-center rounded-full"
                                        style={{ background: '#1a56db' }}
                                    >
                                        <selectedRole.Icon className="h-7 w-7 text-white" strokeWidth={1.8} />
                                    </div>
                                    <div className="text-center">
                                        <p
                                            className="text-sm font-extrabold uppercase tracking-wider"
                                            style={{ color: '#1a56db' }}
                                        >
                                            {selectedRole.label}
                                        </p>
                                        <p className="text-sm text-gray-500">{selectedRole.description}</p>
                                    </div>
                                </div>

                                {/* Error */}
                                {loginMutation.isError && (
                                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600 animate-in fade-in duration-200">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        {loginMutation.error?.message || 'Email atau password salah'}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    {/* Email */}
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                            Email
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder={`${selectedRole.key}@transgo.com`}
                                                required
                                                autoComplete="email"
                                                className="h-10 pl-9 border-gray-300 text-gray-900 focus-visible:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                required
                                                autoComplete="current-password"
                                                className="h-10 pl-9 pr-10 border-gray-300 text-gray-900 focus-visible:ring-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                tabIndex={-1}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <Button
                                        id="login-submit-btn"
                                        type="submit"
                                        disabled={loginMutation.isPending}
                                        className="mt-1 h-10 w-full gap-2 font-semibold text-white disabled:opacity-60"
                                        style={{ background: '#1a56db' }}
                                    >
                                        {loginMutation.isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                Masuk ke Dashboard
                                                <ArrowRight className="h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* ── Footer ── */}
            <div className="border-t border-gray-200 py-4 text-center">
                <p className="text-sm text-gray-400">
                    ©Copyright {new Date().getFullYear()} Powered by Transgo Group
                </p>
            </div>
        </div>
    );
}
