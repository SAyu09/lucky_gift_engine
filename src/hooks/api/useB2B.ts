// src/hooks/api/useB2B.ts
import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';
import {
    GiftConfig,
    CreateConfigResponse,
    ListConfigsResponse,
    GetConfigResponse,
    ActivePoolResponse,
    PoolStatusResponse,
} from '@/types/gift.types';
import { PoolAnalyticsResponse } from '@/types/admin.types';
import { PoolResetResponse } from '@/types/admin.types';

/**
 * B2B hook — wraps all B2B Client API calls.
 */
export const useB2B = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const parseError = (err: unknown, fallback: string): string => {
        const e = err as { response?: { data?: { message?: string; error?: string } }; message?: string };
        return e.response?.data?.message || e.response?.data?.error || e.message || fallback;
    };

    const getConfigs = useCallback(async (): Promise<GiftConfig[]> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<ListConfigsResponse>('/client/config');
            return response.data.configs;
        } catch (err) {
            const message = parseError(err, 'Failed to fetch configurations');
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getConfig = useCallback(async (giftId: number): Promise<GiftConfig> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<GetConfigResponse>(`/client/config/${giftId}`);
            return response.data.config;
        } catch (err) {
            const message = parseError(err, `Failed to fetch config for gift ${giftId}`);
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createConfig = useCallback(async (data: {
        giftId: number;
        name: string;
        entryPrice: number;
        targetRtpPercent?: number;
        probabilityTable?: Array<{ multiplier: number; probability: number }>;
    }): Promise<GiftConfig> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<CreateConfigResponse>('/client/config', data);
            return response.data.config;
        } catch (err) {
            const message = parseError(err, 'Failed to create configuration');
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateConfig = useCallback(async (
        giftId: number,
        data: Partial<Pick<GiftConfig, 'name' | 'entryPrice' | 'targetRtpPercent' | 'probabilityTable' | 'isActive'>>
    ): Promise<GiftConfig> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.put<{ success: boolean; config: GiftConfig }>(
                `/client/config/${giftId}`,
                data
            );
            return response.data.config;
        } catch (err) {
            const message = parseError(err, `Failed to update config for gift ${giftId}`);
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteConfig = useCallback(async (giftId: number): Promise<string> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.delete<{ success: boolean; message: string }>(
                `/client/config/${giftId}`
            );
            return response.data.message;
        } catch (err) {
            const message = parseError(err, `Failed to delete config for gift ${giftId}`);
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getAnalytics = useCallback(async (): Promise<PoolAnalyticsResponse['data']> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<PoolAnalyticsResponse>('/client/analytics');
            return response.data.data;
        } catch (err) {
            const message = parseError(err, 'Failed to fetch analytics');
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 🟢 FIXED: Accepts environment mode and returns full response to expose webhookSecret
    const updateWebhook = useCallback(async (webhookUrl: string, mode: 'test' | 'live'): Promise<any> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.put(
                '/client/profile/webhook',
                { webhookUrl, mode }
            );
            return response.data;
        } catch (err) {
            const message = parseError(err, 'Failed to update webhook URL');
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getActivePool = useCallback(async (giftId: number): Promise<ActivePoolResponse | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<ActivePoolResponse>(
                `/client/pool/active/${giftId}`
            );
            return response.data;
        } catch (err) {
            const e = err as { response?: { status?: number } };
            if (e.response?.status === 404) {
                return null;
            }
            const message = parseError(err, `Failed to fetch active pool for gift ${giftId}`);
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const resetPool = useCallback(async (clientId: number, giftId?: number): Promise<PoolResetResponse> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<PoolResetResponse>(
                `/client/clients/${clientId}/reset-pools`,
                giftId !== undefined ? { giftId } : {}
            );
            return response.data;
        } catch (err) {
            const message = parseError(err, 'Failed to reset pool');
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ─── Initiate Stripe Payment ─────────────────────────────────────────────
    const initiatePayment = useCallback(async (): Promise<{ checkoutUrl: string; sessionId: string }> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<any>('/payments/initiate', {});
            return response.data;
        } catch (err) {
            const message = parseError(err, 'Failed to initiate payment. Please try again.');
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        getConfigs,
        getConfig,
        createConfig,
        updateConfig,
        deleteConfig,
        getAnalytics,
        updateWebhook,
        getActivePool,
        resetPool,
        initiatePayment,
        isLoading,
        error,
    };
};