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
            let token = localStorage.getItem('access_token');
            if (!token) {
                // Fallback cek cookie
                const match = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
                if (match) {
                    token = match[1];
                    localStorage.setItem('access_token', token); // Sync ke localStorage
                }
            }
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
        // Jika 401 Unauthorized, hapus token dan redirect ke login
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            window.location.href = '/auth';
        }

        // Tetap reject dengan error asli agar onError handler bisa baca response.data
        // Tapi pastikan error.message berisi pesan yang informatif
        const message =
            error.response?.data?.message ||
            error.message ||
            'Terjadi kesalahan sistem';

        error.message = Array.isArray(message) ? message.join(', ') : message;
        return Promise.reject(error);
    },
);