import { Quotation } from "@prisma/client";
export declare class QuotationFiltersDto implements Partial<Quotation> {
    leadId: number;
    id: number;
    quoteNumber: string;
    projectId: number;
    clientId: number;
    projectTypeId: number;
    __status: number[];
    fromDate?: string;
    toDate?: string;
    assignedToId?: number;
}
