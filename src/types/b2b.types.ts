// src/types/b2b.types.ts
// Aligned with backend Prisma Client model

export enum PaymentStatus {
    UNPAID = 'UNPAID',
    PAID = 'PAID',
    PENDING = 'PENDING'
}

export interface Client {
    id: number;
    name: string;               // Backend uses 'name', not 'companyName'
    webhookUrl: string;
    webhookSecret: string | null;
    isActive: boolean;
    // Unified Math & Billing properties
    clientProfitPercent: number;
    platformCutPercent: number;
    globalReserve: number;
    poolSize: number;
    walletBalance: number;
    probabilityTable: any;
    paymentStatus: PaymentStatus;
    paymentTransactionId?: string;
    createdAt: string;
    updatedAt: string;
}

// Matches backend webhook payload that the engine sends to client webhooks
export interface WebhookPayload {
    clientId: number;
    transactionId: string;
    giftId: number;
    userId: number;
    betAmount: number;
    winAmount: number;
    multiplier: number;
    poolId: string;
    timestamp: string;
}

// Matches backend: PUT /api/client/profile/webhook
export interface UpdateWebhookResponse {
    success: boolean;
    message: string;
    webhookUrl: string;
}

// Matches backend: POST /api/payments/initiate
export interface InitiatePaymentResponse {
    success: boolean;
    redirectUrl: string;
    transactionId: string;
    message?: string;
}
