'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface Inventory {
    id: string;
    assetName: string;
    quantity: number;
    unitPrice: number;
    purchaseDate: string;
    status: 'pending' | 'verified';
    createdAt: string;
    updatedAt: string;
}

export interface CreateInventoryPayload {
    assetName: string;
    quantity: number;
    unitPrice: number;
    purchaseDate: string;
    status?: 'pending' | 'verified';
}

export interface UpdateInventoryPayload {
    assetName?: string;
    quantity?: number;
    unitPrice?: number;
    purchaseDate?: string;
    status?: 'pending' | 'verified';
}

/** Tambah inventaris baru */
export const useCreateInventory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateInventoryPayload) => {
            const { data } = await apiClient.post('/inventories', payload);
            return data as Inventory;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventories'] });
        },
    });
};

/** Update inventaris */
export const useUpdateInventory = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: UpdateInventoryPayload) => {
            const { data } = await apiClient.patch(`/inventories/${id}`, payload);
            return data as Inventory;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventories'] });
            queryClient.invalidateQueries({ queryKey: ['inventories', id] });
        },
    });
};

/** Hapus inventaris */
export const useDeleteInventory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/inventories/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventories'] });
        },
    });
};
