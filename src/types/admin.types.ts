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
// Matches backend: GET /api/admin/stats
export interface DashboardStatsResponse {
    success: boolean;
    data: {
        metrics: {
            totalActiveClients: number;
            totalEndUsers: number;
            totalSpinsProcessed: number;
        };
        financials: {
            totalWalletRecharges: number;
            totalPendingClientBalances: number;
        };
    };
}
// Matches backend: GET /api/admin/clients
export interface PlatformClient {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
    paymentStatus: string;
    walletBalance: number;
    globalReserve: number;
    stats: {
        totalSpins: number;
        totalPools: number;
        totalRecharges: number;
    };
    createdAt: string;
}

export interface ClientListResponse {
    success: boolean;
    data: PlatformClient[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
export interface ClientDetailResponse {
    success: boolean;
    data: {
        profile: {
            id: number;
            name: string;
            isActive: boolean;
            createdAt: string;
            user: {
                id: number;
                email: string;
                name: string;
                role: string;
            };
        };
        configuration: {
            targetRtpPercent: number;
            platformCutPercent: number;
            clientProfitPercent: number;
            poolSize: number;
            probabilityTable: Array<{
                multiplier: number;
                probability: number;
            }>;
        };
        billing: {
            paymentStatus: string;
            walletBalance: number;
            globalReserve: number;
            hasTestApiKey: boolean;
            hasLiveApiKey: boolean;
            liveWebhookUrl: string | null;
            testWebhookUrl: string | null;
        };
        analytics: {
            totalSpinsProcessed: number;
            totalVolumeProcessed: number;
            totalPayouts: number;
            totalPlatformRevenue: number;
            totalClientProfit: number;
            totalReserveAdded: number;
        };
        recharges: {
            totalRechargeCount: number;
            totalRechargeAmount: number;
        };
        pools: {
            totalPools: number;
            breakdown: {
                PENDING: number;
                FILLED: number;
                COMPLETED: number;
                CANCELLED: number;
            };
        };
    };
}
export interface LedgerEntry {
    id: string;
    clientId: number;
    type: string;
    amount: number;
    balanceAfter: number;
    description: string;
    referenceId: string;
    createdAt: string;
    client: {
        id: number;
        name: string;
    };
}

export interface LedgerListResponse {
    success: boolean;
    data: LedgerEntry[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
