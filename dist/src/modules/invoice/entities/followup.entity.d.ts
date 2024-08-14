import { InvoiceFollowUp } from "@prisma/client";
export declare class Followup implements InvoiceFollowUp {
    id: number;
    note: string;
    isConcern: boolean;
    isResolved: boolean;
    addedDate: Date;
    addedById: number;
    invoiceId: number;
    isDeleted: boolean;
}
