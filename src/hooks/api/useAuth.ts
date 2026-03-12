// src/hooks/api/useAuth.ts
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import {
    LoginResponse,
    RegisterResponse,
    MeResponse,
    LogoutResponse,
    User,
    Role,
} from '@/types/auth.types';
import { ROLE_ROUTES } from '@/lib/constants';

/**
 * Auth hook — wraps all authentication API calls.
 * Keeps business logic (routing, store updates) in one place.
 */
export const useAuth = () => {
    const router = useRouter();
    const { login: storeLogin, logout: storeLogout, setUser } = useAuthStore();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ─── Helper: parse backend error message ─────────────────────────────────
    const parseError = (err: unknown, fallback: string): string => {
        const e = err as { response?: { data?: { message?: string; error?: string } }; message?: string };
        return (
            e.response?.data?.message ||
            e.response?.data?.error ||
            e.message ||
            fallback
        );
    };

    // ─── Login ────────────────────────────────────────────────────────────────
    /**
     * POST /api/auth/login
     * Backend returns: { success, message, data: { token, user: { id, email, role, name, createdAt, clientCredentials } } }
     */
    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<LoginResponse>('/auth/login', {
                email,
                password,
            });

            const { user: rawUser, token } = response.data.data;

            // Map backend user shape to full frontend User type
            const user: User = {
                id: rawUser.id,
                email: rawUser.email,
                role: rawUser.role,
                name: rawUser.name ?? null,
                createdAt: rawUser.createdAt ?? new Date().toISOString(),
                paymentStatus: rawUser.paymentStatus,
                walletBalance: rawUser.walletBalance,
                
                // 🟢 NEW: Capture Escrow Profit from the backend
                unsettledProfit: (rawUser as any).unsettledProfit, 
                
                clientCredentials: rawUser.clientCredentials,
            };

            storeLogin(user, token);

            // B2B_CLIENTs need to set up their API keys before seeing the dashboard.
            let destination: string;
            if (user.role === Role.B2B_CLIENT) {
                const hasApiKey = user.clientCredentials?.hasTestApiKey || user.clientCredentials?.hasLiveApiKey;
                destination = hasApiKey ? ROLE_ROUTES[Role.B2B_CLIENT] : '/b2b/api-keys';
            } else {
                destination = (ROLE_ROUTES as any)[user.role] ?? '/';
            }
            router.push(destination);

            return response.data;
        } catch (err) {
            const message = parseError(err, 'Login failed. Invalid credentials.');
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, [router, storeLogin]);

    // ─── Register ─────────────────────────────────────────────────────────────
    /**
     * POST /api/auth/register
     */
    const register = useCallback(async (
        email: string,
        password: string,
        name?: string,
        role: Role = Role.USER
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<RegisterResponse>('/auth/register', {
                email,
                password,
                name,
                role,
            });

            // Always redirect to /login so the user can start an authenticated session.
            router.push('/login');

            return response.data;
        } catch (err) {
            const message = parseError(err, 'Registration failed.');
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    // ─── Logout ───────────────────────────────────────────────────────────────
    /**
     * POST /api/auth/logout (protected — requires Bearer token)
     */
    const logout = useCallback(async () => {
        try {
            await apiClient.post<LogoutResponse>('/auth/logout');
        } catch {
            // Ignore backend failure if token already expired
        } finally {
            storeLogout();
            router.push('/login');
        }
    }, [router, storeLogout]);

    // ─── Get Me ───────────────────────────────────────────────────────────────
    /**
     * GET /api/auth/me (protected — requires Bearer token)
     * Used to refresh user state on page load / hydration.
     */
    const getMe = useCallback(async (): Promise<User> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<MeResponse>('/auth/me');
            const rawUser = response.data.data; // Backend wraps in .data

            const user: User = {
                ...rawUser,
                paymentStatus: rawUser.paymentStatus,
                walletBalance: rawUser.walletBalance,
                
                // 🟢 NEW: Capture Escrow Profit on app hydration/refresh
                unsettledProfit: (rawUser as any).unsettledProfit, 
                
                clientCredentials: rawUser.clientCredentials,
            };

            setUser(user);
            return user;
        } catch (err) {
            const message = parseError(err, 'Failed to fetch user profile.');
            setError(message);

            const e = err as { response?: { status?: number } };
            if (e.response?.status === 401) {
                // Token is stale — force logout
                await logout();
            }
            throw new Error(message);
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