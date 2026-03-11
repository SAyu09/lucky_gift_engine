// src/hooks/api/useB2B.ts
import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';
import {
    ActivePoolResponse,
} from '@/types/gift.types';
import { PoolAnalyticsResponse } from '@/types/admin.types';

/**
 * B2B hook — wraps all B2B Client API calls.
 */
export const useB2B = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const parseError = useCallback((err: unknown, fallback: string): string => {
        const e = err as { response?: { data?: { message?: string; error?: string } }; message?: string };
        return e.response?.data?.message || e.response?.data?.error || e.message || fallback;
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

    // ─── Initiate Stripe Payment ─────────────────────────────────────────────
    // 🟢 FIXED: Accept amount, call /payments/recharge, and map correct data payload
    const initiatePayment = useCallback(async (amount: number = 10): Promise<{ checkoutUrl: string; sessionId: string }> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<{ success: boolean; data: { checkoutUrl: string; sessionId: string } }>('/payments/recharge', { amount });
            return response.data.data; // 🟢 Extract nested data
        } catch (err) {
            const message = parseError(err, 'Failed to initiate payment. Please try again.');
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getTransactions = useCallback(async (filters?: any): Promise<any> => {
        setIsLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams.append(key, String(value));
                    }
                });
            }
            const queryString = queryParams.toString();
            const url = `/client/transactions${queryString ? `?${queryString}` : ''}`;
            const response = await apiClient.get<{ success: boolean; data: any; pagination: any }>(url);
            return response.data;
        } catch (err) {
            const message = parseError(err, 'Failed to fetch transactions');
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, [parseError]);

    return {
        getAnalytics,
        updateWebhook,
        getActivePool,
        initiatePayment,
        getTransactions,
        isLoading,
        error,
    };
};