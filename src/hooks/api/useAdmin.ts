// src/hooks/api/useAdmin.ts
import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';
import { HEADERS } from '@/lib/constants';

interface CreateClientResponse {
    message: string;
    client: {
        id: string;
        companyName: string;
        webhookUrl: string | null;
    };
    rawApiKey: string;
    webhookSecret: string;
}

export const useAdmin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Create a new B2B Client.
     * Requires X-Internal-Token header for Admin authorization.
     */
    const createClient = useCallback(async (name: string, webhookUrl?: string) => {
        setIsLoading(true);
        setError(null);
        try {
            // In a real production app, the internal secret would securely be passed 
            // from a secure server component or proxy rather than the browser client.
            // For the scope of this frontend architecture, we append it here:
            const internalToken = process.env.NEXT_PUBLIC_INTERNAL_SERVICE_TOKEN || '';

            const payload: { name: string; webhookUrl?: string } = { name };
            if (webhookUrl) {
                payload.webhookUrl = webhookUrl;
            }

            const response = await apiClient.post<CreateClientResponse>(
                '/admin/clients',
                payload,
                {
                    headers: {
                        [HEADERS.INTERNAL_TOKEN]: internalToken,
                        // We pass X-Role-Context just to trigger our apiClient interceptor if needed
                        'X-Role-Context': 'ADMIN'
                    }
                }
            );

            return response.data;
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } }, message?: string };
            const errorMessage = error.response?.data?.error || error.message || 'Failed to create B2B client';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Additional Admin hooks (like getting all users) would go here
    // const getUsers = useCallback(async () => { ... })

    return {
        createClient,
        isLoading,
        error,
    };
};
