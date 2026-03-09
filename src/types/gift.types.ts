// src/types/gift.types.ts
// Types aligned with backend engine - multiplier-based probability table model

export interface ProbabilityTier {
    multiplier: number;
    probability: number;
}

// Matches backend Prisma GiftConfig model
export interface GiftConfig {
    id: number;
    giftId: number;
    clientId: number;
    name: string;
    entryPrice: number;
    targetRtpPercent: number;
    probabilityTable: ProbabilityTier[];
    poolSize?: number;
    houseEdgePercent?: number;
    prizeDistribution?: Array<{ rank: number; multiplier: number }>;
    globalReserve?: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Matches backend: POST /api/client/config → { success, giftId, config }
export interface CreateConfigResponse {
    success: boolean;
    giftId: number;
    config: GiftConfig;
}

// Matches backend: GET /api/client/config → { success, count, configs }
export interface ListConfigsResponse {
    success: boolean;
    count: number;
    configs: GiftConfig[];
}

// Matches backend: GET /api/client/config/:giftId → { success, config }
export interface GetConfigResponse {
    success: boolean;
    config: GiftConfig;
}

// Matches backend hybrid spin result: POST /api/client/spin
export interface HybridSpinResult {
    transactionId: string;
    giftId: number;
    userId: number;
    betAmount: number;
    processingTimeMs: number;
    instantWin: {
        winAmount: number;
        multiplier: number;
    };
    poolStatus: {
        poolId: string;
        slot: number;
        status: 'PENDING' | 'POOL_FILLED' | 'PROCESSING';
        spotsRemaining?: number;
    };
}

export interface SpinResponse {
    success: boolean;
    message: string;
    data: HybridSpinResult;
}

// Matches backend: GET /api/client/pool/status/:poolId
export interface PoolStatusResponse {
    success: boolean;
    poolId: string;
    status: string;
    participantCount: number;
    participants: unknown[];
}

// Matches backend: GET /api/client/pool/active/:giftId
export interface ActivePoolResponse {
    success: boolean;
    poolId: string;
    participantCount: number;
    spotsRemaining: number | 'unknown';
}

// Matches backend LuckyTransaction audit record
export interface LuckyTransaction {
    transactionId: string;
    giftId: number;
    userId: number;
    betAmount: number;
    winAmount: number;
    multiplier: number;
    isDowngraded: boolean;
    payoutStatus: 'PENDING' | 'PAID' | 'FAILED';
    createdAt: string;
}
