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

// Matches backend pool analytics response from PoolAnalyticsController
export interface PoolBreakdown {
    giftId: number;
    name: string;
    metrics: {
        totalEntries: number;
        completedMultiplayerRounds: number;
        totalCollected: number;
        totalInstantPayout: number;
        totalPoolPayout: number;
        totalCombinedPayout: number;
        clientProfitAmt: number;     // Replaced houseProfit
        platformCutAmt: number;      // Replaced houseProfit
        reserveAdd: number;          // Replaced globalReserveBalance/jackpotAdd
    };
}

export interface PoolAnalyticsResponse {
    success: boolean;
    data: {
        client: {
            id: number;
            name: string;
            isActive: boolean;
            globalReserve: number;
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
            totalClientProfit: number;
            totalPlatformCut: number;
            totalReserveAdded: number;
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
