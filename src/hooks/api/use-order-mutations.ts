'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface CreateOrderPayload {
    customerId: string;
    vehicleId: string;
    rentalDays: number;
    startDate: string; // YYYY-MM-DD
    usageArea: string; // 'Dalam Kota' | 'Luar Kota'
    insuranceFee: number;
    pickupFee?: number;
    isWithDriver?: boolean;
    additionalItems?: string;
    paymentStatus?: string; // 'Lunas' | 'Belum Lunas'
}

export interface UpdateOrderPayload {
    customerId?: string;
    vehicleId?: string;
    rentalDays?: number;
    startDate?: string;
    usageArea?: string;
    insuranceFee?: number;
    pickupFee?: number;
    isWithDriver?: boolean;
    additionalItems?: string;
    paymentStatus?: string;
    isReturned?: boolean;
}

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateOrderPayload) => {
            const { data } = await apiClient.post('/orders', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};

export const useUpdateOrder = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: UpdateOrderPayload) => {
            const { data } = await apiClient.patch(`/orders/${id}`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};

export const useDeleteOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/orders/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};
