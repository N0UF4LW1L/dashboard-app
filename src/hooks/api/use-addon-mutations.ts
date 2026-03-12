'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface CreateAddonPayload {
    name: string;
    category: string;
    price: number;
    stock: number;
}

export interface UpdateAddonPayload {
    name?: string;
    category?: string;
    price?: number;
    stock?: number;
}

export const useCreateAddon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateAddonPayload) => {
            const { data } = await apiClient.post('/addons', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addons'] });
        },
    });
};

export const useUpdateAddon = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: UpdateAddonPayload) => {
            const { data } = await apiClient.patch(`/addons/${id}`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addons'] });
            queryClient.invalidateQueries({ queryKey: ['addons', id] });
        },
    });
};

export const useDeleteAddon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/addons/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addons'] });
        },
    });
};
