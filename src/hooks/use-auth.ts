import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// --- Types ---
export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

// --- Hooks ---

/** Login dan simpan token ke localStorage */
export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: LoginPayload) => {
            const { data } = await apiClient.post('/auth/login', payload);
            return data as { access_token: string };
        },
        onSuccess: (data) => {
            localStorage.setItem('access_token', data.access_token);
            queryClient.invalidateQueries({ queryKey: ['me'] });
        },
    });
};

/** Register user baru */
export const useRegister = () => {
    return useMutation({
        mutationFn: async (payload: RegisterPayload) => {
            const { data } = await apiClient.post('/auth/register', payload);
            return data;
        },
    });
};

/** Ambil profil user yang sedang login */
export const useGetMe = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const { data } = await apiClient.get('/auth/me');
            return data as AuthUser;
        },
        retry: false,
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
    });
};

/** Logout: hapus token */
export const useLogout = () => {
    const queryClient = useQueryClient();

    return () => {
        localStorage.removeItem('access_token');
        queryClient.clear();
        window.location.href = '/login';
    };
};
