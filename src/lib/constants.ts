// src/lib/constants.ts

import { Role } from '@/types/auth.types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const ROLES = {
    ADMIN: Role.ADMIN,
    B2B_CLIENT: Role.B2B_CLIENT,
    USER: Role.USER,
};

export const DEFAULT_RTP = 95.0; // Target Return to Player %

export const LOCAL_STORAGE_KEYS = {
    AUTH_TOKEN: 'activeToken',
    B2B_API_KEY: 'b2b-api-key',    // Centralized key name for B2B API key
    AUTH_STORAGE: 'auth-storage',  // Zustand persist key
};

export const HEADERS = {
    INTERNAL_TOKEN: 'x-internal-token',
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'Authorization',
};

// Routes used for navigation after role-based redirect
export const ROLE_ROUTES = {
    [Role.ADMIN]: '/admin/dashboard',
    [Role.B2B_CLIENT]: '/b2b/configurations',
    [Role.USER]: '/user/play',
} as const;
