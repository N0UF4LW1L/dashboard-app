'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface Customer {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCustomerPayload {
    name: string;
    phoneNumber: string;
    email: string;
}

export interface UpdateCustomerPayload {
    name?: string;
    phoneNumber?: string;
    email?: string;
}

/** Tambah customer baru */
export const useCreateCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateCustomerPayload) => {
            const { data } = await apiClient.post('/customers', payload);
            return data as Customer;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
    });
};

/** Update customer */
export const useUpdateCustomer = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: UpdateCustomerPayload) => {
            const { data } = await apiClient.patch(`/customers/${id}`, payload);
            return data as Customer;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
    });
};

/** Hapus customer */
export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/customers/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
    });
};
