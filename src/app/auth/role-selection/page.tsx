'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Crown, DollarSign, Car } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RoleConfig {
    key: 'admin' | 'finance' | 'driver';
    label: string;
    description: string;
    Icon: React.ElementType;
    bgColor: string;
    borderColor: string;
}

const roles: RoleConfig[] = [
    {
        key: 'admin',
        label: 'ADMIN',
        description: 'Akses administrasi penuh',
        Icon: Crown,
        bgColor: 'bg-gradient-to-br from-blue-600 to-blue-800',
        borderColor: 'border-blue-300',
    },
    {
        key: 'finance',
        label: 'FINANCE',
        description: 'Akses ke fitur keuangan',
        Icon: DollarSign,
        bgColor: 'bg-gradient-to-br from-blue-400 to-blue-600',
        borderColor: 'border-blue-300',
    },
    {
        key: 'driver',
        label: 'DRIVER',
        description: 'Akses ke reimburse dan charge customer',
        Icon: Car,
        bgColor: 'bg-gradient-to-br from-blue-500 to-blue-700',
        borderColor: 'border-blue-300',
    },
];

export default function RoleSelectionPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem('access_token');
        if (token) {
            // Sync cookie dari localStorage jika cookie hilang (cegah middleware loop)
            document.cookie = `access_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
            router.push('/dashboard');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Hanya jalan sekali saat mount — jangan taruh router di sini!

    const handleRoleSelect = (role: RoleConfig) => {
        router.push(`/auth/login?role=${role.key}`);
    };

    if (!mounted) return null;

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 h-screen overflow-hidden px-4 relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-32 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-bounce"></div>
                <div className="absolute bottom-32 left-32 w-40 h-40 bg-blue-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 right-20 w-28 h-28 bg-blue-200 rounded-full opacity-30 animate-bounce delay-500"></div>
            </div>

            <div className="w-full max-w-4xl mx-auto relative z-10 flex flex-col items-center justify-center h-full gap-6">
                {/* Logo */}
                <div className="text-center" style={{ animation: 'fade-in 0.8s ease-out' }}>
                    <Image
                        src="/logo/image 3.svg"
                        alt="TransGo Logo"
                        width={220}
                        height={110}
                        priority
                        className="mx-auto object-contain drop-shadow-md"
                    />
                </div>

                {/* Welcome Text */}
                <div className="text-center" style={{ animation: 'fade-in-delay 0.8s ease-out 0.3s both' }}>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        Selamat Datang di Dashboard Transgo
                    </h1>
                    <p className="text-lg text-gray-600">
                        Pilih role untuk melanjutkan ke dashboard
                    </p>
                </div>

                {/* Role Cards — 3 kolom */}
                <div className="grid grid-cols-3 gap-4 md:gap-6 w-full">
                    {roles.map((role, index) => {
                        const IconComponent = role.Icon;
                        return (
                            <Card
                                key={role.key}
                                className={cn(
                                    'cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2',
                                    role.borderColor,
                                    'border-2 overflow-hidden group'
                                )}
                                style={{ animation: `fade-in-card 0.6s ease-out ${index * 100}ms both` }}
                                onClick={() => handleRoleSelect(role)}
                            >
                                <CardContent className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[140px] md:min-h-[160px] relative bg-white">
                                    {/* Gradient overlay on hover */}
                                    <div className={cn('absolute inset-0', role.bgColor, 'opacity-0 group-hover:opacity-5 transition-opacity duration-300')}></div>

                                    {/* Icon */}
                                    <div className={cn('w-12 h-12 md:w-16 md:h-16 rounded-full', role.bgColor, 'flex items-center justify-center mb-2 md:mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110')}>
                                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white transition-transform duration-300" />
                                    </div>

                                    {/* Role name */}
                                    <h3 className="font-bold text-sm md:text-lg uppercase text-blue-600 group-hover:text-blue-700 transition-colors duration-300 mb-1 text-center">
                                        {role.label}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-xs text-gray-600 text-center leading-tight group-hover:text-gray-700 transition-colors duration-300">
                                        {role.description}
                                    </p>

                                    {/* Bottom bar indicator */}
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Copyright */}
                <div className="text-center pt-4 border-t border-gray-200 w-full">
                    <p className="text-sm text-gray-500">
                        ©Copyright 2025 Powered by Transgo Group
                    </p>
                </div>
            </div>
        </div>
    );
}
