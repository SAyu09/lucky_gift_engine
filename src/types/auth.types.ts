// src/types/auth.types.ts

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
    B2B_CLIENT = 'B2B_CLIENT',
}

export interface User {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: {
            id: string;
            email: string;
            role: Role;
            name?: string | null;
            createdAt?: string;
            updatedAt?: string;
        };
    };
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        email: string;
        role: Role;
        name?: string | null;
        createdAt?: string;
        updatedAt?: string;
    };
}
