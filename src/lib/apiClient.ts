// src/lib/apiClient.ts
import axios from 'axios';
import { API_BASE_URL, LOCAL_STORAGE_KEYS, HEADERS } from './constants';
import { useToastStore } from '@/store/useToastStore';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        // 1. Bearer Token (For USER & overall auth)
        // Avoid accessing localStorage on the server during SSR
        const token = typeof window !== 'undefined'
            ? localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
            : null;

        if (token) {
            config.headers[HEADERS.AUTHORIZATION] = `Bearer ${token}`;
        }

        // 2. Admin internal request handling
        // Safely extract token - falling back appropriately if named differently in env
        const adminSecret = process.env.NEXT_PUBLIC_INTERNAL_SERVICE_TOKEN || process.env.NEXT_PUBLIC_ADMIN_SECRET;

        // Pass 'X-Role-Context' manually in API calls for Admin specific actions
        if (adminSecret && config.headers['X-Role-Context'] === 'ADMIN') {
            config.headers[HEADERS.INTERNAL_TOKEN] = adminSecret;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Global Error Handling
        if (error.response) {
            const status = error.response.status;

            // Catch 401 Unauthorized or 403 Forbidden
            if (status === 401 || status === 403) {
                if (typeof window !== 'undefined') {
                    // Force clearing session state gracefully
                    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
                    localStorage.removeItem('auth-storage'); // Clears zustand standard persist if used

                    // Optionally display a toast immediately if they aren't already on the login page
                    if (window.location.pathname !== '/login') {
                        useToastStore.getState().addToast(
                            status === 403 ? 'Access denied' : 'Session expired. Please log in again.',
                            'error'
                        );

                        // Small delay allows Toast to register visually before full redirect
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 800);
                    }
                }
            }
        }

        return Promise.reject(error);
    }
);
