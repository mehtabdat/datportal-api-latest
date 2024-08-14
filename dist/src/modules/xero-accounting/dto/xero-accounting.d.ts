export declare const XeroEnventCategory: {
    CONTACT: string;
    INVOICE: string;
    QUOTATION: string;
};
export declare const XeroEnventTpe: {
    UPDATE: string;
    CREATE: string;
    DELETE: string;
};
export type WehbookEventType = {
    resourceUrl?: string;
    resourceId: string;
    tenantId: string;
    tenantType?: 'ORGANISATION';
    eventCategory: keyof typeof XeroEnventCategory;
    eventType: keyof typeof XeroEnventTpe;
    eventDateUtc?: Date;
};
export type WebhookEventPayload = {
    events: WehbookEventType[];
    firstEventSequence: number;
    lastEventSequence: number;
    entropy: string;
};
