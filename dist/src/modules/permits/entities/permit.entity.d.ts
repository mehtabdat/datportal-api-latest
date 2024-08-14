import { Permit as __Permit } from "@prisma/client";
export declare class Permit implements Partial<__Permit> {
    id: number;
    clientId: number;
    projectId: number;
    authorityId: number;
    title: string;
    remarks: string;
    financeStatus: number;
    clientStatus: number;
    approvedDate: Date;
    expiryDate: Date;
    addedDate: Date;
    modifiedDate: Date;
    addedById: number;
    modifiedById: number;
}
