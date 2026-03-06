'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const useGetReimburses = () => {
    return useQuery({
        queryKey: ['reimburses'],
        queryFn: async () => {
            const { data } = await apiClient.get('/reimburses');
            return data as any[];
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
    });
};

export const useGetReimburseById = (id: string) => {
    return useQuery({
        queryKey: ['reimburses', id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/reimburses/${id}`);
            return data as any;
        },
        enabled:
            typeof window !== 'undefined' &&
            !!localStorage.getItem('access_token') &&
            !!id,
    });
};
