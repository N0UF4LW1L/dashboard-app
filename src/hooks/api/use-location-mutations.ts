'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface Location {
    id: string;
    name: string;
    address: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLocationPayload {
    name: string;
    address: string;
}

export interface UpdateLocationPayload {
    name?: string;
    address?: string;
}

/** Tambah lokasi baru */
export const useCreateLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateLocationPayload) => {
            const { data } = await apiClient.post('/locations', payload);
            return data as Location;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
    });
};

/** Update lokasi */
export const useUpdateLocation = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: UpdateLocationPayload) => {
            const { data } = await apiClient.patch(`/locations/${id}`, payload);
            return data as Location;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            queryClient.invalidateQueries({ queryKey: ['locations', id] });
        },
    });
};

/** Hapus lokasi */
export const useDeleteLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/locations/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
    });
};
