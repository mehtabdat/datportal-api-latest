import { Quotation as __Quotation } from "@prisma/client";
export declare class Quotation implements Partial<__Quotation> {
    id: number;
    leadId: number;
    scopeOfWork: string;
    file: string;
    type: number;
    status: number;
    isDeleted: boolean;
    addedDate: Date;
    sentDate: Date;
    modifiedDate: Date;
    addedById: number;
    modifiedById: number;
}
