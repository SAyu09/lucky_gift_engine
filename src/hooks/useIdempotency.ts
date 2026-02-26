// src/hooks/useIdempotency.ts
import { useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook to manage idempotency keys (transaction IDs) for critical actions like spins.
 * It ensures a single unique ID is used for an intended logical transaction,
 * preventing double-charges if a user rapidly clicks a button.
 */
export const useIdempotency = () => {
    const transactionIdRef = useRef<string | null>(null);

    /**
     * Generates a new unique UUID v4.
     * Subsequent calls to generateNewId() will OVERWRITE the previous ID.
     * Useful when starting a completely NEW transaction.
     */
    const generateNewId = useCallback((): string => {
        const newId = uuidv4();
        transactionIdRef.current = newId;
        return newId;
    }, []);

    /**
     * Retrieves the current transaction ID, generating one if it doesn't exist yet.
     * Subsequent calls will return the SAME ID until generateNewId or clearId is called.
     */
    const getCurrentId = useCallback((): string => {
        if (!transactionIdRef.current) {
            transactionIdRef.current = uuidv4();
        }
        return transactionIdRef.current;
    }, []);

    /**
     * Clears the current transaction ID.
     * Useful after a transaction has successfully completed or definitively failed 
     * and you want to ensure the next action is a fresh transaction.
     */
    const clearId = useCallback((): void => {
        transactionIdRef.current = null;
    }, []);

    return {
        generateNewId,
        getCurrentId,
        clearId,
    };
};
