'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

/** Get semua inventaris */
export const useGetInventories = (search?: string, startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: ['inventories', search, startDate, endDate],
        queryFn: async () => {
            const params: Record<string, string> = {};
            if (search) params.search = search;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            const { data } = await apiClient.get('/inventories', { params });
            // Handle kedua shape: array (lama) atau {items, meta} (baru)
            if (Array.isArray(data)) return data as any[];
            return (data?.items ?? []) as any[];
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
    });
};

/** Get satu inventory by ID */
export const useGetInventoryById = (id: string) => {
    return useQuery({
        queryKey: ['inventories', id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/inventories/${id}`);
            return data as any;
        },
        enabled:
            typeof window !== 'undefined' &&
            !!localStorage.getItem('access_token') &&
            !!id,
    });
};
