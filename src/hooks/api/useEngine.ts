// src/hooks/api/useEngine.ts
import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useIdempotency } from '@/hooks/useIdempotency';

interface SpinPayload {
    giftId: number;
    userId: string;
    amount: number;
    transactionId: string;
}

interface SpinResponse {
    multiplier: number;
    winAmount: number;
}

export const useEngine = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuthStore();
    const { generateNewId, clearId } = useIdempotency();

    /**
     * Execute a spin against the Continuous Engine
     */
    const executeSpin = useCallback(async (giftId: number, amount: number) => {
        if (!user?.id) {
            setError('User not authenticated');
            throw new Error('User not authenticated');
        }

        setIsLoading(true);
        setError(null);

        // Generate a fresh idempotency key for this spin
        const transactionId = generateNewId();

        const payload: SpinPayload = {
            giftId,
            userId: user.id,
            amount,
            transactionId,
        };

        try {
            const response = await apiClient.post<SpinResponse>('/client/spin', payload);
            // Clear the ID on success so the next spin gets a fresh one naturally, 
            // though generateNewId() also forces a fresh one anyway.
            clearId();
            return response.data;
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } }, message?: string };
            const errorMessage = error.response?.data?.error || error.message || 'Spin execution failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [user, generateNewId, clearId]);

    return {
        executeSpin,
        isLoading,
        error,
    };
};
