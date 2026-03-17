import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface CreateLainnyaPayload {
    name: string;
    category: string;
    nominal: number;
    date: string;
    description?: string;
}

export interface UpdateLainnyaPayload extends Partial<CreateLainnyaPayload> {}

export const useCreateLainnya = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateLainnyaPayload) => {
            const { data } = await apiClient.post('/rekap-transaksi/lainnya', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lainnya'] });
            queryClient.invalidateQueries({ queryKey: ['rekap-pencatatan'] });
        },
    });
};

export const useUpdateLainnya = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: UpdateLainnyaPayload) => {
            const { data } = await apiClient.patch(`/rekap-transaksi/lainnya/${id}`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lainnya'] });
            queryClient.invalidateQueries({ queryKey: ['rekap-pencatatan'] });
        },
    });
};

export const useDeleteLainnya = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/rekap-transaksi/lainnya/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lainnya'] });
            queryClient.invalidateQueries({ queryKey: ['rekap-pencatatan'] });
        },
    });
};
