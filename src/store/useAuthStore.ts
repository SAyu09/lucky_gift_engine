// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Role } from '@/types/auth.types';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';

interface AuthState {
    user: User | null;
    token: string | null;
    role: Role | null;
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
            isAuthenticated: false,

            login: (user: User, token: string) => {
                // Ensure localStorage syncs in case it wasn't already handled
                if (typeof window !== 'undefined') {
                    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);
                }
                set({
                    user,
                    token,
                    role: user.role,
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
                    isAuthenticated: false,
                });
            },

            setUser: (user: User) => {
                set({
                    user,
                    role: user.role,
                    // We don't change `isAuthenticated` or `token` here 
                    // to prevent accidentally logging out if a simple user update happens
                });
            },
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                role: state.role,
                isAuthenticated: state.isAuthenticated
            }), // Persist these fields
        }
    )
);
