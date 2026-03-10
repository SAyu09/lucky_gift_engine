// src/types/api.types.ts

// Standard JSON response wrapper returned by backend Express controllers
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}
