import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// --- Types ---
export interface LoginPayload {
    email: string;
    password: string;
    role: string;
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
    isActive: boolean;
}

export interface AuthResponse {
    access_token: string;
    user: AuthUser;
}

// --- Hooks ---

/** Login dan simpan token ke localStorage */
export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: LoginPayload) => {
            const { data } = await apiClient.post('/auth/login', payload);
            return data as AuthResponse;
        },
        onSuccess: (data) => {
            localStorage.setItem('access_token', data.access_token);
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
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
        window.location.href = '/auth';
    };
};
