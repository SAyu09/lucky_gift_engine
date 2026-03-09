// src/hooks/api/useAdmin.ts
import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';
import { HEADERS } from '@/lib/constants';
import {
    CreateClientResponse,
    CreatePlanResponse,
    SubscribeClientResponse,
    PoolAnalyticsResponse,
    PoolResetResponse,
    PlanType,
} from '@/types/admin.types';

/**
 * Admin hook — wraps all Admin API calls.
 * All admin routes require x-internal-token (injected via X-Role-Context: ADMIN header).
 * NOTE: NEXT_PUBLIC_INTERNAL_SERVICE_TOKEN is browser-visible — acceptable for internal admin panels only.
 */
export const useAdmin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ─── Helper: Admin auth headers ──────────────────────────────────────────
    const adminHeaders = () => ({
        'X-Role-Context': 'ADMIN', // Triggers apiClient interceptor to inject x-internal-token
    });

    // ─── Helper: parse backend error message ─────────────────────────────────
    const parseError = (err: unknown, fallback: string): string => {
        const e = err as { response?: { data?: { message?: string; error?: string } }; message?: string };
        return e.response?.data?.message || e.response?.data?.error || e.message || fallback;
    };

    // ─── Create B2B Client ────────────────────────────────────────────────────
    /**
     * POST /api/admin/clients
     * Backend returns: { success, warning, data: { clientId, name, rawApiKey, webhookSecret, webhookUrl } }
     * WARNING: rawApiKey is shown only ONCE — display it immediately in the UI after creation.
     */
    const createClient = useCallback(async (name: string, webhookUrl?: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const payload: { name: string; webhookUrl?: string } = { name };
            if (webhookUrl) payload.webhookUrl = webhookUrl;

            const response = await apiClient.post<CreateClientResponse>(
                '/admin/clients',
                payload,
                { headers: adminHeaders() }
            );

            // response.data.data contains { clientId, name, rawApiKey, webhookSecret, webhookUrl }
            return response.data;
        } catch (err) {
            const message = parseError(err, 'Failed to create B2B client');
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ─── Create Subscription Plan ─────────────────────────────────────────────
    /**
     * POST /api/admin/subscriptions/plans
     * Body: { name, type ('MONTHLY'|'PAY_AS_YOU_GO'), description?, price, maxGifts?, requestQuota?, features? }
     * Backend returns: { success, data: SubscriptionPlan }
     */
    const createSubscriptionPlan = useCallback(async (data: {
        name: string;
        type: PlanType;
        description?: string;
        price: number;
        maxGifts?: number;
        requestQuota?: number;
        features?: Record<string, unknown>;
    }) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<CreatePlanResponse>(
                '/admin/subscriptions/plans',
                data,
                { headers: adminHeaders() }
            );
            return response.data;
        } catch (err) {
            const message = parseError(err, 'Failed to create subscription plan');
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ─── Subscribe Client to Plan ─────────────────────────────────────────────
    /**
     * POST /api/admin/subscriptions/subscribe
     * Body: { clientId: number, planId: number }
     * Backend returns: { success, message, data: { clientName, planName, credentials? } }
     * NOTE: credentials (rawApiKey, webhookSecret) are only returned ONCE on first subscription.
     */
    const subscribeClient = useCallback(async (clientId: number, planId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<SubscribeClientResponse>(
                '/admin/subscriptions/subscribe',
                { clientId, planId },
                { headers: adminHeaders() }
            );
            return response.data;
        } catch (err) {
            const message = parseError(err, 'Failed to subscribe client to plan');
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ─── Get Client Pool Analytics ────────────────────────────────────────────
    /**
     * GET /api/admin/pools/:clientId
     * (Also accessible as GET /api/admin/clients/:clientId/pools)
     * Returns full analytics: overall metrics, per-pool breakdown, and recent activity.
     * Pass clientId to view a specific client's data.
     */
    const getClientAnalytics = useCallback(async (clientId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<PoolAnalyticsResponse>(
                `/admin/pools/${clientId}`,
                { headers: adminHeaders() }
            );
            return response.data;
        } catch (err) {
            const message = parseError(err, 'Failed to fetch client analytics');
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ─── Reset Client Pool ────────────────────────────────────────────────────
    /**
     * POST /api/admin/clients/:clientId/reset-pools
     * Body: { giftId?: number } (omit giftId to reset ALL pools for the client)
     * Returns list of affected participants so admin can issue refunds.
     */
    const resetClientPool = useCallback(async (clientId: number, giftId?: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<PoolResetResponse>(
                `/admin/clients/${clientId}/reset-pools`,
                giftId !== undefined ? { giftId } : {},
                { headers: adminHeaders() }
            );
            return response.data;
        } catch (err) {
            const message = parseError(err, 'Failed to reset client pool');
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        createClient,
        createSubscriptionPlan,
        subscribeClient,
        getClientAnalytics,
        resetClientPool,
        isLoading,
        error,
    };
};
