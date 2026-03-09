// src/types/auth.types.ts

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
    B2B_CLIENT = 'B2B_CLIENT',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
}

// 🟢 NEW: Interface for segregated B2B credentials
export interface ClientCredentials {
    testWebhookUrl: string | null;
    testWebhookSecret: string | null;
    liveWebhookUrl: string | null;
    liveWebhookSecret: string | null;
    hasTestApiKey: boolean;
    hasLiveApiKey: boolean;
    // 🟢 NEW: Decrypted keys sent from the backend /me route
    testApiKey?: string | null; 
    liveApiKey?: string | null; 
}

// Matches backend Prisma User model shape
export interface User {
    id: number;
    email: string;
    name: string | null;
    profileImage?: string | null;
    role: Role;
    paymentStatus?: PaymentStatus;
    clientCredentials?: ClientCredentials; 
    createdAt: string;
    updatedAt?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

// Matches backend: POST /api/auth/login → { success, message, data: { token, user } }
export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: {
            id: number;
            email: string;
            role: Role;
            name?: string | null;
            paymentStatus?: PaymentStatus;
            clientCredentials?: ClientCredentials; 
            createdAt?: string;
        };
    };
}

// Matches backend: POST /api/auth/register → { success, message, data: { id, email, name, role, createdAt } }
export interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
        id: number;
        email: string;
        role: Role;
        name?: string | null;
        createdAt?: string;
    };
}

// Matches backend: GET /api/auth/me → { success, data: User }
export interface MeResponse {
    success: boolean;
    data: User;
}

// Matches backend: POST /api/auth/logout → { success, message }
export interface LogoutResponse {
    success: boolean;
    message: string;
}