import axios from 'axios';

export const apiClient = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: tambahkan JWT token ke setiap request jika ada
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Interceptor: global error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message || 'Terjadi kesalahan sistem';

        // Jika 401 Unauthorized, hapus token dan redirect ke login
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }

        return Promise.reject(new Error(message));
    },
);