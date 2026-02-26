// src/lib/constants.ts

import { Role } from '@/types/auth.types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.16:3001/api';

export const ROLES = {
    ADMIN: Role.ADMIN,
    B2B_CLIENT: Role.B2B_CLIENT,
    USER: Role.USER,
};

export const DEFAULT_RTP = 95.0; // Target Return to Player %

export const LOCAL_STORAGE_KEYS = {
    AUTH_TOKEN: 'activeToken',
};

export const HEADERS = {
    INTERNAL_TOKEN: 'x-internal-token',
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'Authorization',
};
