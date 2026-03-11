'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

/** Get semua locations */
export const useGetLocations = () => {
    return useQuery({
        queryKey: ['locations'],
        queryFn: async () => {
            const { data } = await apiClient.get('/locations');
            return data as any[];
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
    });
};

/** Get satu location by ID */
export const useGetLocationById = (id: string) => {
    return useQuery({
        queryKey: ['locations', id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/locations/${id}`);
            return data as any;
        },
        enabled:
            typeof window !== 'undefined' &&
            !!localStorage.getItem('access_token') &&
            !!id,
    });
};
