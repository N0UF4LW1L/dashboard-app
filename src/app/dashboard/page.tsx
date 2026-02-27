'use client';

import CustomerStatusCard from '@/components/customer-status-card';
import OrderStatusCard from '@/components/order-status-card';
import VehicleStatusCard from '@/components/vehicle-status-card';
import Welcome from '@/components/welcome-text';
import { useUser } from '@/context/user-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
    const { user, setUser } = useUser();
    const router = useRouter();

    useEffect(() => {
        // Sync user dari localStorage jika context kosong
        const stored = localStorage.getItem('user');
        if (stored && !user) {
            try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
        }
        // Guard: jika tidak ada token, redirect ke login
        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/auth');
        }
    }, [user, setUser, router]);

    return (
        <>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <Welcome />
                </div>

                {user?.role !== 'driver' && (
                    <>
                        {(user?.role === 'admin') && (
                            <>
                                <h3 className="text-xl font-semibold">Order</h3>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <OrderStatusCard />
                                </div>

                                <h3 className="text-xl font-semibold">Kendaraan</h3>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <VehicleStatusCard />
                                </div>

                                <h3 className="text-xl font-semibold">Customer</h3>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <CustomerStatusCard />
                                </div>
                            </>
                        )}
                    </>
                )}

                {user?.role === 'finance' && (
                    <>
                        <h3 className="text-xl font-semibold">Order</h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <OrderStatusCard />
                        </div>
                    </>
                )}

                {user?.role === 'driver' && (
                    <>
                        <p className="text-muted-foreground">
                            Selamat datang, Driver. Gunakan menu di sebelah kiri untuk navigasi.
                        </p>
                    </>
                )}
            </div>
        </>
    );
}
