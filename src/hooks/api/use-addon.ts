'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface Addon {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    createdAt: string;
    updatedAt: string;
}

export const useGetAddons = () => {
    return useQuery<Addon[]>({
        queryKey: ['addons'],
        queryFn: async () => {
            const { data } = await apiClient.get('/addons');
            return data;
        },
    });
};

export const useGetAddonById = (id: string) => {
    return useQuery<Addon>({
        queryKey: ['addons', id],
        queryFn: async () => {
            if (!id) throw new Error('Addon ID is required');
            const { data } = await apiClient.get(`/addons/${id}`);
            return data;
        },
        enabled: !!id,
    });
};
