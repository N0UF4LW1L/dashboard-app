'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface CreateReimbursePayload {
    employeeName: string;
    employeeRole: string;
    amount: number;
    bankName: string;
    accountNumber: string;
    vehicleId?: string;
    expenseDate: string;
    expenseSource: string;
    description: string;
    receiptUrl?: string;
    status?: string;
}

export interface UpdateReimbursePayload extends Partial<CreateReimbursePayload> { }

export const useCreateReimburse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateReimbursePayload) => {
            const { data } = await apiClient.post('/reimburses', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reimburses'] });
        },
    });
};

export const useUpdateReimburse = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: UpdateReimbursePayload) => {
            const { data } = await apiClient.patch(`/reimburses/${id}`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reimburses'] });
        },
    });
};

export const useDeleteReimburse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/reimburses/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reimburses'] });
        },
    });
};

export const useUploadReceipt = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (receiptUrl: string) => {
            const { data } = await apiClient.patch(`/reimburses/${id}/receipt`, { receiptUrl });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reimburses'] });
        },
    });
};
