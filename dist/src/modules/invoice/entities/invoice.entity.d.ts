import { Invoice as __Invoice } from "@prisma/client";
export declare class Invoice implements Partial<__Invoice> {
    id: number;
    title: string;
    message: string;
    projectId: number;
    clientId: number;
    amount: number;
    vatAmount: number;
    total: number;
    status: number;
    file: string;
    isDeleted: boolean;
    addedDate: Date;
    sentDate: Date;
    modifiedDate: Date;
    addedById: number;
    modifiedById: number;
}
