'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

/** Get semua customers */
export const useGetCustomers = () => {
    return useQuery({
        queryKey: ['customers'],
        queryFn: async () => {
            const { data } = await apiClient.get('/customers');
            return (data?.items || data?.data || data || []) as any[];
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
    });
};

/** Hitung jumlah customers */
export const useCustomersStatusCount = () => {
    return useQuery({
        queryKey: ['customers', 'status-count'],
        queryFn: async () => {
            const { data } = await apiClient.get('/customers');
            const customers = (data?.items || data?.data || data || []) as any[];
            return {
                data: [
                    { status: 'Total', count: customers.length },
                ],
            };
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
    });
};
