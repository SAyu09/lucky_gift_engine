// src/types/admin.types.ts
// Types for Admin API responses - matches backend admin controllers exactly

// Matches backend: POST /api/admin/clients
export interface CreateClientResponse {
    success: boolean;
    warning: string;
    data: {
        clientId: number;
        name: string;
        rawApiKey: string;
        webhookSecret: string;
        webhookUrl: string;
    };
}

// Matches backend Prisma SubscriptionPlan model + PlanType enum
export type PlanType = 'MONTHLY' | 'PAY_AS_YOU_GO';

export interface SubscriptionPlan {
    id: number;
    name: string;
    type: PlanType;
    description?: string | null;
    price: number;
    maxGifts: number;
    requestQuota: number;
    features: Record<string, unknown>;
    isActive: boolean;
    createdAt: string;
}

// Matches backend: POST /api/admin/subscriptions/plans
export interface CreatePlanResponse {
    success: boolean;
    data: SubscriptionPlan;
}

// Matches backend: POST /api/admin/subscriptions/subscribe
export interface SubscribeClientResponse {
    success: boolean;
    message: string;
    data: {
        clientName: string;
        planName: string;
        type: PlanType;
        apiRequestsBalance: number;
        isUnlimited: boolean;
        credentials: {
            warning: string;
            rawApiKey: string;
            webhookSecret: string;
            instructions: string;
        } | null;
    };
}

// Matches backend pool analytics response from PoolAnalyticsController
export interface PoolBreakdown {
    giftId: number;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
    targetRtpPercent: number;
    actualRtpPercent: number;
    metrics: {
        totalEntries: number;
        completedMultiplayerRounds: number;
        totalCollected: number;
        totalInstantPayout: number;
        totalPoolPayout: number;
        totalCombinedPayout: number;
        houseProfit: number;
        globalReserveBalance: number;
    };
}

export interface PoolAnalyticsResponse {
    success: boolean;
    data: {
        client: {
            id: number;
            name: string;
            isActive: boolean;
        };
        overallAnalytics: {
            totalSpinsProcessed: number;
            totalMultiplayerPoolsCompleted: number;
            totalCollectedAmount: number;
            payoutBreakdown: {
                instantWins: number;
                poolWins: number;
                combinedTotal: number;
            };
            totalHouseProfit: number;
            actualGlobalRtp: number;
            totalRtpShieldInterventions: number;
        };
        pools: PoolBreakdown[];
        recentActivity: {
            instantSpins: Array<{
                transactionId: string;
                userId: number;
                betAmount: number;
                winAmount: number;
                multiplier: number;
                timestamp: string;
            }>;
            completedPools: Array<{
                roundId: string;
                payoutTotal: number;
                winnerCount: number;
                timestamp: string;
            }>;
        };
    };
}

// Matches backend: POST /api/admin/clients/:clientId/reset-pools
export interface PoolResetDetail {
    giftId: number;
    clearedPoolId: string;
    affectedUsersCount: number;
    affectedParticipants: Array<{ userId: number; transactionId: string }>;
}

export interface PoolResetResponse {
    success: boolean;
    message: string;
    data: {
        clearedGifts: number;
        details: PoolResetDetail[];
    };
}
