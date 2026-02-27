'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

/** Get semua vehicles */
export const useGetVehicles = () => {
    return useQuery({
        queryKey: ['vehicles'],
        queryFn: async () => {
            const { data } = await apiClient.get('/vehicles');
            return data as any[];
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
    });
};

/** Hitung status vehicles */
export const useVehiclesStatusCount = () => {
    return useQuery({
        queryKey: ['vehicles', 'status-count'],
        queryFn: async () => {
            const { data } = await apiClient.get('/vehicles');
            const vehicles = data as any[];
            const available = vehicles.filter((v) => v.isAvailable).length;
            const unavailable = vehicles.filter((v) => !v.isAvailable).length;
            return {
                data: [
                    { status: 'Tersedia', count: available },
                    { status: 'Tidak Tersedia', count: unavailable },
                    { status: 'Total', count: vehicles.length },
                ],
            };
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
    });
};
