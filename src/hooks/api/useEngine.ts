// src/hooks/api/useEngine.ts
import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useIdempotency } from '@/hooks/useIdempotency';
import {
    SpinResponse,
    HybridSpinResult,
    PoolStatusResponse,
    ActivePoolResponse,
} from '@/types/gift.types';

/**
 * Engine hook — wraps the Lucky Gift spin engine API calls.
 *
 * IMPORTANT AUTH NOTES:
 * - Spin endpoint (/api/client/spin) uses apiKeyAuth (x-api-key required)
 *   The apiClient interceptor auto-injects x-api-key from localStorage('b2b-api-key')
 * - userId MUST be a number (backend validates this; string will fail validation)
 * - transactionId provides idempotency — same ID = same spin (prevents double-charge)
 */
export const useEngine = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuthStore();
    const { generateNewId, clearId } = useIdempotency();

    // ─── Helper: parse backend error message ─────────────────────────────────
    const parseError = (err: unknown, fallback: string): string => {
        const e = err as { response?: { data?: { message?: string; error?: string } }; message?: string };
        return e.response?.data?.message || e.response?.data?.error || e.message || fallback;
    };

    // ─── Execute Hybrid Spin ──────────────────────────────────────────────────
    /**
     * POST /api/client/spin
     * Body: { giftId: number, userId: number, amount: number, transactionId: string }
     * Backend returns: {
     *   success, message,
     *   data: {
     *     transactionId, giftId, userId, betAmount, processingTimeMs,
     *     instantWin: { winAmount, multiplier },
     *     poolStatus: { poolId, slot, status, spotsRemaining? }
     *   }
     * }
     *
     * The spin executes two things simultaneously:
     * 1. Instant slot-machine style win/loss (instantWin)
     * 2. Entry into a multiplayer raffle lobby (poolStatus)
     */
    const executeSpin = useCallback(async (
        giftId: number,
        amount: number
    ): Promise<HybridSpinResult> => {
        if (!user?.id) {
            const msg = 'User not authenticated';
            setError(msg);
            throw new Error(msg);
        }

        setIsLoading(true);
        setError(null);

        // Generate a fresh idempotency key for this individual spin
        const transactionId = generateNewId();

        try {
            const response = await apiClient.post<SpinResponse>('/client/spin', {
                giftId,
                userId: user.id,    // CRITICAL: must be number, not string
                amount,
                transactionId,
            });

            // Backend wraps in .data
            const result = response.data.data;

            // Clear idempotency ID on success — next spin gets a fresh UUID
            clearId();

            return result;
        } catch (err) {
            const message = parseError(err, 'Spin execution failed');
            setError(message);
            // Do NOT clearId() on failure — caller may want to retry the same transactionId
            // (backend's idempotency check will recognize it as a duplicate-safe retry)
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, [user, generateNewId, clearId]);

    // ─── Get Pool Status ──────────────────────────────────────────────────────
    /**
     * GET /api/client/pool/status/:poolId
     * Returns current state of a specific pool (participant count, status, participants list)
     */
    const getPoolStatus = useCallback(async (poolId: string): Promise<PoolStatusResponse> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<PoolStatusResponse>(
                `/client/pool/status/${poolId}`
            );
            return response.data;
        } catch (err) {
            const message = parseError(err, `Failed to get pool status for ${poolId}`);
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ─── Get Active Pool ──────────────────────────────────────────────────────
    /**
     * GET /api/client/pool/active/:giftId
     * Returns the currently open pool for a gift (if any).
     * Returns null if no pool is open (404 from backend — expected, not an error).
     */
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
                return null; // No active pool — valid state
            }
            const message = parseError(err, `Failed to get active pool for gift ${giftId}`);
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        executeSpin,
        getPoolStatus,
        getActivePool,
        isLoading,
        error,
    };
};
