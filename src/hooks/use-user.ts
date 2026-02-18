import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const useGetUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            // Endpoint: GET /api/auth/users (Admin only)
            const { data } = await apiClient.get('/auth/users');
            return data;
        },
    });
};
