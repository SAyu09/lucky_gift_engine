// src/types/auth.types.ts

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
    B2B_CLIENT = 'B2B_CLIENT',
}

export enum PaymentStatus {
    UNPAID = 'UNPAID',
    PAID = 'PAID',
    PENDING = 'PENDING',
}

export interface ClientCredentials {
    hasTestApiKey: boolean;
    hasLiveApiKey: boolean;
}

export interface User {
    id: number;
    email: string;
    role: Role;
    name: string | null;
    createdAt: string;
    
    // B2B specific fields (nullable/optional for standard users & admins)
    paymentStatus?: PaymentStatus;
    walletBalance?: number;
    
    // 🟢 NEW: Added to fix the TypeScript error in useAuth.ts
    unsettledProfit?: number; 
    
    clientCredentials?: ClientCredentials;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    setUser: (user: User) => void;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: User;
    };
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
        userId: number;
    };
}

export interface MeResponse {
    success: boolean;
    message: string;
    data: User;
}

export interface LogoutResponse {
    success: boolean;
    message: string;
}