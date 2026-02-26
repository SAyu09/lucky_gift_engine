// src/types/b2b.types.ts

export interface Client {
    id: string;
    companyName: string;
    apiKeyHash: string;
    webhookSecret: string | null;
    webhookUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface WebhookPayload {
    event: string;
    timestamp: string;
    data: any; // Type strictly when we define standard payload models
}
