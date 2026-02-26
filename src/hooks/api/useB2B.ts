// src/hooks/api/useB2B.ts
import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { GiftConfig } from '@/types/gift.types';
import { HEADERS } from '@/lib/constants';

export const useB2B = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch all configurations for the authenticated B2B client
     */
    const getConfigs = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const apiKey = typeof window !== 'undefined' ? localStorage.getItem('b2b-api-key') : null;

            if (!apiKey || apiKey.length < 32) {
                const msg = 'Missing or invalid B2B API Key. Please configure it in Local Storage or contact Admin.';
                setError(msg);
                throw new Error(msg);
            }

            const response = await apiClient.get<{ configs: GiftConfig[] }>('/client/config', {
                headers: {
                    [HEADERS.API_KEY]: apiKey,
                }
            });
            return response.data.configs;
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } }, message?: string };
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch configurations';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Create a new Gift Configuration
     */
    const createConfig = useCallback(async (configData: {
        giftId: number;
        name: string;
        entryPrice: number;
        targetRtpPercent: number;
        probabilityTable: Array<{ multiplier: number; probability: number }>;
    }) => {
        setIsLoading(true);
        setError(null);
        try {
            const apiKey = typeof window !== 'undefined' ? localStorage.getItem('b2b-api-key') : null;

            if (!apiKey || apiKey.length < 32) {
                const msg = 'Missing or invalid B2B API Key. Please configure it in Local Storage or contact Admin.';
                setError(msg);
                throw new Error(msg);
            }

            const response = await apiClient.post<{ config: GiftConfig }>('/client/config', configData, {
                headers: {
                    [HEADERS.API_KEY]: apiKey,
                }
            });
            return response.data.config;
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } }, message?: string };
            const errorMessage = error.response?.data?.error || error.message || 'Failed to create configuration';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Delete a specific Gift Configuration by ID
     */
    const deleteConfig = useCallback(async (giftId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const apiKey = typeof window !== 'undefined' ? localStorage.getItem('b2b-api-key') : null;

            if (!apiKey || apiKey.length < 32) {
                const msg = 'Missing or invalid B2B API Key. Please configure it in Local Storage or contact Admin.';
                setError(msg);
                throw new Error(msg);
            }

            // Assuming backend uses the actual numerical ID for the DELETE route param
            const response = await apiClient.delete<{ message: string }>(`/client/config/${giftId}`, {
                headers: {
                    [HEADERS.API_KEY]: apiKey,
                }
            });
            return response.data.message;
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } }, message?: string };
            const errorMessage = error.response?.data?.error || error.message || 'Failed to delete configuration';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        getConfigs,
        createConfig,
        deleteConfig,
        isLoading,
        error,
    };
};
