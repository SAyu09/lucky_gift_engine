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

// ─── Request Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window === 'undefined') return config; // SSR guard

        // 1. Bearer Token — for USER-authenticated routes (JWT)
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
            config.headers[HEADERS.AUTHORIZATION] = `Bearer ${token}`;
        }

        // 🟢 REMOVED B2B API Key injection here. 
        // Dashboard uses JWT (hybridAuth handles this on backend). 
        // API Keys are strictly for external B2B server-to-server calls.

        // 2. Admin Internal Token — injected only when X-Role-Context: ADMIN is set
        const adminSecret =
            process.env.NEXT_PUBLIC_INTERNAL_SERVICE_TOKEN ||
            process.env.NEXT_PUBLIC_ADMIN_SECRET;

        if (adminSecret && config.headers['X-Role-Context'] === 'ADMIN') {
            config.headers[HEADERS.INTERNAL_TOKEN] = adminSecret;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && typeof window !== 'undefined') {
            const status = error.response.status;
            const toastStore = useToastStore.getState();

            switch (status) {
                case 401:
                    // Session expired or invalid — clear storage and redirect to login
                    if (window.location.pathname !== '/login') {
                        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
                        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_STORAGE);
                        toastStore.addToast(
                            'Session expired. Please log in again.',
                            'error'
                        );
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 800);
                    }
                    break;

                case 403:
                    // Forbidden — show access denied, but do not redirect
                    toastStore.addToast(
                        'Access denied. You do not have permission for this action.',
                        'error'
                    );
                    break;

                case 402:
                    // Payment Required — API request balance exhausted
                    toastStore.addToast(
                        'API quota exhausted. Please purchase a new plan to continue.',
                        'error'
                    );
                    if (window.location.pathname !== '/b2b/billing') {
                        setTimeout(() => {
                            window.location.href = '/b2b/billing';
                        }, 1200);
                    }
                    break;

                default:
                    break;
            }
        }

        return Promise.reject(error);
    }
);