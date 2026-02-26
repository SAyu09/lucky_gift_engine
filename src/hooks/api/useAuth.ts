// src/hooks/api/useAuth.ts
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { LoginResponse, RegisterResponse, User, Role } from '@/types/auth.types';

export const useAuth = () => {
    const router = useRouter();
    const { login: storeLogin, logout: storeLogout, setUser } = useAuthStore();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Login function calling /api/auth/login
     */
    const login = useCallback(async (email: string, passwordHash: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<LoginResponse>('/auth/login', {
                email,
                password: passwordHash, // Backend expects 'password' key
            });

            // Backend wraps the payload in `data`
            const { user, token } = response.data.data;

            // Update global Zustand store (and localStorage via persist)
            // Note: We're mapping the smaller user payload from LoginResponse to the full User type here temporarily
            // Ideally backend returns full User object on login too.
            storeLogin({
                id: user.id,
                email: user.email,
                role: user.role,
                name: null, // Defaulting as it's missing from typical login response short-form
                createdAt: new Date().toISOString(), // Mocking dates to satisfy User type
                updatedAt: new Date().toISOString(),
            }, token);

            // Route based on role
            switch (user.role) {
                case Role.ADMIN:
                    router.push('/admin/global-stats');
                    break;
                case Role.B2B_CLIENT:
                    router.push('/b2b/configurations');
                    break;
                case Role.USER:
                default:
                    router.push('/user/play');
                    break;
            }

            return response.data;
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } }, message?: string };
            const errorMessage = error.response?.data?.error || error.message || 'Login failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [router, storeLogin]);

    /**
     * Register function calling /api/auth/register
     */
    const register = useCallback(async (email: string, passwordHash: string, role: Role = Role.USER) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<RegisterResponse>('/auth/register', {
                email,
                password: passwordHash, // Backend expects 'password' key
                role,
            });

            // Backend wraps payload in `data` for register
            const payload = response.data.data;
            // Register doesn't return a token in our backend
            const user = payload;
            const token = undefined;

            // If the backend auto-logs in and returns the user object and token:
            if (user && token) {
                storeLogin({
                    id: user.id || 'temp-id',
                    email: user.email || email,
                    role: user.role || role,
                    name: null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }, token);

                // Default routing after register usually goes to the specific dashboard for that role
                switch (user.role) {
                    case Role.ADMIN:
                        router.push('/admin/global-stats');
                        break;
                    case Role.B2B_CLIENT:
                        router.push('/b2b/configurations');
                        break;
                    case Role.USER:
                    default:
                        router.push('/user/play');
                        break;
                }
            } else {
                // If the backend just returns a success message (200/201), route to login
                router.push('/login');
            }

            return response.data;
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string, message?: string } }, message?: string };
            const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Registration failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [router, storeLogin]);

    /**
     * Logout function
     * Clears state and redirects to login
     */
    const logout = useCallback(() => {
        storeLogout();
        // Optional: Call theoretical /api/auth/logout on backend if it invalidates tokens server-side
        // apiClient.post('/auth/logout').catch(console.error);

        router.push('/login');
    }, [router, storeLogout]);

    /**
     * Get current user (Me) function calling /api/auth/me
     * Useful for refreshing user state on reload if we want fresh DB state
     */
    const getMe = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<{ user: User }>('/auth/me');
            setUser(response.data.user);
            return response.data.user;
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string }, status?: number }, message?: string };
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch user profile';
            setError(errorMessage);
            // If fetching 'me' fails, token is likely invalid. Logout just in case.
            if (error.response?.status === 401) {
                logout();
            }
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [setUser, logout]);

    return {
        login,
        register,
        logout,
        getMe,
        isLoading,
        error,
    };
};
