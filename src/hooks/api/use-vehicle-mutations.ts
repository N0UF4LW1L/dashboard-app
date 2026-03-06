'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface Vehicle {
    id: string;
    name: string;
    rentalPrice: number;
    type: string;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateVehiclePayload {
    name: string;
    rentalPrice: number;
    type: string;
}

export interface UpdateVehiclePayload {
    name?: string;
    rentalPrice?: number;
    type?: string;
    isAvailable?: boolean;
}

/** Tambah kendaraan baru */
export const useCreateVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateVehiclePayload) => {
            const { data } = await apiClient.post('/vehicles', payload);
            return data as Vehicle;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
};

/** Update kendaraan */
export const useUpdateVehicle = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: UpdateVehiclePayload) => {
            const { data } = await apiClient.patch(`/vehicles/${id}`, payload);
            return data as Vehicle;
        },
        onSuccess: () => {
            // Invalidate list dan detail agar keduanya fresh
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
            queryClient.invalidateQueries({ queryKey: ['vehicles', id] });
        },
    });
};

/** Hapus kendaraan */
export const useDeleteVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/vehicles/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
};
