import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const useGetOrderanSewa = (params?: any, options?: any) => {
    return useQuery({
        queryKey: ['orderan-sewa', params],
        queryFn: async () => {
            const { data } = await apiClient.get('/rekap-transaksi/orderan-sewa', { params });
            return data;
        },
        ...options,
    });
};

export const useGetOrderanSewaById = (id: string) => {
    return useQuery({
        queryKey: ['orderan-sewa', id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/rekap-transaksi/orderan-sewa/${id}`);
            return data;
        },
        enabled: !!id,
    });
};

export const useGetReimburse = (params?: any, options?: any) => {
    return useQuery({
        queryKey: ['reimburse-rekap', params],
        queryFn: async () => {
            const { data } = await apiClient.get('/rekap-transaksi/reimburse', { params });
            return data;
        },
        ...options,
    });
};

export const useGetReimburseById = (id: string) => {
    return useQuery({
        queryKey: ['reimburse-rekap', id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/rekap-transaksi/reimburse/${id}`);
            return data;
        },
        enabled: !!id,
    });
};

export const useGetInventaris = (params?: any, options?: any) => {
    return useQuery({
        queryKey: ['inventaris-rekap', params],
        queryFn: async () => {
            const { data } = await apiClient.get('/inventories', {
                params: {
                    search: params?.q || params?.search,
                    startDate: params?.startDate,
                    endDate: params?.endDate,
                    limit: params?.limit,
                    page: params?.page,
                    status: 'verified',
                },
            });
            return data;
        },
        ...options,
    });
};

export const useGetInventarisById = (id: string) => {
    return useQuery({
        queryKey: ['inventaris-rekap', id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/inventories/${id}`);
            return data;
        },
        enabled: !!id,
    });
};

export const useGetLainnya = (params?: any, options?: any) => {
    return useQuery({
        queryKey: ['lainnya', params],
        queryFn: async () => {
            const { data } = await apiClient.get('/rekap-transaksi/lainnya', { params });
            return data;
        },
        ...options,
    });
};

export const useGetLainnyaById = (id: string) => {
    return useQuery({
        queryKey: ['lainnya', id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/rekap-transaksi/lainnya/${id}`);
            return data;
        },
        enabled: !!id,
    });
};

export const useGetOrderanProduk = (params?: any, options?: any) => {
    return useQuery({
        queryKey: ['orderan-produk', params],
        queryFn: async () => {
            const { data } = await apiClient.get('/rekap-transaksi/produk', { params });
            return data;
        },
        ...options,
    });
};

export const useGetCharge = (params?: any, options?: any) => {
    return useQuery({
        queryKey: ['charge', params],
        queryFn: async () => {
            const { data } = await apiClient.get('/order-penalties', { params });
            return data;
        },
        ...options,
    });
};
