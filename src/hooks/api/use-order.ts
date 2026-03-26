'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// ===== ORDERS =====

/** Get semua orders */
export const useGetOrders = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const { data } = await apiClient.get('/orders');
            return (data?.items || data?.data || data || []) as any[];
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
    });
};

/** Hitung status orders: { lunas, belumLunas, total } */
export const useOrdersStatusCount = () => {
    return useQuery({
        queryKey: ['orders', 'status-count'],
        queryFn: async () => {
            const { data } = await apiClient.get('/orders');
            const orders = (data?.items || data?.data || data || []) as any[];

            const lunas = orders.filter((o) => o.paymentStatus === 'Lunas').length;
            const belumLunas = orders.filter((o) => o.paymentStatus === 'Belum Lunas').length;
            const total = orders.length;

            // Format sesuai referensi: array of count objects
            return {
                data: [
                    { status: 'Belum Lunas', count: belumLunas },
                    { status: 'Lunas', count: lunas },
                    { status: 'Total', count: total },
                ],
            };
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
    });
};
