// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Role, PaymentStatus } from '@/types/auth.types';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';

interface AuthState {
    user: User | null;
    token: string | null;
    role: Role | null;
    paymentStatus: PaymentStatus | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            role: null,
            paymentStatus: null,
            isAuthenticated: false,

            login: (user: User, token: string) => {
                // Sync token to localStorage for apiClient interceptor
                if (typeof window !== 'undefined') {
                    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);
                }
                set({
                    user,
                    token,
                    role: user.role,
                    paymentStatus: user.paymentStatus ?? PaymentStatus.PENDING,
                    isAuthenticated: true,
                });
            },

            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
                }
                set({
                    user: null,
                    token: null,
                    role: null,
                    paymentStatus: null,
                    isAuthenticated: false,
                });
            },

            setUser: (user: User) => {
                set({
                    user,
                    role: user.role,
                    paymentStatus: user.paymentStatus ?? PaymentStatus.PENDING,
                });
            },
        }),
        {
            name: LOCAL_STORAGE_KEYS.AUTH_STORAGE,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                role: state.role,
                paymentStatus: state.paymentStatus,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
